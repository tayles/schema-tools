import type { Thing, SupportedLanguages, ErrorInstance } from '@/utils/model';
import {
  type JSONSchema,
  type JSONValue,
  jsonToString,
  isJsonObject,
} from '@/utils/json-to-string';
import type { ValidateFunction } from 'ajv';
import Ajv from 'ajv';
import {
  generateError,
  validateJsonSchema,
  validateDataAgainstJsonSchema,
  decorateErrors,
} from '@/utils/jsonschema-validate';
import { formatJson, formatYaml } from '@/utils/prettier-format';
import { jsonToYaml, yamlToJson } from '@/utils/yaml';
import {
  deriveDataFromSchema,
  deriveSchemaFromData,
} from '@/utils/jsonschema-derive';
import {
  type Pointers,
  parseJsonWithSourceMap,
} from '@/utils/json-parse-source-map';
import { sortJsonSchemaKeys } from '@/utils/jsonschema-sort';

const ajv = new Ajv({ allErrors: true, verbose: true, strict: true });
let validateFn: ValidateFunction<unknown> | null = null;

const store: Record<
  Thing,
  { obj: JSONValue | null; formatted: string | null; pointers: Pointers | null }
> = {
  schema: {
    obj: null,
    formatted: null,
    pointers: null,
  },
  data: {
    obj: null,
    formatted: null,
    pointers: null,
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
  errors: ErrorInstance[];
}

export interface ValidationResult {
  command: 'validation-result';
  thing: Thing;
  valid: boolean;
  errors: ErrorInstance[];
}

export interface FormattingResult {
  command: 'formatting-result';
  thing: Thing;
  formatted: boolean;
  errors: ErrorInstance[];
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
  errors: ErrorInstance[];
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

function parse(thing: Thing, input: string, language: SupportedLanguages) {
  let valid = false;
  let obj: JSONValue | null = null;
  let pointers: Pointers | null = null;
  let errors: ErrorInstance[] = [];

  try {
    console.time('parse');
    if (language === 'yaml') {
      obj = yamlToJson(input);
      input = jsonToString(obj);
    }

    const parseResult = parseJsonWithSourceMap(input);
    obj = parseResult?.data;
    pointers = parseResult?.pointers ?? null;
    valid = true;
  } catch (err) {
    // failed to parse
    errors = [generateError('parse', err as Error)];
  } finally {
    console.timeEnd('parse');
  }
  return { valid, obj, pointers, errors };
}

function validateSchema(schema: JSONValue) {
  let valid = false;
  let errors: ErrorInstance[] = [];

  try {
    console.time('validate-schema');
    const validationResult = validateJsonSchema(schema as JSONSchema, ajv);
    valid = validationResult.ok;
    if (validationResult.ok) {
      validateFn = validationResult.validateFn;
    } else {
      errors = decorateErrors(validationResult.errors, store.schema.pointers);
      validateFn = null;
    }
  } catch (err) {
    errors = [generateError('validate-schema', err as Error)];
  } finally {
    console.timeEnd('validate-schema');
  }
  return { valid, errors };
}

function validateData(data: JSONValue) {
  let valid = false;
  let errors: ErrorInstance[] = [];

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
        errors = decorateErrors(validationResult.errors, store.data.pointers);
      }
    } catch (err) {
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
  let errors: ErrorInstance[] = [];

  try {
    console.time('format');
    formattedValue =
      language === 'json' ? formatJson(input) : formatYaml(input);
    formatted =
      formattedValue.length === input.length && formattedValue === input;
  } catch (err) {
    errors = [generateError('format', err as Error)];
  } finally {
    console.timeEnd('format');
  }
  return { formatted, formattedValue, errors };
}

function onInputChange(req: ChangeRequest) {
  const { thing, language, input } = req;

  const parseResult = parse(thing, input, language);
  const { valid, pointers, errors } = parseResult;
  let { obj } = parseResult;
  sendMessageToMainThread({
    command: 'parse-result',
    thing,
    valid,
    errors,
  });

  if (thing === 'schema' && isJsonObject(obj)) {
    console.time('sort');
    obj = sortJsonSchemaKeys(obj);
    console.timeEnd('sort');
  }

  // TODO: This is nasty - think of a way to persist state in worker thread nicely
  store[thing].obj = obj;
  store[thing].pointers = pointers;

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
    const { formatted, formattedValue, errors } = format(
      obj ? jsonToString(obj) : input,
      language,
    );
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onDeriveDataRequest(req: DeriveDataRequest) {
  if (!store.schema.obj) return;

  let data: string | null = null;
  let errors: ErrorInstance[] = [];

  try {
    console.time('derive-data');
    data = jsonToString(deriveDataFromSchema(store.schema.obj));
  } catch (err) {
    errors = [generateError('derive-data', err as Error)];
  } finally {
    console.timeEnd('derive-data');
  }
  sendMessageToMainThread({
    command: 'derive-data-result',
    data,
    errors,
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
