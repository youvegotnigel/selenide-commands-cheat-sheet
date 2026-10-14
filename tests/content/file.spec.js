import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Files entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"uploadFromClasspath()" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Files', 'uploadFromClasspath()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideElement.java: File uploadFromClasspath(String... fileName);
    expect(entry.code).toContain('uploadFromClasspath("');
    // selenide-core 7.19.0 UploadFileFromClasspath.java:
    //   URL resource = currentThread().getContextClassLoader().getResource(name);
    // ClassLoader.getResource takes a path relative to the classpath root: a leading "/" or a
    // source folder such as "src/test/resources/" is not found.
    expect(entry.code).not.toMatch(/uploadFromClasspath\("(\/|src\/)/);
  });

  test('"FileDownloadMode" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Files', 'FileDownloadMode');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 FileDownloadMode.java: public enum FileDownloadMode { HTTPGET, PROXY, FOLDER, CDP }
    for (const mode of ['HTTPGET', 'PROXY', 'FOLDER', 'CDP']) {
      expect(entry.code).toContain(mode);
    }
  });

  test('"download() (CDP)" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Files', 'download() (CDP)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 DownloadOptions.java: public static DownloadOptions using(FileDownloadMode method) {
    expect(entry.code).toContain('DownloadOptions.using(CDP)');
  });

  test('"download() (PROXY)" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Files', 'download() (PROXY)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 DownloadFileWithProxyServer.java:
    //   throw new IllegalStateException("Cannot download file: proxy server is not enabled. Setup proxyEnabled");
    expect(entry.code).toContain('Configuration.proxyEnabled = true');
    // selenide 7.19.0 Configuration.java: public static FileDownloadMode fileDownload = defaults.fileDownload();
    expect(entry.code).toContain('Configuration.fileDownload = PROXY');
  });

  test('"FileFilters" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Files', 'FileFilters');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 FileFilters.java: public static FileFilter withName(String fileName) {
    expect(entry.code).toContain('withName("');
    // selenide-core 7.19.0 FileFilters.java: public static FileFilter withNameMatching(String fileNameRegex) {
    expect(entry.code).toContain('withNameMatching("');
    // selenide-core 7.19.0 FileFilters.java: public static FileFilter withExtension(String extension) {
    expect(entry.code).toContain('withExtension("');
    // selenide-core 7.19.0 ExtensionFilter.java:
    //   throw new IllegalArgumentException(String.format("File extension cannot contain dot: '%s'", extension));
    expect(entry.code).not.toContain('withExtension(".');
  });

  test('"download(DownloadOptions)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Files', 'download(DownloadOptions)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 DownloadOptions.java: public DownloadOptions withTimeout(Duration timeout) {
    expect(entry.code).toContain('.withTimeout(Duration.ofSeconds(');
    // selenide-core 7.19.0 DownloadOptions.java: public DownloadOptions withIncrementTimeout(Duration incrementTimeout) {
    expect(entry.code).toContain('.withIncrementTimeout(Duration.ofSeconds(');
    // selenide-core 7.19.0 SelenideElement.java: @Deprecated File download(long timeout) throws FileNotDownloadedError;
    expect(entry.code).not.toMatch(/\.download\(\d/);
  });
});
