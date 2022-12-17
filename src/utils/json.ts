import * as jsonSourceMap from 'json-source-map';

import type { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';

import parseJson from 'json-parse-even-better-errors';

export type JSONSchema = JSONSchema4 | JSONSchema6 | JSONSchema7;

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export type PointerProp = 'value' | 'valueEnd' | 'key' | 'keyEnd';

export interface Location {
  line: number;
  column: number;
  pos: number;
}

export type Pointer = Record<PointerProp, Location>;

export type Pointers = Record<string, Pointer>;

export interface ParseResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  pointers: Pointers;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonToString(object: any): string {
  return JSON.stringify(object, undefined, 2) + '\n';
}

export function stringToJson(str: string): JSONValue {
  return parseJson(str);
}

export function parseJsonWithSourceMap(
  str: string,
): ParseResult | null | never {
  if (!str) {
    return null;
  }

  const result = jsonSourceMap.parse(str);

  if (!result?.data) {
    return null;
  }

  if (typeof result.data !== 'object') {
    throw new Error('Not a JSON object');
  }

  return result;
}
