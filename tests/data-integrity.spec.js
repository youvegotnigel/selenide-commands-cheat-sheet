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

  // Javadoc gap fill (plan 2026-10-17): the 25 entries added from the 7.19.0 Javadoc.
  const gapFillNames = [
    'getText() and text()',
    'val() and getValue()',
    'getAttribute()',
    'innerHtml() and getOwnText()',
    'exists() and isDisplayed()',
    'texts()',
    'getSelectedOptionText() and getSelectedOptionValue()',
    'getOptions() and getSelectedOptions()',
    'getSelectedRadio()',
    'url() and source()',
    'updateHash()',
    'zoom()',
    'byLinkText() and byPartialLinkText()',
    'byLabel()',
    'getFocusedElement()',
    'switchTo().alert()',
    'switchTo().newWindow()',
    'actions()',
    'toWebElement() and getWrappedElement()',
    'cached()',
    'getWebDriverLogs()',
    'emulateDevice() and resetEmulation()',
    'atBottom()',
    'downloadFiles(DownloadOptions)',
    'Configuration.browserBinary',
  ];

  test('Javadoc gap fill entries avoid deprecated APIs', () => {
    const found = data.flatMap((c) => c.items).filter((i) => gapFillNames.includes(i.name));
    expect(found.length).toBe(25);
    // selenide 7.19.0 Selenide.java:1071,1085 clearBrowserCookies() and clearBrowserLocalStorage()
    // are @Deprecated(since = "7.17.0"); Configuration.java:65-75 holdBrowserOpen is @Deprecated.
    for (const item of found) {
      expect(item.code, item.name).not.toMatch(
        /clearBrowserCookies\(|clearBrowserLocalStorage\(|holdBrowserOpen/
      );
    }
  });

  test('final review fixes: getter tips, C4 snippet, focused element and zoom claims', () => {
    const byName = (n) => data.flatMap((c) => c.items).find((i) => i.name === n);
    // SelenideElement.java 7.19.0 links NOT RECOMMENDED (do-not-use-getters-in-tests) on all of these.
    for (const n of [
      'val() and getValue()',
      'getAttribute()',
      'innerHtml() and getOwnText()',
      'exists() and isDisplayed()',
      'getSelectedOptionText() and getSelectedOptionValue()',
    ]) {
      expect(byName(n).tip, n).toContain('NOT RECOMMENDED');
    }
    // SelenideDriver.java:302 getFocusedElement() returns $(new FocusedElementLocator()), a lazy
    // proxy over get-focused-element.js (document.activeElement): never null, body when nothing focused.
    const focused = byName('getFocusedElement()');
    expect(focused.desc).not.toContain('null');
    expect(focused.tip).not.toContain('reads once');
    expect(focused.code).not.toContain('!= null');
    expect(focused.tip).toContain('body');
    // SelenideDriver.java:404 getSelectedRadio reads once, so a check behind a null test can be skipped.
    expect(byName('getSelectedRadio()').code).not.toMatch(/\.should(Have|Be)\(/);
    // zoom.js: document.body.style.transform = 'scale(f)'; the next page load resets it.
    const zoom = byName('zoom()');
    expect(zoom.tip).toContain('transform');
    expect(zoom.tip).not.toContain('rest of the session');
  });
});
