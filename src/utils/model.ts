import type { ErrorObject } from 'ajv';
import type { MarkerLocation } from './monaco';
import type { Pointer } from './json-parse-source-map';

export const SupportedLanguagesArr = ['json', 'yaml'] as const;

export type SupportedLanguages = typeof SupportedLanguagesArr[number];

export function getOtherLanguage(
  language: SupportedLanguages,
): SupportedLanguages {
  return language === 'json' ? 'yaml' : 'json';
}

export type Thing = 'schema' | 'data';

export const SeverityArr = ['debug', 'info', 'warn', 'error'] as const;
export type Severity = typeof SeverityArr[number];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ErrorInstance extends ErrorObject {
  severity?: Severity;
  pointer?: Pointer | null;
  markerLocation?: MarkerLocation | null;
}
