import {
  type JSONObject,
  type JSONValue,
  isJsonObject,
} from './json-to-string';
import { indexInListSortCompareFn } from './sort';
import isArray from 'lodash/isArray';

/**
 * An opinionated list of how json schema keys should be ordered
 */
const JSON_SCHEMA_SORTED_KEYS = [
  '$comment',
  '$id',
  '$schema',

  'title',
  'description',

  '$ref',

  'type',
  'format',
  'default',

  'enum',
  'const',
  'pattern',
  'multipleOf',

  'readOnly',
  'writeOnly',

  'minItems',
  'minLength',
  'minProperties',
  'minimum',
  'exclusiveMinimum',

  'maxItems',
  'maxLength',
  'maxProperties',
  'maximum',
  'exclusiveMaximum',

  'contentMediaType',
  'contentEncoding',
  'examples',

  'required',

  'uniqueItems',
  'additionalItems',
  'additionalProperties',
  'items',

  'contains',

  'properties',
  'patternProperties',
  'dependencies',
  'propertyNames',

  'if',
  'then',
  'else',
  'allOf',
  'anyOf',
  'oneOf',
  'not',

  'definitions',
  '$defs',
];

/**
 * Standardise sorting of keys of a json schema
 *
 * @see JSON_SCHEMA_SORTED_KEYS
 */
export function sortJsonSchemaKeys(obj: JSONValue): JSONValue {
  if (!obj || !isJsonObject(obj)) {
    return obj;
  }

  const sortedObj = Object.keys(obj)
    .sort((a, b) => indexInListSortCompareFn(a, b, JSON_SCHEMA_SORTED_KEYS))
    .reduce((newObj, key) => {
      newObj[key] = sortJsonSchemaKeys(obj[key] ?? null);
      return newObj;
    }, {} as JSONObject);

  fixJsonSchemaRequiredFieldsOrder(sortedObj);

  return sortedObj;
}

/**
 * Mutate object to sort required keys based on position in properties map
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fixJsonSchemaRequiredFieldsOrder(obj: JSONValue): void {
  if (!obj || !isJsonObject(obj)) {
    return;
  }

  const requiredFields = obj['required'] as string[];
  const properties = obj['properties'] as JSONObject[];

  if (
    requiredFields &&
    isArray(requiredFields) &&
    properties &&
    isJsonObject(properties)
  ) {
    const propertyKeys = Object.keys(properties);
    requiredFields.sort((a, b) => indexInListSortCompareFn(a, b, propertyKeys));
  }

  Object.values(obj).forEach(fixJsonSchemaRequiredFieldsOrder);
}
