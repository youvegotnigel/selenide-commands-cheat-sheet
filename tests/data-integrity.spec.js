import { test, expect } from '@playwright/test';
import * as rules from './helpers/schema.js';

// Applies every schema rule (tests/helpers/schema.js, spec section 4) to the
// real js/data categories, read from the page global. The rules themselves are
// proven against hand-written fixtures in schema-rules.spec.js.

test.describe('Data integrity', () => {
  let data;
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    data = await page.evaluate(() => window.categories);
  });

  test('categories array is non-empty', () => {
    expect(data.length).toBeGreaterThan(0);
  });

  const checks = [
    ['every category has cat, cls, color and items', 'categoryFieldProblems'],
    ['every item has all seven fields, none blank', 'missingFieldProblems'],
    ['every level is beginner | intermediate | advanced', 'levelProblems'],
    ['every platform is web | mobile | both', 'platformProblems'],
    ['every docs URL is https and on the allowlist', 'docsProblems'],
    ['every code snippet is at least 20 characters', 'codeLengthProblems'],
    ['names are unique within and across categories', 'duplicateNameProblems'],
    ['every category color is a 6-digit hex', 'colorProblems'],
    ['no category name equals a quick filter', 'filterClashProblems'],
    ['no name contains < or >', 'nameCharProblems'],
    ['no field contains an em-dash or en-dash', 'dashProblems'],
  ];
  for (const [title, rule] of checks) {
    test(title, () => {
      expect(rules[rule](data)).toEqual([]);
    });
  }
});
