import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Actions entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"click(ClickOptions)" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Actions', 'click(ClickOptions)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 ClickOptions.java: public static ClickOptions usingJavaScript()
    expect(entry.code).toContain('usingJavaScript()');
    // selenide-core 7.19.0 ClickOptions.java: public static ClickOptions withOffset(int offsetX, int offsetY)
    expect(entry.code).toContain('withOffset(');
    // selenide-core 7.19.0 ClickOptions.java: public ClickOptions force() is an instance method,
    // and holdingKeys(Keys holdingKeys, Keys... otherKeys) too: neither is a static factory.
    expect(entry.code).toContain('usingDefaultMethod().force()');
    expect(entry.code).toContain('.holdingKeys(');
    expect(entry.code).not.toContain('ClickOptions.force()');
  });

  test('"dragAndDrop(DragAndDropOptions)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Actions', 'dragAndDrop(DragAndDropOptions)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideElement.java: SelenideElement dragAndDrop(DragAndDropOptions options);
    // selenide-core 7.19.0 DragAndDropOptions.java: public static DragAndDropOptions to(String cssSelector)
    expect(entry.code).toContain('dragAndDrop(to(');
    // selenide-core 7.19.0 DragAndDropOptions.java: public DragAndDropOptions usingSeleniumActions()
    expect(entry.code).toContain('.usingSeleniumActions()');
    // SelenideElement.java 7.19.0 has no dragAndDropTo(...): the pre-7.0 form must not appear.
    expect(entry.code).not.toContain('dragAndDropTo(');
  });

  test('"type(TypeOptions)" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Actions', 'type(TypeOptions)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 TypeOptions.java: public static TypeOptions text(CharSequence textToType)
    expect(entry.code).toContain('TypeOptions.text(');
    // selenide-core 7.19.0 TypeOptions.java: public TypeOptions withDelay(Duration timeDelayWhileTyping)
    expect(entry.code).toContain('.withDelay(Duration.');
    // selenide-core 7.19.0 TypeOptions.java: public TypeOptions clearFirst(boolean shouldClearFieldBeforeTyping)
    expect(entry.code).toContain('.clearFirst(false)');
  });

  test('"setValue(SetValueOptions)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Actions', 'setValue(SetValueOptions)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SetValueOptions.java: public static SetValueOptions withDate(LocalDate date)
    expect(entry.code).toContain('withDate(LocalDate.of(');
    // selenide-core 7.19.0 SetValueOptions.java: public static SetValueOptions withText(CharSequence text)
    expect(entry.code).toContain('withText(');
    // selenide-core 7.19.0 SetValueOptions.java: public SetValueOptions sensitive()
    expect(entry.code).toContain('.sensitive()');
  });

  test('"scrollIntoView(ScrollIntoViewOptions)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Actions', 'scrollIntoView(ScrollIntoViewOptions)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 ScrollIntoViewOptions.java: public static ScrollIntoViewOptions instant()
    // and public ScrollIntoViewOptions block(Block block), enum Block { start, center, end, nearest }
    expect(entry.code).toContain('scrollIntoView(instant().block(');
  });

  test('"selenide-clear-with-shortcut" exists at level advanced, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Actions', 'selenide-clear-with-shortcut');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-clear-with-shortcut 7.19.0 META-INF/MANIFEST.MF:
    //   Implementation-Title: com.codeborne.selenide-clear-with-shortcut, Implementation-Version: 7.19.0
    expect(entry.code).toContain('com.codeborne:selenide-clear-with-shortcut:7.19.0');
    // META-INF/services/com.codeborne.selenide.commands.Clear registers
    // com.codeborne.selenide.clearwithshortcut.ClearWithShortcut, so the call stays a plain clear().
    expect(entry.code).toContain('.clear();');
  });
});

test.describe('Actions corrections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('click(ClickOptions) tip treats withTimeout() as the click retry timeout', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Actions', 'click(ClickOptions)');
    // selenide-core 7.19.0 ClickOptions.java: public class ClickOptions implements HasTimeout
    // impl/Arguments.java getTimeoutMs(): ofType(HasTimeout.class).map(HasTimeout::timeout)
    // impl/SelenideElementProxy.java: dispatchAndRetry(timeoutMs, ...) uses that timeout,
    // and commands/Click.java also applies it as a temporary pageLoadTimeout.
    expect(entry.tip).not.toContain('not an element wait');
    expect(entry.tip).toContain('pageLoadTimeout');
  });
});

test.describe('Javadoc gap fill: select and radio getters (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"getSelectedOptionText() and getSelectedOptionValue()" exists at level beginner, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(
      page,
      'Actions',
      'getSelectedOptionText() and getSelectedOptionValue()'
    );
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#getSelectedOptionText()'
    );
    // selenide-core 7.19.0 SelenideElement.java:1056 String getSelectedOptionText();
    // and :1038 String getSelectedOptionValue();
    expect(entry.code).toContain('getSelectedOptionText()');
    expect(entry.code).toContain('getSelectedOptionValue()');
    // Selenide.getSelectedText() is the selected page text, a different method.
    expect(entry.code).not.toContain('getSelectedText()');
  });

  test('"getOptions() and getSelectedOptions()" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Actions', 'getOptions() and getSelectedOptions()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#getOptions()'
    );
    // selenide-core 7.19.0 SelenideElement.java:1016 ElementsCollection getOptions();
    // and :1001 ElementsCollection getSelectedOptions();
    expect(entry.code).toContain('.getOptions().shouldHave(size(');
    expect(entry.code).toContain('.getSelectedOptions()');
  });

  test('"getSelectedRadio()" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Actions', 'getSelectedRadio()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#getSelectedRadio(org.openqa.selenium.By)'
    );
    // selenide-7.19.0 Selenide.java:701 public static SelenideElement getSelectedRadio(By radioField)
    expect(entry.code).toContain('getSelectedRadio(byName("');
    // It is a static Selenide method, not an element method.
    expect(entry.code).not.toContain(').getSelectedRadio(');
  });
});
