import type { ErrorObject } from 'ajv';

export const SupportedLanguagesArr = ['json', 'yaml'] as const;

export type SupportedLanguages = typeof SupportedLanguagesArr[number];

export function getOtherLanguage(
  language: SupportedLanguages,
): SupportedLanguages {
  return language === 'json' ? 'yaml' : 'json';
}

export type Thing = 'schema' | 'data';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ErrorInstance extends ErrorObject {}
