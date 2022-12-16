import type { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';

import parseJson from 'json-parse-even-better-errors';

export type JSONSchema = JSONSchema4 | JSONSchema6 | JSONSchema7;

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonToString(object: any): string {
  return JSON.stringify(object, undefined, 2) + '\n';
}

export function stringToJson(str: string): JSONValue {
  return parseJson(str);
}
