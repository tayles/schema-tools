import type { Thing, SupportedLanguages } from '@/utils/model';
import {
  type JSONSchema,
  stringToJson,
  type JSONValue,
  jsonToString,
} from '@/utils/json';
import type { ErrorObject, ValidateFunction } from 'ajv';
import Ajv from 'ajv';
import {
  generateError,
  validateJsonSchema,
  validateDataAgainstJsonSchema,
} from '@/utils/validate-json-schema';
import { formatJson, formatYaml } from '@/utils/prettier-format';
import { jsonToYaml, yamlToJson } from '@/utils/yaml';
import {
  deriveDataFromSchema,
  deriveSchemaFromData,
} from '@/utils/derive-json-schema';

const ajv = new Ajv({ allErrors: true, verbose: true, strict: true });
let validateFn: ValidateFunction<unknown> | null = null;

const store: Record<
  Thing,
  { obj: JSONValue | null; formatted: string | null }
> = {
  schema: {
    obj: null,
    formatted: null,
  },
  data: {
    obj: null,
    formatted: null,
  },
};

export interface ChangeRequest {
  command: 'input-change';
  thing: Thing;
  language: SupportedLanguages;
  input: string;
}

export interface FormatRequest {
  command: 'format';
  thing: Thing;
  language: SupportedLanguages;
}

export interface ConvertRequest {
  command: 'convert';
  thing: Thing;
  language: SupportedLanguages;
}

export interface DeriveDataRequest {
  command: 'derive-data';
}

export interface DeriveSchemaRequest {
  command: 'derive-schema';
}

export type WorkerRequest =
  | ChangeRequest
  | FormatRequest
  | ConvertRequest
  | DeriveDataRequest
  | DeriveSchemaRequest;

export interface ParseResult {
  command: 'parse-result';
  thing: Thing;
  valid: boolean;
  errors: ErrorObject[];
}

export interface ValidationResult {
  command: 'validation-result';
  thing: Thing;
  valid: boolean;
  errors: ErrorObject[];
}

export interface FormattingResult {
  command: 'formatting-result';
  thing: Thing;
  formatted: boolean;
  errors: ErrorObject[];
}

export interface FormatPayloadResult {
  command: 'format-payload';
  thing: Thing;
  formatted: string | null;
}

export interface ConvertResult {
  command: 'convert-result';
  thing: Thing;
  converted: string | null;
}

export interface DeriveDataResult {
  command: 'derive-data-result';
  data: string | null;
}

export interface DeriveSchemaResult {
  command: 'derive-schema-result';
  schema: string | null;
}

export type WorkerResult =
  | ParseResult
  | ValidationResult
  | FormattingResult
  | FormatPayloadResult
  | ConvertResult
  | DeriveDataResult
  | DeriveSchemaResult;

function parse(input: string, language: SupportedLanguages) {
  let valid = false;
  let obj: JSONValue | null = null;
  let errors: ErrorObject[] = [];

  try {
    console.time('parse');
    obj = language === 'yaml' ? yamlToJson(input) : stringToJson(input);
    valid = true;
  } catch (err) {
    // failed to parse
    errors = [generateError('parse', err as Error)];
  } finally {
    console.timeEnd('parse');
  }
  return { valid, obj, errors };
}

function validateSchema(schema: JSONValue) {
  let valid = false;
  let errors: ErrorObject[] = [];

  try {
    console.time('validate-schema');
    const validationResult = validateJsonSchema(schema as JSONSchema, ajv);
    valid = validationResult.ok;
    if (validationResult.ok) {
      validateFn = validationResult.validateFn;
    } else {
      errors = validationResult.errors;
      validateFn = null;
    }
  } catch (err) {
    // failed to parse
    errors = [generateError('validate-schema', err as Error)];
  } finally {
    console.timeEnd('validate-schema');
  }
  return { valid, errors };
}

function validateData(data: JSONValue) {
  let valid = false;
  let errors: ErrorObject[] = [];

  if (validateFn) {
    try {
      console.time('validate-data');
      const validationResult = validateDataAgainstJsonSchema(
        data,
        ajv,
        validateFn,
      );
      valid = validationResult.ok;
      if (!validationResult.ok) {
        errors = validationResult.errors;
      }
    } catch (err) {
      // failed to parse
      errors = [generateError('validate-data', err as Error)];
    } finally {
      console.timeEnd('validate-data');
    }
  }
  return { valid, errors };
}

function format(input: string, language: SupportedLanguages) {
  let formatted = false;
  let formattedValue: string | null = null;
  let errors: ErrorObject[] = [];

  try {
    console.time('format');
    formattedValue =
      language === 'json' ? formatJson(input) : formatYaml(input);
    formatted =
      formattedValue.length === input.length && formattedValue === input;
  } catch (err) {
    // failed to parse
    errors = [generateError('format', err as Error)];
  } finally {
    console.timeEnd('format');
  }
  return { formatted, formattedValue, errors };
}

function onInputChange(req: ChangeRequest) {
  const { thing, language, input } = req;

  const { valid, obj, errors } = parse(input, language);
  sendMessageToMainThread({
    command: 'parse-result',
    thing,
    valid,
    errors,
  });

  store[thing].obj = obj;

  if (obj) {
    const { valid, errors } =
      thing === 'schema' ? validateSchema(obj) : validateData(obj);
    sendMessageToMainThread({
      command: 'validation-result',
      thing,
      valid,
      errors,
    });
  }

  {
    const { formatted, formattedValue, errors } = format(input, language);
    sendMessageToMainThread({
      command: 'formatting-result',
      thing,
      formatted,
      errors,
    });

    store[thing].formatted = formattedValue;
  }
}

function onFormatRequest(req: FormatRequest) {
  const { thing } = req;

  sendMessageToMainThread({
    command: 'format-payload',
    thing,
    formatted: store[thing].formatted,
  });
}

function onConvertRequest(req: ConvertRequest) {
  const { thing, language } = req;

  const obj = store[thing].obj;

  if (!obj) return;

  const converted = language === 'json' ? jsonToString(obj) : jsonToYaml(obj);

  sendMessageToMainThread({
    command: 'convert-result',
    thing,
    converted,
  });
}

function onDeriveDataRequest(req: DeriveDataRequest) {
  if (!store.schema.obj) return;

  const data = jsonToString(deriveDataFromSchema(store.schema.obj));

  sendMessageToMainThread({
    command: 'derive-data-result',
    data,
  });
}

function onDeriveSchemaRequest(req: DeriveSchemaRequest) {
  if (!store.data.obj) return;

  const schema = jsonToString(deriveSchemaFromData(store.data.obj));
  sendMessageToMainThread({
    command: 'derive-schema-result',
    schema,
  });
}

/**
 * Validates a JSON Schema
 */
addEventListener('message', (event: MessageEvent<WorkerRequest>) => {
  console.log(':: Worker IN', event.data.command, event.data);
  switch (event.data.command) {
    case 'input-change':
      onInputChange(event.data);
      break;
    case 'format':
      onFormatRequest(event.data);
      break;
    case 'convert':
      onConvertRequest(event.data);
      break;
    case 'derive-data':
      onDeriveDataRequest(event.data);
      break;
    case 'derive-schema':
      onDeriveSchemaRequest(event.data);
      break;
  }
});

function sendMessageToMainThread(response: WorkerResult) {
  postMessage(response);
}
