import type { ErrorObject, SchemaObject, ValidateFunction } from 'ajv';
import type { JSONSchema, JSONValue } from './json';

import type Ajv from 'ajv';

interface JsonSchemaValidationSuccess {
  ok: true;
  schema: string;
  validateFn: ValidateFunction<unknown>;
}

interface JsonSchemaValidationFailure {
  ok: false;
  errors: ErrorObject[];
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
    console.error(err);
    console.error(ajv.errors);
    console.warn(ajv.errorsText(ajv.errors));
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
    console.error(err);
    console.error(ajv.errors);
    console.warn(validateFn.errors);
    const errors = validateFn?.errors || [
      generateError('strict-mode', err as Error),
    ];
    return { ok: false, errors };
  }
}

export function generateError(keyword: string, err: Error): ErrorObject {
  return {
    keyword,
    message: err.message,
    schemaPath: '',
    instancePath: '',
    params: {},
  };
}
