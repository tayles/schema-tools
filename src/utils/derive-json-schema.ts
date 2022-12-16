import { JSONSchemaFaker } from 'json-schema-faker';
import type { JSONValue } from './json';
import toJsonSchema from 'to-json-schema';

export function deriveSchemaFromData(data: JSONValue): JSONValue {
  return toJsonSchema(data);
}

export function deriveDataFromSchema(schema: JSONValue): JSONValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return JSONSchemaFaker.generate(schema as any) as any;
}
