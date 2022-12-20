import type { ErrorObject } from 'ajv';
import { JSONSchema } from './json-to-string';
import type { LineAndColumn } from './json-parse-source-map';

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
export interface ValidationErrorInstance extends ErrorObject {}

export interface ErrorInstance<
  K extends string = string,
  P = Record<string, unknown>,
  S = unknown,
> {
  keyword: K;
  instancePath: string;
  schemaPath: string;
  params: P;
  propertyName?: string;
  message?: string;
  schema?: S;
  parentSchema?: JSONSchema;
  data?: unknown;

  severity: Severity;
  start?: LineAndColumn;
  end?: LineAndColumn;
}
