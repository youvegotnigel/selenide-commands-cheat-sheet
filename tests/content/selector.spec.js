import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Selectors entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"$$x(xpath)" is its own tile next to "$x(xpath)"', async ({ page }) => {
    const entry = await itemIn(page, 'Selectors', '$$x(xpath)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java: public static ElementsCollection $$x(String xpathExpression)
    // selenide-core 7.19.0 SelenideElement.java: ElementsCollection $$x(String xpath)
    expect(entry.code).toContain('$$x("//table[@id=\'users\']//tr")');
    expect(entry.code).toContain('$("#users").$$x(".//td")');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#$$x(java.lang.String)'
    );
    // $x() now documents only itself
    const single = await itemIn(page, 'Selectors', '$x(xpath)');
    expect(single.code).not.toContain('$$x');
  });

  // Selectors added after the 7.19.0 Selectors.java audit. Each: [name, level, snippet, source].
  const added = [
    [
      'byPlaceholder()',
      'intermediate',
      'byPlaceholder("Search")',
      // selenide-core 7.19.0 Selectors.java: public static By byPlaceholder(String placeholderText), @since 7.12.0
    ],
    [
      'byTitle()',
      'intermediate',
      'byTitle("Close")',
      // selenide-core 7.19.0 Selectors.java: public static By byTitle(String title)
    ],
    [
      'byAltText()',
      'intermediate',
      'byAltText("Company logo")',
      // selenide-core 7.19.0 Selectors.java: public static By byAltText(String title), @since 7.12.0
    ],
    [
      'byTextCaseInsensitive()',
      'intermediate',
      'byTextCaseInsensitive("sign in")',
      // selenide-core 7.19.0 Selectors.java: public static By byTextCaseInsensitive(String elementText)
    ],
    [
      'withTextCaseInsensitive()',
      'intermediate',
      'withTextCaseInsensitive("welcome")',
      // selenide-core 7.19.0 Selectors.java: public static By withTextCaseInsensitive(String elementText)
    ],
    [
      'withTagAndText()',
      'intermediate',
      'withTagAndText("li", "overdue")',
      // selenide-core 7.19.0 Selectors.java: public static By withTagAndText(String tag, String elementText)
    ],
    [
      '$(By)',
      'beginner',
      '$(byText("Sign in"))',
      // selenide 7.19.0 Selenide.java: $(By seleniumSelector), $$(By seleniumSelector)
    ],
  ];

  for (const [name, level, snippet] of added) {
    test(`"${name}" exists at level ${level}, platform web`, async ({ page }) => {
      const entry = await itemIn(page, 'Selectors', name);
      expect(entry).not.toBeNull();
      expect(entry.level).toBe(level);
      expect(entry.platform).toBe('web');
      expect(entry.code).toContain(snippet);
    });
  }

  test('"$(By)" also shows the $$(By) collection form', async ({ page }) => {
    const entry = await itemIn(page, 'Selectors', '$(By)');
    expect(entry.code).toContain('$$(byClassName("error"))');
  });

  test('"byTagAndText()" no longer documents withTagAndText()', async ({ page }) => {
    const entry = await itemIn(page, 'Selectors', 'byTagAndText()');
    expect(entry.code).not.toContain('withTagAndText');
  });

  test('"shadowCss()" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Selectors', 'shadowCss()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Selectors.java: public static By shadowCss(String target, String... shadowHostsChain)
    // Target comes first, then the hosts from the outermost inwards (find-in-shadow-roots.js).
    expect(entry.code).toContain('shadowCss("button.submit", "#app-shell", "login-form")');
    // There is no Selenide shadowRoot() navigation on SelenideElement in 7.19.0.
    expect(entry.code).not.toContain('shadowRoot');
  });

  test('"shadowDeepCss()" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Selectors', 'shadowDeepCss()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Selectors.java: public static By shadowDeepCss(String target)
    expect(entry.code).toMatch(/shadowDeepCss\("[^",]+"\)/);
  });

  const relatives = [
    {
      name: 'parent()',
      call: '.parent()',
      // selenide-core 7.19.0 SelenideElement.java: SelenideElement parent(); GetParent.java: By.xpath("..")
      source: 'parent()',
    },
    {
      name: 'lastChild()',
      call: '.lastChild()',
      // selenide-core 7.19.0 SelenideElement.java: SelenideElement lastChild(); GetLastChild.java: xpath "*[last()]"
      source: 'lastChild()',
    },
    {
      name: 'closest()',
      call: '.closest("table")',
      // selenide-core 7.19.0 SelenideElement.java: SelenideElement closest(String selector);
      source: 'closest(String)',
    },
    {
      name: 'ancestor()',
      call: '.ancestor(".panel", 1)',
      // selenide-core 7.19.0 SelenideElement.java: SelenideElement ancestor(String selector, int index);
      source: 'ancestor(String, int)',
    },
    {
      name: 'sibling()',
      call: '.sibling(0)',
      // selenide-core 7.19.0 SelenideElement.java: SelenideElement sibling(int index);
      // GetSibling.java: following-sibling::*[index + 1], so index 0 is the nearest
      source: 'sibling(int)',
    },
    {
      name: 'preceding()',
      call: '.preceding(0)',
      // selenide-core 7.19.0 SelenideElement.java: SelenideElement preceding(int index);
      // GetPreceding.java: preceding-sibling::*[index + 1]
      source: 'preceding(int)',
    },
  ];

  for (const { name, call } of relatives) {
    test(`"${name}" exists at level intermediate, platform web`, async ({ page }) => {
      const entry = await itemIn(page, 'Selectors', name);
      expect(entry).not.toBeNull();
      expect(entry.level).toBe('intermediate');
      expect(entry.platform).toBe('web');
      expect(entry.code).toContain(call);
    });
  }

  test('the combined relative-element tiles are gone', async ({ page }) => {
    for (const name of [
      'parent() and lastChild()',
      'closest() and ancestor()',
      'sibling() and preceding()',
    ]) {
      expect(await itemIn(page, 'Selectors', name)).toBeNull();
    }
  });

  test('"closest()" has no index overload; "ancestor()" does', async ({ page }) => {
    const closest = await itemIn(page, 'Selectors', 'closest()');
    const ancestor = await itemIn(page, 'Selectors', 'ancestor()');
    // SelenideElement.java declares only closest(String selector), but ancestor(String, int).
    expect(closest.code).not.toMatch(/closest\("[^"]*",/);
    expect(ancestor.code).toMatch(/ancestor\("[^"]*", \d\)/);
  });

  test('"byTestId()" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Selectors', 'byTestId()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Selectors.java: public static By byTestId(String testId)
    expect(entry.code).toContain('byTestId(');
    // Selectors.java: DEFAULT_TEST_ID = "data-test-id", key "selenide.test-id.attribute"
    expect(entry.tip).toContain('data-test-id');
    expect(entry.tip).toContain('selenide.test-id.attribute');
  });

  test('"byText()" and "withText()" exist at level beginner, platform web', async ({ page }) => {
    const byText = await itemIn(page, 'Selectors', 'byText()');
    const withText = await itemIn(page, 'Selectors', 'withText()');
    expect(byText).not.toBeNull();
    expect(withText).not.toBeNull();
    expect([byText.level, withText.level]).toEqual(['beginner', 'beginner']);
    expect([byText.platform, withText.platform]).toEqual(['web', 'web']);
    // selenide-core 7.19.0 Selectors.java: public static By byText(String elementText)
    expect(byText.code).toContain('byText(');
    // selenide-core 7.19.0 Selectors.java: public static By withText(String elementText)
    expect(withText.code).toContain('withText(');
    // Web entries use com.codeborne.selenide.Selectors, never AppiumSelectors.
    expect(byText.code).not.toContain('AppiumSelectors');
    expect(withText.code).not.toContain('AppiumSelectors');
  });
});

