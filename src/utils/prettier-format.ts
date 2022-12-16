import prettier, { type Options } from 'prettier';

import parserBabel from 'prettier/parser-babel';
import parserYaml from 'prettier/parser-yaml';

const defaultPrettierOptions: Options = {
  semi: false,
};

export function formatJson(str: string): string {
  return prettier.format(str, {
    ...defaultPrettierOptions,
    filepath: 'x.json',
    plugins: [parserBabel],
  });
}

export function formatYaml(str: string): string {
  return prettier.format(str, {
    ...defaultPrettierOptions,
    filepath: 'x.yaml',
    plugins: [parserYaml],
  });
}
