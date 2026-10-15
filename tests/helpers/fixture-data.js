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

// Names chosen for the cell rules in the 2026-10-15 spec, section 3: prefixes, a "(" after a
// space, and key lengths 3, 11, 12, 13, 18, 24, 25 and 27 around the size boundaries (10/11 and 24/25).
export const CELL_FIXTURE = [
  {
    cat: 'Setup & Config',
    cls: 'config',
    color: '#72a0f5',
    items: [
      item(
        'Configuration.browserSize',
        'intermediate',
        'web',
        'Configuration.browserSize = "1920x1080";'
      ),
      item('SelenideAppium.$()', 'beginner', 'mobile', 'SelenideAppium.$(By.id("x")).tap();'),
      item('pageLoadTime', 'advanced', 'web', 'Configuration.pageLoadTimeout = 30000;'),
      item('thirteen_char', 'beginner', 'web', 'open("/thirteen"); // fixture'),
      item('twenty_four_characters_x', 'beginner', 'web', 'open("/twenty-four"); // fixture'),
      item('twenty_five_characters_xy', 'beginner', 'web', 'open("/twenty-five"); // fixture'),
      item('Selenide dependency (Maven)', 'beginner', 'web', '<dependency>fixture</dependency>'),
    ],
  },
  {
    cat: 'Conditions',
    cls: 'condition',
    color: '#fb923c',
    items: [item('shouldHave(text())', 'beginner', 'both', '$("h1").shouldHave(text("Hi"));')],
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
