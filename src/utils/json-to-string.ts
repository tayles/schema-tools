import type { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';

import isPlainObject from 'lodash/isPlainObject';
import parseJson from 'json-parse-even-better-errors';

export type JSONSchema = JSONSchema4 | JSONSchema6 | JSONSchema7;

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export interface JSONObject {
  [x: string]: JSONValue;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isJsonObject(obj: any): obj is JSONObject {
  return isPlainObject(obj);
}

export function jsonToString(object: JSONValue): string {
  return JSON.stringify(object, undefined, 2) + '\n';
}

export function stringToJson(str: string): JSONValue {
  return parseJson(str);
}
