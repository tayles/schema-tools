import type { JSONSchema, JSONValue } from './json';

import toJsonSchema from 'to-json-schema';

export function deriveSchemaFromData(data: JSONValue): JSONSchema {
  return toJsonSchema(data) as JSONSchema;
}
