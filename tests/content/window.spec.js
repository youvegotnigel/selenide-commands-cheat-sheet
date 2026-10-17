import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

const CAT = 'Windows, Frames, Alerts';

test.describe('Windows, Frames, Alerts entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"switchTo().window(index)" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'switchTo().window(index)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideTargetLocator.java: public WebDriver window(int index) {
    // Javadoc on the same method: "@param index index of window (0-based)"
    expect(entry.code).toContain('switchTo().window(1)');
    expect(entry.tip).toMatch(/0-based/);
    // selenide-core 7.19.0 SelenideTargetLocator.java: public WebDriver window(int index, Duration timeout) {
    expect(entry.code).toMatch(/switchTo\(\)\.window\(\d+, Duration\.of\w+\(\d+\)\)/);
  });

  test('"webdriver().shouldHave(numberOfWindows())" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'webdriver().shouldHave(numberOfWindows())');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 WebDriverConditions.java: public static ObjectCondition<WebDriver> numberOfWindows(int numberOfWindows) {
    expect(entry.code).toContain(
      'import static com.codeborne.selenide.WebDriverConditions.numberOfWindows;'
    );
    // selenide 7.19.0 Selenide.java: public static BrowserSession webdriver() {
    // selenide-core 7.19.0 Conditional.java: default Conditional<T> shouldHave(ObjectCondition<T> predicate) {
    expect(entry.code).toContain('webdriver().shouldHave(numberOfWindows(2))');
  });

  test('"switchTo().innerFrame()" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'switchTo().innerFrame()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideTargetLocator.java: public void innerFrame(String firstFrame, String... otherFrames) {
    expect(entry.code).toMatch(/switchTo\(\)\.innerFrame\("[^"]+", "[^"]+"\)/);
    // firstFrame is required, so the zero-argument call of older versions does not compile.
    expect(entry.code).not.toContain('innerFrame()');
  });

  test('"confirm()" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'confirm()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java: public static String confirm(@Nullable String expectedDialogText) {
    expect(entry.code).toMatch(/confirm\("[^"]+"\);/);
    // selenide 7.19.0 Selenide.java: public static String confirm() {  ("@return actual dialog text")
    expect(entry.code).toMatch(/String \w+ = confirm\(\);/);
  });

  test('"prompt()" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'prompt()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java: public static String prompt(@Nullable String inputText) {
    // The one-argument form is the text typed into the prompt, not the expected dialog text.
    expect(entry.tip).toMatch(/input/i);
    // selenide 7.19.0 Selenide.java: public static String prompt(@Nullable String expectedDialogText, @Nullable String inputText) {
    expect(entry.code).toMatch(/prompt\("[^"]+", "[^"]+"\);/);
  });

  test('"ModalOptions" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'ModalOptions');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 ModalOptions.java: public static ModalOptions withExpectedText(@Nullable String expectedText) {
    // selenide-core 7.19.0 ModalOptions.java: public ModalOptions timeout(Duration timeout) {
    expect(entry.code).toMatch(/withExpectedText\("[^"]+"\)\.timeout\(Duration\.of\w+\(\d+\)\)/);
    // selenide 7.19.0 Selenide.java: public static String confirm(ModalOptions options) {
    expect(entry.code).toContain(
      'import static com.codeborne.selenide.ModalOptions.withExpectedText;'
    );
    // Selenide.java has confirm(), confirm(String), confirm(ModalOptions) only: no (String, Duration) overload.
    expect(entry.code).not.toMatch(/(confirm|dismiss)\("[^"]*", Duration/);
  });
});

test.describe('Javadoc gap fill: alert and new window (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"switchTo().alert()" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Windows, Frames, Alerts', 'switchTo().alert()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideTargetLocator.html#alert(java.time.Duration)'
    );
    // selenide-core 7.19.0 SelenideTargetLocator.java:171 public Alert alert(),
    // :176 public Alert alert(@Nullable Duration timeout)
    expect(entry.code).toContain('switchTo().alert(Duration.ofSeconds(');
    expect(entry.code).toContain('import java.time.Duration;');
  });

  test('"switchTo().newWindow()" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Windows, Frames, Alerts', 'switchTo().newWindow()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideTargetLocator.html#newWindow(org.openqa.selenium.WindowType)'
    );
    // selenide-core 7.19.0 SelenideTargetLocator.java:281 public WebDriver newWindow(WindowType typeHint)
    expect(entry.code).toContain('switchTo().newWindow(WindowType.TAB)');
    expect(entry.code).toContain('import org.openqa.selenium.WindowType;');
  });
  test('"switchTo().parentFrame()" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Windows, Frames, Alerts', 'switchTo().parentFrame()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideTargetLocator.html#parentFrame()'
    );
    // selenide-core 7.19.0 SelenideTargetLocator.java parentFrame()
    expect(entry.code).toContain('switchTo().parentFrame()');
    expect(entry.tip).toContain('ElementNotFound');
  });

  test('"switchTo().defaultContent()" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Windows, Frames, Alerts', 'switchTo().defaultContent()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideTargetLocator.html#defaultContent()'
    );
    // selenide-core 7.19.0 SelenideTargetLocator.java defaultContent()
    expect(entry.code).toContain('switchTo().defaultContent()');
    expect(entry.tip).toContain('ElementNotFound');
  });

  test('the combined tiles are gone: parentFrame() and defaultContent()', async ({ page }) => {
    for (const name of ['parentFrame() and defaultContent()']) {
      expect(await itemIn(page, 'Windows, Frames, Alerts', name)).toBeNull();
    }
  });
});
