import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

const CAT = 'Mobile Context & App';

test.describe('Mobile Context & App entries (selenide-appium 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"SelenideAppium.switchTo().context()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'SelenideAppium.switchTo().context()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static SelenideAppiumTargetLocator switchTo() {
    // selenide-appium 7.19.0 SelenideAppiumTargetLocator.java: public void context(String contextName) {
    expect(entry.code).toContain('SelenideAppium.switchTo().context("NATIVE_APP")');
    // selenide-core 7.19.0 SelenideTargetLocator has no context(String), and the Selenide form
    // replaces a raw cast of the driver to SupportsContextSwitching
    expect(entry.code).not.toContain('Selenide.switchTo().context(');
    expect(entry.code).not.toMatch(/\bdriver\.context\(|SupportsContextSwitching/);
  });

  test('"SelenideAppium.getContextHandles()" exists at level intermediate, platform mobile', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'SelenideAppium.getContextHandles()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static Set<String> getContextHandles() {
    expect(entry.code).toContain('Set<String> contexts = SelenideAppium.getContextHandles();');
    // selenide-appium 7.19.0 SelenideAppium.java: public static String getCurrentContext() {
    expect(entry.code).toContain('SelenideAppium.getCurrentContext()');
  });

  test('"SelenideAppium.openAndroidDeepLink()" takes the url first, then the package', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'SelenideAppium.openAndroidDeepLink()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static void openAndroidDeepLink(String deepLinkUrl, String appPackage) {
    expect(entry.code).toMatch(
      /SelenideAppium\.openAndroidDeepLink\("[a-z]+:\/\/[^"]*", "[\w.]+"\)/
    );
  });

  test('"SelenideAppium.openIOSDeepLink()" takes only the url', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'SelenideAppium.openIOSDeepLink()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static void openIOSDeepLink(String deepLinkUrl) {
    expect(entry.code).toMatch(/SelenideAppium\.openIOSDeepLink\("[a-z]+:\/\/[^"]*"\)/);
    expect(entry.code).not.toContain('openIosDeepLink');
    // selenide-appium 7.19.0 DeepLinkLauncher.java: public static Duration SAFARI_ELEMENTS_TIMEOUT = Duration.ofSeconds(1);
    expect(entry.tip).toContain('SAFARI_ELEMENTS_TIMEOUT');
  });

  test('"SelenideAppium.relaunchApp()" and the lifecycle entry use the 7.19.0 signatures', async ({
    page,
  }) => {
    const relaunch = await itemIn(page, CAT, 'SelenideAppium.relaunchApp()');
    expect(relaunch).not.toBeNull();
    expect(relaunch.level).toBe('intermediate');
    expect(relaunch.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static void relaunchApp(String appId, @Nullable Duration timeout) {
    expect(relaunch.code).toMatch(
      /SelenideAppium\.relaunchApp\("[\w.]+", Duration\.of\w+\(\d+\)\)/
    );
    // selenide-appium 7.19.0 AppiumNavigator.java: if (mobileDriver instanceof AndroidDriver androidDriver && timeout != null) {
    expect(relaunch.tip).toMatch(/Android/);

    const lifecycle = await itemIn(page, CAT, 'App lifecycle: terminateApp(), activateApp()');
    expect(lifecycle).not.toBeNull();
    expect(lifecycle.level).toBe('intermediate');
    expect(lifecycle.platform).toBe('mobile');
    // selenide-appium 7.19.0 SelenideAppium.java: public static void launchApp() {
    expect(lifecycle.code).toContain('SelenideAppium.launchApp();');
    // selenide-appium 7.19.0 SelenideAppium.java: public static void terminateApp(String appId) {
    expect(lifecycle.code).toMatch(/SelenideAppium\.terminateApp\("[\w.]+"\)/);
    // selenide-appium 7.19.0 SelenideAppium.java: public static void activateApp(String appId) {
    expect(lifecycle.code).toMatch(/SelenideAppium\.activateApp\("[\w.]+"\)/);
    // no such methods on SelenideAppium 7.19.0
    expect(lifecycle.code).not.toMatch(/closeApp|resetApp|runAppInBackground/);
  });

  test('"AppiumCondition.attribute()" builds a CombinedAttribute with android() then ios()', async ({
    page,
  }) => {
    const entry = await itemIn(page, CAT, 'AppiumCondition.attribute()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 conditions/CombinedAttribute.java: package com.codeborne.selenide.appium.conditions;
    expect(entry.code).toContain(
      'import com.codeborne.selenide.appium.conditions.CombinedAttribute;'
    );
    // selenide-appium 7.19.0 CombinedAttribute.java: public static CombinedAttribute android(String android) {
    // selenide-appium 7.19.0 CombinedAttribute.java: public CombinedAttribute ios(String ios) {   (instance, not static)
    expect(entry.code).toMatch(/CombinedAttribute\.android\("[\w-]+"\)\.ios\("\w+"\)/);
    expect(entry.code).not.toContain('CombinedAttribute.ios(');
    // selenide-appium 7.19.0 AppiumCondition.java: public static WebElementCondition attribute(CombinedAttribute attribute, String expectedAttributeValue) {
    expect(entry.code).toContain('AppiumCondition.attribute(');

    const collection = await itemIn(page, CAT, 'AppiumCollectionCondition.attributes()');
    expect(collection).not.toBeNull();
    expect(collection.platform).toBe('mobile');
    // selenide-appium 7.19.0 AppiumCollectionCondition.java: public static WebElementsCondition attributes(CombinedAttribute attribute, String... expectedAttributeValues) {
    expect(collection.code).toContain('AppiumCollectionCondition.attributes(');
  });

  test('"AppiumClipboard" is reached through clipboard()', async ({ page }) => {
    const entry = await itemIn(page, CAT, 'AppiumClipboard');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('mobile');
    // selenide-appium 7.19.0 META-INF/services/com.codeborne.selenide.ClipboardService:
    //   com.codeborne.selenide.appium.AppiumClipboardService
    // selenide 7.19.0 Selenide.java: public static Clipboard clipboard() {
    expect(entry.code).toContain('clipboard().setText(');
    expect(entry.code).not.toContain('new AppiumClipboard(');
  });
});
