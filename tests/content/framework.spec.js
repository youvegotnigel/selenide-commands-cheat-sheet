import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Test Frameworks entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"ScreenShooterExtension" exists at level beginner, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Test Frameworks', 'ScreenShooterExtension');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    // selenide 7.19.0 junit5/ScreenShooterExtension.java:
    //   public class ScreenShooterExtension implements BeforeEachCallback, AfterTestExecutionCallback {
    //   public ScreenShooterExtension(final boolean captureSuccessfulTests) {
    //   public ScreenShooterExtension to(final String folderWithScreenshots) {
    expect(entry.code).toContain('import com.codeborne.selenide.junit5.ScreenShooterExtension;');
    expect(entry.code).toContain('@ExtendWith(ScreenShooterExtension.class)');
    expect(entry.code).toContain('new ScreenShooterExtension(true).to("');
    // JUnit 4 rule form (selenide-junit4 junit/ScreenShooter.java) does not belong in a JUnit 5 test
    expect(entry.code).not.toContain('@Rule');
    expect(entry.code).not.toContain('ScreenShooter.failedTests()');
  });

  test('"SoftAssertsExtension" exists at level intermediate, platform both', async ({ page }) => {
    const entry = await itemIn(page, 'Test Frameworks', 'SoftAssertsExtension');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide 7.19.0 junit5/SoftAssertsExtension.java:
    //   public class SoftAssertsExtension implements BeforeAllCallback, BeforeEachCallback, AfterEachCallback, AfterAllCallback {
    // selenide 7.19.0 logevents/SoftAssertsErrorsCollector.java:
    //   return Configuration.assertionMode == SOFT;
    // selenide-core 7.19.0 AssertionMode.java: public enum AssertionMode { STRICT, SOFT }
    expect(entry.code).toContain('import com.codeborne.selenide.junit5.SoftAssertsExtension;');
    expect(entry.code).toContain('import static com.codeborne.selenide.AssertionMode.SOFT;');
    expect(entry.code).toContain('Configuration.assertionMode = SOFT;');
    // the JUnit 4 rule (selenide-junit4 junit/SoftAsserts.java) is not a JUnit 5 extension
    expect(entry.code).not.toContain('com.codeborne.selenide.junit.SoftAsserts');
    expect(entry.code).not.toContain('@Rule');
  });

  test('"BrowserPerTestStrategyExtension" exists at level beginner, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Test Frameworks', 'BrowserPerTestStrategyExtension');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('both');
    // selenide 7.19.0 junit5/BrowserPerTestStrategyExtension.java:
    //   public class BrowserPerTestStrategyExtension implements AfterEachCallback {
    // selenide 7.19.0 junit5/BrowserStrategyExtension.java:
    //   public class BrowserStrategyExtension implements AfterAllCallback {
    expect(entry.code).toContain('@ExtendWith(BrowserPerTestStrategyExtension.class)');
    expect(entry.code).toContain('@ExtendWith(BrowserStrategyExtension.class)');
  });

  test('"Extension autodetection (junit-platform.properties)" exists at level intermediate, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(
      page,
      'Test Frameworks',
      'Extension autodetection (junit-platform.properties)'
    );
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-examples/selenide-appium src/test/resources/junit-platform.properties:
    //   junit.jupiter.extensions.autodetection.enabled=true
    expect(entry.code).toMatch(/^# junit-platform\.properties/);
    expect(entry.code).toContain('junit.jupiter.extensions.autodetection.enabled=true');
    // selenide-examples/selenide-appium src/test/resources/META-INF/services/org.junit.jupiter.api.extension.Extension
    expect(entry.code).toContain('META-INF/services/org.junit.jupiter.api.extension.Extension');
    // selenide-core 7.19.0 junit5/TextReportExtension.java: package com.codeborne.selenide.junit5;
    expect(entry.code).toContain('com.codeborne.selenide.junit5.TextReportExtension');
    expect(entry.code).toContain('com.codeborne.selenide.junit5.ScreenShooterExtension');
  });

  test('"JUnit 4 rules (selenide-junit4)" exists at level intermediate, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Test Frameworks', 'JUnit 4 rules (selenide-junit4)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-junit4 7.19.0 junit/ScreenShooter.java: package com.codeborne.selenide.junit;
    //   private ScreenShooter() {
    //   public static ScreenShooter failedTests() {
    expect(entry.code).toContain('import com.codeborne.selenide.junit.ScreenShooter;');
    expect(entry.code).toContain('ScreenShooter.failedTests()');
    expect(entry.code).not.toContain('new ScreenShooter()');
    // the package is "junit", not "junit4", even though the artifact is selenide-junit4
    expect(entry.code).not.toContain('com.codeborne.selenide.junit4');
    // selenide-junit4 7.19.0 junit/BrowserStrategy.java: public class BrowserStrategy extends ExternalResource {
    expect(entry.code).toContain('new BrowserStrategy()');
  });

  test('"TestNG listeners (selenide-testng)" exists at level intermediate, platform both', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Test Frameworks', 'TestNG listeners (selenide-testng)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('both');
    // selenide-testng 7.19.0 testng/ScreenShooter.java: package com.codeborne.selenide.testng;
    //   public class ScreenShooter extends ExitCodeListener {
    //   public static boolean captureSuccessfulTests;
    expect(entry.code).toContain('import com.codeborne.selenide.testng.ScreenShooter;');
    expect(entry.code).toContain('ScreenShooter.captureSuccessfulTests = ');
    // selenide-testng 7.19.0 testng/SoftAsserts.java: public class SoftAsserts extends ExitCodeListener {
    // selenide-testng 7.19.0 testng/BrowserPerClass.java: public class BrowserPerClass extends ExitCodeListener {
    expect(entry.code).toContain('@Listeners({');
    expect(entry.code).toContain('SoftAsserts.class');
    expect(entry.code).toContain('BrowserPerClass.class');
    // JUnit 5 extensions are not TestNG listeners
    expect(entry.code).not.toContain('Extension.class');
  });
});
