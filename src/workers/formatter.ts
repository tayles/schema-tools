import { type SupportedLanguages } from '@/utils/model';
import { formatJson, formatYaml } from '@/utils/prettier-format';

export interface FormatRequest {
  language: SupportedLanguages;
  filename: string;
  value: string;
}

export interface FormatResponse {
  language: SupportedLanguages;
  value: string;
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