test.describe('Javadoc gap fill: link text and label selectors (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"byLinkText()" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Selectors', 'byLinkText()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byLinkText(java.lang.String)'
    );
    // selenide-core 7.19.0 Selectors.java:296 byLinkText(String linkText)
    expect(entry.code).toContain('byLinkText("');
    expect(entry.code).toContain('import static com.codeborne.selenide.Selectors.');
    expect(entry.tip).toContain('By.linkText()');
  });

  test('"byPartialLinkText()" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Selectors', 'byPartialLinkText()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byPartialLinkText(java.lang.String)'
    );
    // selenide-core 7.19.0 Selectors.java:303 byPartialLinkText(String)
    expect(entry.code).toContain('byPartialLinkText("');
    expect(entry.code).toContain('import static com.codeborne.selenide.Selectors.');
    expect(entry.tip).toContain('By.partialLinkText()');
  });

  test('the combined tiles are gone: byLinkText() and byPartialLinkText()', async ({ page }) => {
    for (const name of ['byLinkText() and byPartialLinkText()']) {
      expect(await itemIn(page, 'Selectors', name)).toBeNull();
    }
  });

  test('"byLabel()" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Selectors', 'byLabel()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byLabel(java.lang.String,com.codeborne.selenide.TextMatchOptions)'
    );
    // selenide-core 7.19.0 Selectors.java:96 byLabel(String), :100 byLabel(String, TextMatchOptions)
    expect(entry.code).toContain('byLabel("');
    // TextMatchOptions.java:19 public static TextMatchOptions partialText()
    expect(entry.code).toContain('TextMatchOptions.partialText()');
    // find-elements-by-label.js: the label's "for" attribute selects the element by id.
    expect(entry.tip).toContain('for');
  });
});
