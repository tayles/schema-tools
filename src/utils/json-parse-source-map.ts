import * as jsonSourceMap from 'json-source-map';

export type PointerProp = 'value' | 'valueEnd' | 'key' | 'keyEnd';

export interface LineAndColumn {
  line: number;
  column: number;
}

export interface Location extends LineAndColumn {
  pos: number;
}

export type Pointer = Record<PointerProp, Location>;

export type Pointers = Record<string, Pointer>;

export interface ParseResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  pointers: Pointers;
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
