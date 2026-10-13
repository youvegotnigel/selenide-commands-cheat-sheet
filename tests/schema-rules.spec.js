import { test, expect } from '@playwright/test';
import * as rules from './helpers/schema.js';

// Each validator is checked against a hand-written good and bad fixture. The
// expected problem strings are written out literally from the rule tables in
// the spec (section 4), so a validator that silently accepts bad data fails here.

const good = () => ({
  name: 'open()',
  level: 'beginner',
  platform: 'web',
  desc: 'Opens a page.',
  tip: 'Relative URLs use baseUrl.',
  docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html',
  code: 'open("/login"); // relative URL',
});
const cat = (items, over = {}) => [
  { cat: 'Nav', cls: 'navigation', color: '#0ea5e9', items, ...over },
];

test.describe('schema validators', () => {
  test('a fully valid category produces no problems from any rule', () => {
    const data = cat([good()]);
    for (const [name, rule] of Object.entries(rules)) {
      if (typeof rule !== 'function') continue;
      expect(rule(data), name).toEqual([]);
    }
  });

  test('missingFieldProblems reports a missing, an empty and a whitespace field', () => {
    const a = { ...good(), name: 'a()' };
    delete a.platform;
    const b = { ...good(), name: 'b()', tip: '' };
    const c = { ...good(), name: 'c()', desc: '   ' };
    expect(rules.missingFieldProblems(cat([a, b, c]))).toEqual([
      '"a()" in "Nav" is missing "platform"',
      '"b()" in "Nav" is missing "tip"',
      '"c()" in "Nav" has blank "desc"',
    ]);
  });

  test('levelProblems rejects a level outside the enum', () => {
    expect(rules.levelProblems(cat([{ ...good(), level: 'expert' }]))).toEqual([
      '"open()" has invalid level: "expert"',
    ]);
  });

  test('platformProblems rejects android, ios and a missing platform', () => {
    const items = [
      { ...good(), name: 'a()', platform: 'android' },
      { ...good(), name: 'b()', platform: 'ios' },
      { ...good(), name: 'c()', platform: undefined },
    ];
    expect(rules.platformProblems(cat(items))).toEqual([
      '"a()" has invalid platform: "android"',
      '"b()" has invalid platform: "ios"',
      '"c()" has invalid platform: "undefined"',
    ]);
  });

  test('docsProblems accepts the allowlist and rejects everything else', () => {
    const ok = [
      'https://selenide.org/documentation.html',
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#text(java.lang.String)',
      'https://github.com/selenide/selenide/blob/main/modules/appium/README.md#features',
      'https://github.com/selenide-examples/selenide-appium/blob/main/README.md',
    ];
    const bad = [
      'http://selenide.org/documentation.html', // not https
      'https://appium.io/docs/en/latest/', // host not approved
      'https://github.com/appium/java-client', // github org not approved
      'https://github.com/selenidex/fork', // prefix lookalike
      'https://www.selenide.org/', // subdomain not on the list
      'not a url',
    ];
    const items = [...ok, ...bad].map((docs, i) => ({ ...good(), name: `n${i}()`, docs }));
    expect(rules.docsProblems(cat(items))).toEqual([
      '"n4()" in "Nav" has a docs URL outside the allowlist: "http://selenide.org/documentation.html"',
      '"n5()" in "Nav" has a docs URL outside the allowlist: "https://appium.io/docs/en/latest/"',
      '"n6()" in "Nav" has a docs URL outside the allowlist: "https://github.com/appium/java-client"',
      '"n7()" in "Nav" has a docs URL outside the allowlist: "https://github.com/selenidex/fork"',
      '"n8()" in "Nav" has a docs URL outside the allowlist: "https://www.selenide.org/"',
      '"n9()" in "Nav" has an unparseable docs URL: "not a url"',
    ]);
  });

  test('codeLengthProblems rejects code under 20 characters after trimming', () => {
    expect(rules.codeLengthProblems(cat([{ ...good(), code: '   open("/");      ' }]))).toEqual([
      '"open()" has a suspiciously short code snippet: "open("/");"',
    ]);
  });

  test('duplicateNameProblems finds duplicates within and across categories', () => {
    const data = [
      { cat: 'A', cls: 'a', color: '#000000', items: [good(), good()] },
      { cat: 'B', cls: 'b', color: '#000000', items: [good()] },
    ];
    expect(rules.duplicateNameProblems(data)).toEqual([
      'Duplicate "open()" in category "A"',
      '"open()" appears in more than one category',
    ]);
  });

  test('colorProblems rejects 3-digit and named colors', () => {
    const data = [
      { cat: 'A', cls: 'a', color: '#fff', items: [good()] },
      { cat: 'B', cls: 'b', color: 'red', items: [{ ...good(), name: 'x()' }] },
    ];
    expect(rules.colorProblems(data)).toEqual([
      'Category "A" has invalid color: "#fff"',
      'Category "B" has invalid color: "red"',
    ]);
  });

  test('filterClashProblems rejects category names equal to a quick filter', () => {
    const data = ['All', 'beginner', 'Popular', 'MOBILE', 'Mobile Gestures'].map((c, i) => ({
      cat: c,
      cls: `c${i}`,
      color: '#000000',
      items: [{ ...good(), name: `n${i}()` }],
    }));
    expect(rules.filterClashProblems(data)).toEqual([
      'Category "All" clashes with the quick filter "all"',
      'Category "beginner" clashes with the quick filter "beginner"',
      'Category "Popular" clashes with the quick filter "popular"',
      'Category "MOBILE" clashes with the quick filter "mobile"',
    ]);
  });

  test('nameCharProblems rejects < and > in names', () => {
    const items = [
      { ...good(), name: 'Container<T>' },
      { ...good(), name: 'Container (generic)' },
    ];
    expect(rules.nameCharProblems(cat(items))).toEqual([
      '"Container<T>" in "Nav" contains "<" or ">" (names are rendered as HTML)',
    ]);
  });

  test('dashProblems finds em and en dashes in any field, including platform', () => {
    const items = [
      { ...good(), name: 'a()', tip: 'Fast — mostly.' },
      { ...good(), name: 'b()', desc: 'Codes 200–299.' },
      { ...good(), name: 'c()', platform: 'web—' },
    ];
    expect(rules.dashProblems(cat(items))).toEqual([
      '"a()" in "Nav" has an em-dash in "tip"',
      '"b()" in "Nav" has an en-dash in "desc"',
      '"c()" in "Nav" has an em-dash in "platform"',
    ]);
  });

  test('categoryFieldProblems reports missing cat/cls/color and empty items', () => {
    expect(
      rules.categoryFieldProblems([{ cat: '', cls: 'x', color: '#000000', items: [] }])
    ).toEqual(['categories[0] missing "cat"', 'categories[0] missing or empty "items"']);
  });
});
