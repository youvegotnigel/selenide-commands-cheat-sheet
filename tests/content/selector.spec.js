import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Selectors entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
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

  test('"closest() and ancestor()" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Selectors', 'closest() and ancestor()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideElement.java: SelenideElement closest(String selector);
    expect(entry.code).toContain('.closest("table")');
    // selenide-core 7.19.0 SelenideElement.java: SelenideElement ancestor(String selector, int index);
    expect(entry.code).toContain('.ancestor(".panel", 1)');
    // closest has no index overload in 7.19.0 (only closest(String)), although the
    // ancestor() Javadoc mentions closest("selector", 0).
    expect(entry.code).not.toMatch(/closest\("[^"]*",/);
  });

  test('"sibling() and preceding()" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Selectors', 'sibling() and preceding()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideElement.java: SelenideElement sibling(int index);
    // GetSibling.java: int siblingIndex = (int) firstOf(args) + 1; so index 0 is the nearest
    expect(entry.code).toContain('.sibling(0)');
    // selenide-core 7.19.0 SelenideElement.java: SelenideElement preceding(int index);
    expect(entry.code).toContain('.preceding(0)');
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

  test('"byLinkText() and byPartialLinkText()" exists at level beginner, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Selectors', 'byLinkText() and byPartialLinkText()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byLinkText(java.lang.String)'
    );
    // selenide-core 7.19.0 Selectors.java:296 byLinkText(String linkText), :303 byPartialLinkText(String)
    expect(entry.code).toContain('byLinkText("');
    expect(entry.code).toContain('byPartialLinkText("');
    expect(entry.code).toContain('import static com.codeborne.selenide.Selectors.');
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
