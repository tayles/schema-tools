import type { JSONSchema, JSONValue } from './json-to-string';
import type { SchemaObject, ValidateFunction } from 'ajv';

import type Ajv from 'ajv';
import type { ErrorInstance } from './model';
import type { Pointers } from './json-parse-source-map';

interface JsonSchemaValidationSuccess {
  ok: true;
  schema: string;
  validateFn: ValidateFunction<unknown>;
}

interface JsonSchemaValidationFailure {
  ok: false;
  errors: ErrorInstance[];
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
  ajv: Ajv,
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

export function generateError(keyword: string, err: Error): ErrorInstance {
  return {
    keyword,
    message: err.message,
    schemaPath: '',
    instancePath: '',
    params: {},
  };
}

export function decorateErrors(
  errors: ErrorInstance[],
  pointers: Pointers | null,
): ErrorInstance[] {
  return errors.map((error) => ({
    ...error,
    pointer: pointers?.[error.instancePath ?? '/'],
  }));
}
