import type { JSONObject, JSONValue } from './json-to-string';

import isPlainObject from 'lodash/isPlainObject';

const JSON_SCHEMA_SORTED_KEYS = [
  '$id',
  '$ref',
  '$schema',
  '$comment',
  '$defs',
  'type',
  'enum',
  'const',
  'multipleOf',
  'maximum',
  'exclusiveMaximum',
  'minimum',
  'exclusiveMinimum',
  'maxLength',
  'minLength',
  'pattern',
  'items',
  'additionalItems',
  'maxItems',
  'minItems',
  'uniqueItems',
  'contains',
  'maxProperties',
  'minProperties',
  'required',
  'properties',
  'patternProperties',
  'additionalProperties',
  'dependencies',
  'propertyNames',
  'if',
  'then',
  'else',
  'allOf',
  'anyOf',
  'oneOf',
  'not',
  'format',
  'contentMediaType',
  'contentEncoding',
  'definitions',
  'title',
  'description',
  'default',
  'readOnly',
  'writeOnly',
  'examples',
];

export function sortJsonSchemaKeys(unsortedObj: JSONObject): JSONObject {
  return Object.keys(unsortedObj)
    .sort()
    .reduce((obj, key) => {
      const value = unsortedObj[key] as JSONValue;
      obj[key] = isPlainObject(value)
        ? sortJsonSchemaKeys(value as JSONObject)
        : value;
      return obj;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as any);
}
