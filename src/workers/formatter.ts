import { type SupportedLanguages } from '@/utils/model';
import parserBabel from 'prettier/parser-babel';
import parserYaml from 'prettier/parser-yaml';
import prettier, { type Options } from 'prettier';

export interface FormatRequest {
  language: SupportedLanguages;
  filename: string;
  value: string;
}

export interface FormatResponse {
  language: SupportedLanguages;
  value: string;
}

const defaultPrettierOptions: Options = {
  semi: false,
};

function formatJson(str: string): string {
  return prettier.format(str, {
    ...defaultPrettierOptions,
    filepath: 'x.json',
    plugins: [parserBabel],
  });
}

function formatYaml(str: string): string {
  return prettier.format(str, {
    ...defaultPrettierOptions,
    filepath: 'x.yaml',
    plugins: [parserYaml],
  });
}

addEventListener('message', (event: MessageEvent<FormatRequest>) => {
  const { value, language, filename } = event.data;

  console.log(
    `Format lang [${language}] filename [${filename}] size [${value.length}]`,
  );

  const fn = language === 'json' ? formatJson : formatYaml;
  console.time('format');
  const formatted = fn(value);
  console.timeEnd('format');

  const response: FormatResponse = {
    language,
    value: formatted,
  };

  postMessage(response);
});
