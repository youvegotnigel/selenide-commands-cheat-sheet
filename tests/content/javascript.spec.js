import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('JavaScript, Storage, Clipboard entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"executeJavaScript()" exists at level beginner, platform web', async ({ page }) => {
    await page.goto('/');
    const entry = await itemIn(page, 'JavaScript, Storage, Clipboard', 'executeJavaScript()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java:
    //   public static <T> T executeJavaScript(String jsCode, Object... arguments) {
    expect(entry.code).toContain('executeJavaScript("return');
    // The return type is the generic T, inferred from the assignment: no cast is needed.
    expect(entry.code).toMatch(/\b(String|Boolean|Number|Long) \w+ = executeJavaScript\(/);
    // The Selenium method name is executeScript; the Selenide static is executeJavaScript.
    expect(entry.code).not.toContain('executeScript(');
  });

  test('"clock().setFixedTime()" exists at level intermediate, platform web', async ({ page }) => {
    await page.goto('/');
    const entry = await itemIn(page, 'JavaScript, Storage, Clipboard', 'clock().setFixedTime()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java: public static BrowserClock clock() {
    // selenide-core 7.19.0 BrowserClock.java: public void setFixedTime(Instant instant) {
    expect(entry.code).toContain('clock().setFixedTime(Instant.');
    expect(entry.code).toContain('import java.time.Instant;');
    // No install()/fastForward() in BrowserClock 7.19.0 (that is the Playwright clock API).
    expect(entry.code).not.toMatch(/clock\(\)\.(install|fastForward|runFor|pauseAt)\(/);
    expect(entry.desc).toMatch(/Added in Selenide 7\.19\.0\.$/);
  });

  test('"clock().setTimezone()" exists at level intermediate, platform web', async ({ page }) => {
    await page.goto('/');
    const entry = await itemIn(page, 'JavaScript, Storage, Clipboard', 'clock().setTimezone()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 BrowserClock.java: public void setTimezone(String timezoneId) {
    expect(entry.code).toContain('clock().setTimezone("');
    // selenide-core 7.19.0 BrowserClock.java: public void reset() {
    expect(entry.code).toContain('clock().reset()');
    // The method takes a String id, not a java.time.ZoneId, and is spelled setTimezone.
    expect(entry.code).not.toContain('setTimeZone(');
    expect(entry.code).not.toContain('ZoneId.of(');
    expect(entry.desc).toMatch(/Added in Selenide 7\.19\.0\.$/);
  });

  test('"clipboard()" exists at level intermediate, platform web', async ({ page }) => {
    await page.goto('/');
    const entry = await itemIn(page, 'JavaScript, Storage, Clipboard', 'clipboard()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 Clipboard.java: String getText(); and void setText(String text);
    expect(entry.code).toContain('clipboard().setText("');
    expect(entry.code).toContain('clipboard().getText()');
    // selenide-core 7.19.0 ClipboardConditions.java:
    //   public static ObjectCondition<Clipboard> content(String expectedContent) {
    expect(entry.code).toContain(
      'import static com.codeborne.selenide.ClipboardConditions.content;'
    );
    expect(entry.code).toContain('clipboard().shouldHave(content("');
  });

  test('"paste()" exists at level beginner, platform web', async ({ page }) => {
    await page.goto('/');
    const entry = await itemIn(page, 'JavaScript, Storage, Clipboard', 'paste()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideElement.java: SelenideElement paste();
    expect(entry.code).toContain('.paste();');
    // paste() takes no arguments: the text comes from the clipboard.
    expect(entry.code).not.toMatch(/\.paste\(\s*[^)\s]/);
  });

  test('"cookies()" exists at level intermediate, platform web', async ({ page }) => {
    await page.goto('/');
    const entry = await itemIn(page, 'JavaScript, Storage, Clipboard', 'cookies()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java: public static CookieStore cookies() {
    // selenide-core 7.19.0 CookieStore.java: public void add(String name, String value) {
    expect(entry.code).toContain('cookies().add("');
    // selenide-core 7.19.0 CookieStoreConditions.java:
    //   public static ObjectCondition<CookieStore> cookie(String name, String value) {
    expect(entry.code).toContain(
      'import static com.codeborne.selenide.CookieStoreConditions.cookie;'
    );
    // selenide 7.19.0 Selenide.java: @Deprecated(since = "7.17.0") public static void clearBrowserCookies()
    expect(entry.code).not.toContain('clearBrowserCookies()');
    expect(entry.code).toContain('cookies().clear()');
  });
});

test.describe('Javadoc gap fill: device emulation (Selenide 7.19.0)', () => {
  test('"emulateDevice()" exists at level advanced, platform web', async ({ page }) => {
    await page.goto('/');
    const entry = await itemIn(page, 'JavaScript, Storage, Clipboard', 'emulateDevice()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#emulateDevice(com.codeborne.selenide.Device)'
    );
    // selenide-7.19.0 Selenide.java:149 emulateDevice(Device device); selenide-core 7.19.0 Device.java:6 public static final Device PIXEL_7; SelenideDriver.java throws UnsupportedOperationException outside Chromium and BiDi Firefox
    expect(entry.code).toContain('emulateDevice(Device.PIXEL_7)');
    expect(entry.code).toContain('import com.codeborne.selenide.Device;');
    expect(entry.tip).toContain('UnsupportedOperationException');
  });

  test('"resetEmulation()" exists at level advanced, platform web', async ({ page }) => {
    await page.goto('/');
    const entry = await itemIn(page, 'JavaScript, Storage, Clipboard', 'resetEmulation()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#resetEmulation()'
    );
    // selenide-7.19.0 Selenide.java:153 resetEmulation(); SelenideDriver.java resetEmulation() throws UnsupportedOperationException outside Chromium and BiDi Firefox
    expect(entry.code).toContain('resetEmulation()');
    expect(entry.tip).toContain('UnsupportedOperationException');
    expect(entry.tip).toContain('emulateDevice()');
  });

  test('the combined tiles are gone: emulateDevice() and resetEmulation()', async ({ page }) => {
    await page.goto('/');
    for (const name of ['emulateDevice() and resetEmulation()']) {
      expect(await itemIn(page, 'JavaScript, Storage, Clipboard', name)).toBeNull();
    }
  });
});
