// Serves a small, hand-written dataset in place of js/data/index.js so UI tests
// can assert exact, independently known results (tile names, counts, hash
// strings) that do not change as real content grows.

const item = (name, level, platform, code, extra = {}) => ({
  name,
  level,
  platform,
  desc: `Fixture entry ${name}.`,
  tip: 'Fixture tip.',
  docs: 'https://selenide.org/documentation.html',
  code,
  ...extra,
});

export const FIXTURE_CATEGORIES = [
  {
    cat: 'Setup & Config',
    cls: 'config',
    color: '#06b6d4',
    items: [
      item('alpha()', 'beginner', 'web', 'open("/alpha"); // first page'),
      item('beta()', 'intermediate', 'web', 'Configuration.timeout = 6000;'),
    ],
  },
  {
    cat: 'Conditions',
    cls: 'condition',
    color: '#f97316',
    items: [item('gamma()', 'beginner', 'both', '$$(".row").shouldHave(size(2));')],
  },
  {
    cat: 'Mobile Selectors',
    cls: 'mobile-selector',
    color: '#a855f7',
    items: [
      item('delta()', 'advanced', 'mobile', '$(AppiumBy.accessibilityId("Go")).tap();'),
      item('epsilon()', 'beginner', 'mobile', '$(byText("Ok")).click();'),
    ],
  },
];

export async function useFixtureData(page, categories = FIXTURE_CATEGORIES) {
  await page.route('**/js/data/index.js', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `export const categories = ${JSON.stringify(categories)};`,
    })
  );
}
