import type { ErrorInstance, Severity, ValidationErrorInstance } from './model';
import type { JSONSchema, JSONValue } from './json-to-string';
import type { SchemaObject, ValidateFunction } from 'ajv';

import Ajv from 'ajv';
import type { Pointers } from './json-parse-source-map';
import addFormats from 'ajv-formats';

interface JsonSchemaValidationSuccess {
  ok: true;
  schema: string;
  validateFn: ValidateFunction<unknown>;
}

interface JsonSchemaValidationFailure {
  ok: false;
  errors: ValidationErrorInstance[];
}

type JsonSchemaValidationResult =
  | JsonSchemaValidationSuccess
  | JsonSchemaValidationFailure;

interface DataValidationSuccess {
  ok: true;
}

type DataValidationResult = DataValidationSuccess | JsonSchemaValidationFailure;

export function validateJsonSchema(
  schemaObj: JSONSchema,
  ajv: Ajv,
): JsonSchemaValidationResult {
  try {
    const validateFn = ajv.compile(schemaObj);
    const schema = (validateFn.schema as SchemaObject)?.$schema as string;
    return { ok: true, schema, validateFn };
  } catch (err) {
    const errors = ajv.errors || [generateError('strict-mode', err as Error)];
    return { ok: false, errors };
  }
}

export function validateDataAgainstJsonSchema(
  dataObj: JSONValue,
  validateFn: ValidateFunction<unknown>,
): DataValidationResult {
  try {
    const valid = validateFn(dataObj);

    if (!valid || validateFn.errors) {
      const errors = validateFn?.errors || [
        generateError('strict-mode', new Error('Not validddddd')),
      ];
      return { ok: false, errors };
    }

    return { ok: true };
  } catch (err) {
    const errors = validateFn?.errors || [
      generateError('strict-mode', err as Error),
    ];
    return { ok: false, errors };
  }
}

export function generateError(
  keyword: string,
  err: Error,
  severity: Severity = 'error',
): ErrorInstance {
  return {
    keyword,
    message: err.message,
    schemaPath: '',
    instancePath: '',
    params: {},
    severity,
  };
}

export function decorateValidationErrors(
  errors: ValidationErrorInstance[],
  pointers: Pointers | null,
): ErrorInstance[] {
  return errors.map((error) => {
    const pointer = pointers?.[error.instancePath ?? '/'];
    const start = pointer?.value || pointer?.key;
    const end = pointer?.valueEnd || pointer?.keyEnd;

    // map to zero based offsets
    if (start) {
      start.line--;
      start.column--;
    }
    if (end) {
      end.line--;
      end.column--;
    }

    return {
      ...error,
      severity: 'error',
      start,
      end,
    };
  });
}

export function createAjvInstance(): Ajv {
  const ajv = new Ajv({ allErrors: true, verbose: true, strict: true });
  addFormats(ajv);
  return ajv;
}
