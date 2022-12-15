export const SupportedLanguagesArr = ['json', 'yaml'] as const;

export type SupportedLanguages = typeof SupportedLanguagesArr[number];

export function getOtherLanguage(
  language: SupportedLanguages,
): SupportedLanguages {
  return language === 'json' ? 'yaml' : 'json';
}
