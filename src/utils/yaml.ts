import { dump, load } from 'js-yaml';

import type { JSONValue } from './json';

export function jsonToYaml(obj: JSONValue): string {
  return dump(obj, {
    // filename: 'x.json',
  });
}

export function yamlToJson(str: string): JSONValue {
  return load(str, {
    filename: 'x.yaml',
  }) as JSONValue;
}
