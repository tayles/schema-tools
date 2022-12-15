import { type SupportedLanguages } from '@/utils/model';

export interface ParseRequest {
  language: SupportedLanguages;
  filename: string;
  value: string;
}

export interface ParseResponse {
  language: SupportedLanguages;
  errors: string[];
}

addEventListener('message', (event: MessageEvent<ParseRequest>) => {
  const { value, language, filename } = event.data;

  console.log(
    `Parse lang [${language}] filename [${filename}] size [${value.length}]`,
  );

  console.time('format');
  const parsed = fn(value);
  console.timeEnd('format');

  const response: ParseResponse = {
    language,
    errors,
  };

  postMessage(response);
});
