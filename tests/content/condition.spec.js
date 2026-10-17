import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Element Conditions entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"shouldHave(visibleText())" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldHave(visibleText())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    // selenide-core 7.19.0 GetVisibleText.java: private static final JavaScript js = new JavaScript("visible-text.js");
    // The text is read with JavaScript, so the condition is browser-only.
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition visibleText(String text) {
    expect(entry.code).toContain('visibleText("');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition exactVisibleText(String text) {
    expect(entry.code).toContain('exactVisibleText("');
    // CHANGELOG.md at v7.19.0: "#1741 add `visibleText()` conditions for overflow-truncated elements"
    expect(entry.desc).toMatch(/Added in Selenide 7\.19\.0\.$/);
  });

  test('"Custom WebElementCondition" exists at level advanced, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'Custom WebElementCondition');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 WebElementCondition.java: public abstract class WebElementCondition {
    expect(entry.code).toContain('extends WebElementCondition');
    // selenide-core 7.19.0 WebElementCondition.java: public abstract CheckResult check(Driver driver, WebElement element);
    expect(entry.code).toContain('public CheckResult check(Driver driver, WebElement element)');
    // selenide-core 7.19.0 CheckResult.java: public CheckResult(boolean checkSucceeded, @Nullable Object actualValue) {
    expect(entry.code).toContain('new CheckResult(');
    // selenide-core 7.19.0 Condition.java: public final class Condition {
    // Condition is final and has no apply(); the 6.x subclassing form does not compile.
    expect(entry.code).not.toContain('extends Condition');
    expect(entry.code).not.toContain('new Condition(');
    expect(entry.code).not.toMatch(/boolean apply\(/);
  });

  test('"should(match())" exists at level intermediate, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'should(match())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition match(String description, Predicate<WebElement> predicate) {
    expect(entry.code).toMatch(/match\("[^"]+", \w+ ->/);
  });

  test('"should(condition, Duration)" exists at level intermediate, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Element Conditions', 'should(condition, Duration)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 SelenideElement.java: SelenideElement shouldBe(WebElementCondition condition, Duration timeout);
    expect(entry.code).toContain('.shouldBe(visible, Duration.ofSeconds(');
    // SelenideElement.java 7.19.0 has no waitUntil(condition, long); the timeout is a Duration.
    expect(entry.code).not.toContain('waitUntil(');
  });

  test('"and()" exists at level intermediate, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'and()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition and(String name, WebElementCondition condition1, WebElementCondition condition2,
    expect(entry.code).toMatch(/\band\("[^"]+", \w+, \w+/);
    // There is no and(condition1, condition2) overload; the name comes first.
    expect(entry.code).not.toMatch(/\band\((visible|enabled|exist)\b/);
  });

  test('"or()" exists at level intermediate, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'or()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition or(String name, WebElementCondition condition1, WebElementCondition condition2,
    expect(entry.code).toMatch(/\bor\("[^"]+", /);
  });

  // Every public static member of selenide-core 7.19.0 Condition.java, copied from the sources
  // jar and cross-checked against javadoc/current/.../Condition.html.
  const FACTORIES = [
    'attribute',
    'attributeMatching',
    'href',
    'value',
    'partialValue',
    'pseudo',
    'exactValue',
    'name',
    'type',
    'id',
    'matchText',
    'oneOfTexts',
    'oneOfTextsCaseSensitive',
    'oneOfExactTexts',
    'oneOfExactTextsCaseSensitive',
    'partialText',
    'partialTextCaseSensitive',
    'text',
    'selectedText',
    'textCaseSensitive',
    'exactText',
    'innerText',
    'visibleText',
    'exactVisibleText',
    'ownText',
    'ownTextCaseSensitive',
    'exactOwnText',
    'exactOwnTextCaseSensitive',
    'exactTextCaseSensitive',
    'tagName',
    'cssClass',
    'cssValue',
    'domAttribute',
    'domProperty',
    'match',
    'not',
    'and',
    'allOf',
    'or',
    'anyOf',
    'be',
    'have',
  ];
  const FIELDS = [
    'visible',
    'exist',
    'hidden',
    'appear',
    'disappear',
    'interactable',
    'readonly',
    'editable',
    'animated',
    'empty',
    'image',
    'focused',
    'enabled',
    'disabled',
    'selected',
    'checked',
    'clickable',
  ];

  test('every Condition factory and field appears in a snippet', async ({ page }) => {
    const code = await page.evaluate(() =>
      window.categories
        .find((c) => c.cat === 'Element Conditions')
        .items.map((i) => i.code)
        .join('\n')
    );
    const missing = [
      ...FACTORIES.filter((f) => !new RegExp(`\\b${f}\\(`).test(code)),
      // A field is used as an argument: shouldBe(visible), and("x", visible, enabled),
      // shouldBe(Condition.empty)
      ...FIELDS.filter((f) => !new RegExp(`[(,] ?(Condition\\.)?${f}\\b`).test(code)),
    ];
    expect(missing).toEqual([]);
  });

  // selenide-core 7.19.0 Condition.java: public static final WebElementCondition empty = and(...);
  // selenide-core 7.19.0 CollectionCondition.java: public static WebElementsCondition empty = size(0);
  // Under the "Static imports" entry (Condition.* and CollectionCondition.*), javac 17 rejects a
  // bare empty: "reference to empty is ambiguous". Snippets must qualify it.
  test('no snippet uses a bare empty', async ({ page }) => {
    const offenders = await page.evaluate(() =>
      window.categories.flatMap((c) =>
        c.items
          .filter((i) => /[(,] ?empty\b/.test(i.code.replace(/\/\/.*$/gm, '')))
          .map((i) => `${c.cat} / ${i.name}`)
      )
    );
    expect(offenders).toEqual([]);
  });

  test('"shouldHave(partialText())" exists at level intermediate, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldHave(partialText())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition partialText(String expectedText) {
    expect(entry.code).toContain('partialText("');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition partialTextCaseSensitive(String expectedText) {
    expect(entry.code).toContain('partialTextCaseSensitive("');
    // PartialText.java extends TextCondition and overrides match(actual, expected) only, so
    // Configuration.textCheck never applies; text() extends CaseInsensitiveTextCondition, which
    // switches on it.
    expect(entry.code).toContain('TextCheck.FULL_TEXT');
  });

  test('"shouldHave(ownText())" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldHave(ownText())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    // selenide-core 7.19.0 GetOwnText.java: private static final JavaScript js = new JavaScript("get-own-text.js");
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: ownText, ownTextCaseSensitive, exactOwnText, exactOwnTextCaseSensitive (String text)
    for (const f of [
      'ownText',
      'ownTextCaseSensitive',
      'exactOwnText',
      'exactOwnTextCaseSensitive',
    ]) {
      expect(entry.code).toMatch(new RegExp(`\\b${f}\\("`));
    }
  });

  test('"shouldHave(innerText())" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldHave(innerText())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    // selenide-core 7.19.0 GetInnerText.java: return requireNonNull(element.getAttribute("textContent"));
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition innerText(String text) {
    expect(entry.code).toContain('innerText("');
    // The text is textContent (outside IE), not the rendered innerText.
    expect(entry.tip).toContain('textContent');
  });

  test('"shouldHave(oneOfTexts())" exists at level intermediate, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldHave(oneOfTexts())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition oneOfTexts(String... texts) {
    expect(entry.code).toMatch(/\boneOfTexts\("[^"]+", "/);
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition oneOfExactTexts(String... texts) {
    expect(entry.code).toMatch(/\boneOfExactTexts\("/);
    // Condition.java Javadoc: @since 7.0.3
    expect(entry.desc).toMatch(/Added in Selenide 7\.0\.3\./);
  });

  test('"shouldHave(selectedText())" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldHave(selectedText())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    // selenide-core 7.19.0 SelectedText.java: private final JavaScript js = new JavaScript("get-selected-text.js");
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition selectedText(String expectedText) {
    expect(entry.code).toContain('selectedText("');
    // get-selected-text.js: element.value.substring(element.selectionStart, element.selectionEnd)
    // It reads a text field selection, not the chosen option of a select.
    expect(entry.code).not.toMatch(/\$\("select[^"]*"\)\.shouldHave\(selectedText/);
  });

  test('"shouldHave(partialValue())" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldHave(partialValue())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition partialValue(String expectedValue) {
    expect(entry.code).toContain('partialValue("');
  });

  test('"id(), name(), type() and tagName()" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Element Conditions', 'id(), name(), type() and tagName()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: id(String id), name(String name), type(String type), tagName(String cssClass)
    for (const f of ['id', 'name', 'type', 'tagName']) {
      expect(entry.code).toMatch(new RegExp(`shouldHave\\(${f}\\("`));
    }
  });

  test('"shouldHave(href())" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldHave(href())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition href(String href) {
    expect(entry.code).toMatch(/shouldHave\(href\("\//);
  });

  test('"shouldHave(domAttribute())" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldHave(domAttribute())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition domAttribute(String domAttributeName, @Nullable String expectedDomAttributeValue) {
    expect(entry.code).toMatch(/domAttribute\("[^"]+", "/);
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition domProperty(String domPropertyName, @Nullable String expectedDomPropertyValue) {
    expect(entry.code).toMatch(/domProperty\("[^"]+", "/);
    // The Javadoc samples name domAttributeValue() and domPropertyValue(), which do not exist.
    expect(entry.code).not.toMatch(/dom(Attribute|Property)Value\(/);
    // Condition.java Javadoc: @since 7.4.0
    expect(entry.desc).toMatch(/Added in Selenide 7\.4\.0\./);
  });

  test('"shouldHave(pseudo())" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldHave(pseudo())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition pseudo(String pseudoElementName, String propertyName, String expectedValue) {
    expect(entry.code).toMatch(/pseudo\("::?\w+", "[\w-]+", "/);
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition pseudo(String pseudoElementName, String expectedValue) {
    // content comes back quoted, so the Java string holds escaped quotes
    expect(entry.code).toMatch(/pseudo\("::?\w+", "(\\"|[^"])*"\)\)/);
  });

  test('"shouldBe(focused)" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldBe(focused)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    // selenide-core 7.19.0 Focused.java: driver.executeJavaScript("return document.activeElement")
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static final WebElementCondition focused = new Focused();
    expect(entry.code).toContain('shouldBe(focused)');
  });

  test('"shouldBe(interactable)" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldBe(interactable)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static final WebElementCondition interactable = new Interactable();
    expect(entry.code).toContain('shouldBe(interactable)');
    // selenide-core 7.19.0 Condition.java: public static final WebElementCondition clickable = and("clickable", interactable, enabled);
    expect(entry.code).toContain('shouldBe(clickable)');
    // Interactable.java: super("interactable", asList(new Visible(), new CssValue("opacity", "0")));
    expect(entry.tip).toContain('opacity');
  });

  test('"shouldBe(editable)" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldBe(editable)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static final WebElementCondition editable = new Editable();
    expect(entry.code).toContain('shouldBe(editable)');
    // selenide-core 7.19.0 Condition.java: public static final WebElementCondition readonly = new Readonly();
    expect(entry.code).toContain('shouldBe(readonly)');
  });

  test('"shouldNotBe(animated)" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldNotBe(animated)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    // Condition.java Javadoc: "Implemented for web browser context only."
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static final WebElementCondition animated = new Animated();
    expect(entry.code).toContain('shouldNotBe(animated)');
    // Condition.java Javadoc: @since v7.0.7
    expect(entry.desc).toMatch(/Added in Selenide 7\.0\.7\./);
  });

  test('"shouldBe(image)" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'shouldBe(image)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    // selenide-core 7.19.0 IsImageLoaded.java: private static final JavaScript js = new JavaScript("is-image.js");
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Condition.java: public static final WebElementCondition image = new IsImageLoaded();
    expect(entry.code).toMatch(/\$\("img[^"]*"\)\.shouldBe\(image\)/);
  });

  test('"be() and have()" exists at level intermediate, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'be() and have()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition be(WebElementCondition delegate) {
    // selenide-core 7.19.0 Condition.java: public static WebElementCondition have(WebElementCondition delegate) {
    expect(entry.code).toMatch(/\.should\(be\(\w+\), have\(\w+\(/);
  });

  test('"because()" exists at level intermediate, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'because()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 WebElementCondition.java: public WebElementCondition because(String message) {
    expect(entry.code).toMatch(/\)\.because\("[^"]+"\)\)/);
    // selenide-core 7.19.0 WebElementsCondition.java: public WebElementsCondition because(String explanation) {
    //   this.explanation = explanation; return this;
    expect(entry.tip).toContain('CollectionCondition.empty');
  });
});

test.describe('Javadoc gap fill: element getters (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"getText() and text()" exists at level beginner, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'getText() and text()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#getText()'
    );
    // selenide-core 7.19.0 SelenideElement.java: String getText(); and String text();
    expect(entry.code).toContain('.getText()');
    expect(entry.code).toContain('.text()');
    expect(entry.code).not.toContain('assertEquals(');
    // SelenideElement.java links "NOT RECOMMENDED" (do-not-use-getters-in-tests) on getText().
    expect(entry.tip).toContain('NOT RECOMMENDED');
    expect(entry.tip).toContain('shouldHave(text(');
  });

  test('"val() and getValue()" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'val() and getValue()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#val()'
    );
    // selenide-core 7.19.0 SelenideElement.java: String val(); String getValue();
    expect(entry.code).toContain('.val()');
    expect(entry.code).toContain('.getValue()');
    expect(entry.code).not.toContain('assertEquals(');
    // SelenideElement.java: @return attribute "value" value or null if attribute is missing;
    // val(String) is the same as setValue(String).
    expect(entry.tip).toContain('null');
    expect(entry.tip).toContain('setValue');
  });

  test('"getAttribute()" exists at level beginner, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Element Conditions', 'getAttribute()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#getAttribute(java.lang.String)'
    );
    // selenide-core 7.19.0 SelenideElement.java: @Nullable String getAttribute(String name);
    expect(entry.code).toContain('.getAttribute("');
    expect(entry.code).not.toContain('assertEquals(');
    expect(entry.tip).toContain('shouldHave(attribute(');
  });

  test('"innerHtml() and getOwnText()" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Element Conditions', 'innerHtml() and getOwnText()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#innerHtml()'
    );
    // selenide-core 7.19.0 SelenideElement.java: String innerHtml(); String getOwnText();
    expect(entry.code).toContain('.innerHtml()');
    expect(entry.code).toContain('.getOwnText()');
    // SelenideElement.java: innerHtml() "can be used to get the html of a hidden element".
    expect(entry.tip).toContain('hidden');
  });
});
