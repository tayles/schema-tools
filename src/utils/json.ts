import parseJson from 'json-parse-even-better-errors';

type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonToString(object: any): string {
  return JSON.stringify(object, undefined, 2);
}

export function stringToJson(str: string): JSONValue {
  return parseJson(str);
}
