import { describe, it, expect } from 'vitest';
import { translations, Language } from './translations';

function assertMatchingKeys(referenceObj: unknown, targetObj: unknown, path = ''): void {
  const ref = referenceObj as Record<string, unknown>;
  const target = targetObj as Record<string, unknown>;
  const referenceKeys = Object.keys(ref).sort();
  const targetKeys = Object.keys(target).sort();

  // Assert keys match exactly
  expect(targetKeys, `Keys mismatch at path: "${path}"`).toEqual(referenceKeys);

  for (const key of referenceKeys) {
    const currentPath = path ? `${path}.${key}` : key;
    const refVal = ref[key];
    const targetVal = target[key];

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
