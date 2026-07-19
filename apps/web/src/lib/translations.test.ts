import { describe, it, expect } from 'vitest';
import { translations, Language } from './translations';

function assertMatchingKeys(referenceObj: any, targetObj: any, path = ''): void {
  const referenceKeys = Object.keys(referenceObj).sort();
  const targetKeys = Object.keys(targetObj).sort();

  // Assert keys match exactly
  expect(targetKeys, `Keys mismatch at path: "${path}"`).toEqual(referenceKeys);

  for (const key of referenceKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const refVal = referenceObj[key];
    const targetVal = targetObj[key];

    if (typeof refVal === 'object' && refVal !== null) {
      expect(typeof targetVal, `Type mismatch at path: "${currentPath}"`).toBe('object');
      assertMatchingKeys(refVal, targetVal, currentPath);
    } else {
      expect(typeof targetVal, `Type mismatch (expected string) at path: "${currentPath}"`).toBe('string');
      expect(targetVal.length, `Empty translation string at path: "${currentPath}"`).toBeGreaterThan(0);
    }
  }
}

describe('Translations Completeness', () => {
  const languages: Language[] = ['es', 'fr', 'pt', 'ar', 'zh'];

  languages.forEach((lang) => {
    it(`should match all translation keys and structures of the "en" package for "${lang}"`, () => {
      assertMatchingKeys(translations.en, translations[lang]);
    });
  });
});
