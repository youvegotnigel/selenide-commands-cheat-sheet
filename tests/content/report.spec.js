import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Reports & Debugging entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"screenshot(fileName)" exists at level beginner, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Reports & Debugging', 'screenshot(fileName)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    // selenide 7.19.0 Selenide.java: public static String screenshot(String fileName) {
    // It returns the URL of the PNG as a String, not a File.
    expect(entry.code).toMatch(/String \w+ = screenshot\("/);
    expect(entry.code).not.toMatch(/File \w+ = screenshot\("/);
  });

  test('"screenshot(OutputType)" exists at level intermediate, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Reports & Debugging', 'screenshot(OutputType)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide 7.19.0 Selenide.java: public static <T> T screenshot(OutputType<T> outputType) {
    expect(entry.code).toContain('byte[] png = screenshot(OutputType.BYTES)');
  });

  test('"screenshot() and screenshotAsImage()" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Reports & Debugging', 'screenshot() and screenshotAsImage()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideElement.java: File screenshot();
    expect(entry.code).toMatch(/File \w+ = \$\("[^"]+"\)\.screenshot\(\)/);
    // selenide-core 7.19.0 SelenideElement.java: BufferedImage screenshotAsImage();
    expect(entry.code).toMatch(/BufferedImage \w+ = \$\("[^"]+"\)\.screenshotAsImage\(\)/);
  });

  test('"Screenshot on failure" exists at level beginner, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Reports & Debugging', 'Screenshot on failure');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 Screenshot.java: String.format("Screenshot: %s%nPage source: %s", image, source)
    expect(entry.code).toContain('// Screenshot: file:');
    expect(entry.code).toContain('// Page source: file:');
    // selenide-core 7.19.0 ScreenShotLaboratory.java:
    //   return currentContext.get() + clock.timestamp() + "." + screenshotCounter.getAndIncrement();
    expect(entry.code).toMatch(/\d{13}\.\d+\.png/);
  });

  test('"SelenideLogger.addListener()" exists at level advanced, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Reports & Debugging', 'SelenideLogger.addListener()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 LogEventListener.java: void afterEvent(LogEvent currentLog);
    expect(entry.code).toContain('public void afterEvent(LogEvent ');
    // selenide-core 7.19.0 LogEventListener.java: void beforeEvent(LogEvent currentLog);
    expect(entry.code).toContain('public void beforeEvent(LogEvent ');
    // selenide-core 7.19.0 SelenideLogger.java:
    //   public static void addListener(String name, LogEventListener listener) {
    expect(entry.code).toMatch(/SelenideLogger\.addListener\("\w+", new /);
    // There is no one-argument addListener(listener).
    expect(entry.code).not.toMatch(/addListener\(new /);
    // selenide-core 7.19.0 SelenideLogger.java:
    //   public static <T extends LogEventListener> T removeListener(String name) {
    expect(entry.code).toMatch(/SelenideLogger\.removeListener\("\w+"\)/);
  });

  test('"highlight() and unhighlight()" exists at level beginner, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Reports & Debugging', 'highlight() and unhighlight()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideElement.java: SelenideElement highlight(HighlightOptions options);
    // selenide-core 7.19.0 HighlightOptions.java: public static HighlightOptions border(String borderStyle) {
    expect(entry.code).toContain('.highlight(HighlightOptions.border("');
    // selenide-core 7.19.0 SelenideElement.java: SelenideElement unhighlight();
    expect(entry.code).toContain('.unhighlight()');
  });

  test('"as() and describe()" exists at level intermediate, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Reports & Debugging', 'as() and describe()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-core 7.19.0 SelenideElement.java: SelenideElement as(String alias);
    expect(entry.code).toContain('.as("');
    // selenide-core 7.19.0 SelenideElement.java: String describe();
    expect(entry.code).toContain('.describe()');
  });

  test('"selenide-full-screenshot" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Reports & Debugging', 'selenide-full-screenshot');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-full-screenshot 7.19.0 META-INF/MANIFEST.MF:
    //   Implementation-Title: com.codeborne.selenide-full-screenshot, Implementation-Version: 7.19.0
    expect(entry.code).toContain(
      'testImplementation("com.codeborne:selenide-full-screenshot:7.19.0")'
    );
  });

  test('"selenide-video-recorder" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Reports & Debugging', 'selenide-video-recorder');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-video-recorder 7.19.0 EnableVideo.java:
    //   @ExtendWith(VideoRecorderExtension.class) ... public @interface EnableVideo {
    expect(entry.code).toContain('@EnableVideo');
    // selenide-video-recorder 7.19.0 SelenideVideoConfiguration.java:
    //   RecordingMode.valueOf(properties.getProperty("selenide.video.mode", "ANNOTATED"))
    // so with the default mode only methods annotated with
    // selenide-video-recorder 7.19.0 Video.java: @Target(ElementType.METHOD) public @interface Video {
    // are recorded.
    expect(entry.code).toContain('import org.selenide.videorecorder.core.Video;');
    expect(entry.code).toMatch(/@Video\s+@Test/);
  });

  test('"AllureSelenide (Allure report)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Reports & Debugging', 'AllureSelenide (Allure report)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // Not in an approved jar. selenide.org/documentation/reports.html:
    //   SelenideLogger.addListener("AllureSelenide", new AllureSelenide());
    // selenide-core 7.19.0 SelenideLogger.java:
    //   public static void addListener(String name, LogEventListener listener) {
    expect(entry.code).toContain(
      'SelenideLogger.addListener("AllureSelenide", new AllureSelenide()'
    );
    expect(entry.docs).toBe('https://selenide.org/documentation/reports.html');
  });
});

test.describe('Javadoc gap fill: WebDriver logs (Selenide 7.19.0)', () => {
  test('"getWebDriverLogs()" exists at level advanced, platform web', async ({ page }) => {
    await page.goto('/');
    const entry = await itemIn(page, 'Reports & Debugging', 'getWebDriverLogs()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    expect(entry.docs).toBe(
      'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#getWebDriverLogs(java.lang.String,java.util.logging.Level)'
    );
    // selenide-7.19.0 Selenide.java:1057 public static List<String> getWebDriverLogs(String logType, Level logLevel)
    expect(entry.code).toContain('getWebDriverLogs(LogType.BROWSER, Level.');
    expect(entry.code).toContain('import org.openqa.selenium.logging.LogType;');
    expect(entry.code).toContain('import java.util.logging.Level;');
    // Configuration.webdriverLogsEnabled writes the driver service log file: a different feature.
    expect(entry.code).not.toContain('webdriverLogsEnabled');
    expect(entry.tip).toContain('webdriverLogsEnabled');
  });
});
