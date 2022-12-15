import type { ErrorObject, SchemaObject } from 'ajv';

import type Ajv from 'ajv';
import type { JSONSchema } from './json';

interface JsonSchemaValidationRersult {
  schema?: string;
  errors?: ErrorObject[];
}

export function validateJsonSchema(
  schemaObj: JSONSchema,
  ajv: Ajv,
): JsonSchemaValidationRersult {
  try {
    const validateFn = ajv.compile(schemaObj);
    const schema = (validateFn.schema as SchemaObject)?.$schema as string;
    return { schema };
  } catch (err) {
    console.error(err);
    console.error(ajv.errors);
    console.warn(ajv.errorsText(ajv.errors));
    const errors = ajv.errors || [generateError('strict-mode', err as Error)];
    return { errors };
  }
}

function generateError(keyword: string, err: Error): ErrorObject {
  return {
    keyword,
    message: err.message,
    schemaPath: '',
    instancePath: '',
    params: {},
  };
}
