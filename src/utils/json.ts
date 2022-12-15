// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonToString(object: any): string {
  return JSON.stringify(object, undefined, 2);
}

export function stringToJson(str: string): string {
  return JSON.parse(str);
}
