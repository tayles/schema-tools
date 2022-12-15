import { dump, load } from 'js-yaml';

import { getOtherLanguage, type SupportedLanguages } from '@/utils/model';
import { jsonToString, stringToJson } from '@/utils/json';

export interface ConvertRequest {
  language: SupportedLanguages;
  filename: string;
  value: string;
}

export interface ConvertResponse {
  language: SupportedLanguages;
  value: string;
}

function jsonToYaml(str: string): string {
  return dump(stringToJson(str), {
    // filename: 'x.json',
  });
}

function yamlToJson(str: string): string {
  return jsonToString(
    load(str, {
      filename: 'x.yaml',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
  );
}

/**
 * Converts between JSON <> YAML
 */
addEventListener('message', (event: MessageEvent<ConvertRequest>) => {
  const { value, language, filename } = event.data;
  const newLanguage = getOtherLanguage(language);

  console.log(
    `Convert ${language}->${newLanguage} filename [${filename}] size [${value.length}]`,
  );

  const fn = language === 'json' ? jsonToYaml : yamlToJson;
  console.time('convert');
  const converted = fn(value);
  console.timeEnd('convert');

  const response: ConvertResponse = {
    language: newLanguage,
    value: converted,
  };

  postMessage(response);
});
