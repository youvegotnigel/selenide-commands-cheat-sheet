/** @type {import('./index.js').Category} */
export default {
  cat: 'Mobile Context & App',
  cls: 'mobile-context',
  color: '#ffc2e9',
  items: [
    {
      name: 'SelenideAppium.getContextHandles()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Returns the names of the contexts the app has right now, typically NATIVE_APP plus a WEBVIEW_ name for each WebView. SelenideAppium.getCurrentContext() returns the one in use.',
      tip: 'Both ask the driver once and never wait, unlike Selenide checks, so a WebView that is still loading is simply missing from the set. getCurrentContext() is @Nullable. Pick the WebView by its WEBVIEW prefix instead of hard-coding the full name when it differs between builds.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppium.html#getContextHandles()',
      code: `import com.codeborne.selenide.appium.SelenideAppium;
import java.util.Set;

Set<String> contexts = SelenideAppium.getContextHandles();
// e.g. [NATIVE_APP, WEBVIEW_com.example.shop]
String webView = contexts.stream()
    .filter(name -> name.startsWith("WEBVIEW"))
    .findFirst()
    .orElseThrow();
SelenideAppium.switchTo().context(webView);
String current = SelenideAppium.getCurrentContext(); // the WebView name`,
    },
    {
      name: 'SelenideAppium.switchTo().context()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Switches the session between the native app and a WebView by context name, such as "NATIVE_APP" or "WEBVIEW_com.example.shop". Inside a WebView, $() finds elements of the web page with CSS or XPath, like in a browser.',
      tip: 'Call SelenideAppium.switchTo(): the switchTo() from Selenide.* returns SelenideTargetLocator, which has no context(). The switch does not wait for the WebView to exist, so wait until getContextHandles() contains it first. Switch back to "NATIVE_APP" before using native locators again. Each switch is logged as a "set context" step.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumTargetLocator.html#context(java.lang.String)',
      code: `import com.codeborne.selenide.appium.SelenideAppium;
import io.appium.java_client.AppiumBy;

$(AppiumBy.accessibilityId("Open help")).click();
Wait().until(d -> SelenideAppium.getContextHandles().contains("WEBVIEW_com.example.shop"));

SelenideAppium.switchTo().context("WEBVIEW_com.example.shop");
$("h1").shouldHave(text("Help center")); // CSS works inside the WebView
SelenideAppium.switchTo().context("NATIVE_APP");`,
    },
    {
      name: 'SelenideAppium.openAndroidDeepLink()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Opens a deep link in an Android app with the Appium "mobile: deepLink" command, starting the session first if none is running. It takes a test straight to a screen without tapping through the app.',
      tip: 'The arguments are the URL first, then the package (applicationId) of the app that should handle it. A missing session is started through launchApp(), so Configuration.browser must already name your WebDriverProvider. Nothing waits for the new screen: follow with a shouldBe() on an element from it.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppium.html#openAndroidDeepLink(java.lang.String,java.lang.String)',
      code: `import com.codeborne.selenide.appium.SelenideAppium;
import static com.codeborne.selenide.appium.AppiumSelectors.withText;

SelenideAppium.openAndroidDeepLink("mydemoapprn://product-details/1", "com.saucelabs.mydemoapp.rn");
$(withText("Sauce Labs Backpack")).shouldBe(visible);`,
    },
    {
      name: 'SelenideAppium.openIOSDeepLink()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Opens a deep link on iOS by launching Safari, navigating to the URL and confirming the "Open in app" prompt, starting the session first if none is running. It takes only the URL.',
      tip: 'If the session has the autoAcceptAlerts capability, Appium accepts the prompt. Otherwise Selenide taps a button whose name contains "Open" (or the Russian "Открыть") and waits for it only DeepLinkLauncher.SAFARI_ELEMENTS_TIMEOUT, 1 second by default, a public static field you can raise for slow simulators. On a device in another language, use autoAcceptAlerts. The app may take a while to open, so give the first check a longer timeout.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppium.html#openIOSDeepLink(java.lang.String)',
      code: `import com.codeborne.selenide.appium.DeepLinkLauncher;
import com.codeborne.selenide.appium.SelenideAppium;
import java.time.Duration;
import static com.codeborne.selenide.appium.AppiumSelectors.byAttribute;

DeepLinkLauncher.SAFARI_ELEMENTS_TIMEOUT = Duration.ofSeconds(3); // slow simulator
SelenideAppium.openIOSDeepLink("mydemoapprn://product-details/1");
$(byAttribute("label", "Sauce Labs Backpack")).shouldBe(visible, Duration.ofSeconds(20));`,
    },
    {
      name: 'App lifecycle: terminateApp(), activateApp()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'launchApp() starts the Appium session once per thread. Inside that session, terminateApp(appId) stops the app and activateApp(appId) brings it to the foreground, starting it if it is installed but not running.',
      tip: 'appId is the applicationId on Android and the bundleId on iOS. Unlike the deep link methods, terminateApp() and activateApp() never start a session: without one they throw IllegalStateException ("No webdriver is bound to current thread"). Terminating the app does not end the session; closeWebDriver() does. launchApp() also sets Configuration.browserSize to null and pageLoadTimeout to -1.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppium.html#terminateApp(java.lang.String)',
      code: `import com.codeborne.selenide.appium.SelenideAppium;
import io.appium.java_client.AppiumBy;

SelenideAppium.launchApp(); // does nothing if the session already exists
$(AppiumBy.accessibilityId("Add to cart")).click();

SelenideAppium.terminateApp("com.example.shop"); // bundleId on iOS
SelenideAppium.activateApp("com.example.shop");
$(AppiumBy.accessibilityId("Cart badge")).shouldHave(text("1"));`,
    },
    {
      name: 'SelenideAppium.relaunchApp()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Restarts the app inside the current session: terminateApp(appId, timeout) followed by activateApp(appId). Useful to check what survives a cold start.',
      tip: 'It is a restart, not a reset: app data, logins and caches survive, and the Appium session stays the same. The optional Duration is passed to the driver only on Android, as the timeout for the app to stop; on iOS it is ignored.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppium.html#relaunchApp(java.lang.String,java.time.Duration)',
      code: `import com.codeborne.selenide.appium.SelenideAppium;
import io.appium.java_client.AppiumBy;
import java.time.Duration;

$(AppiumBy.accessibilityId("Remember me")).click();
SelenideAppium.relaunchApp("com.example.shop");
$(AppiumBy.accessibilityId("Welcome back")).shouldBe(visible);

// Android only: wait up to 5 seconds for the app to stop
SelenideAppium.relaunchApp("com.example.shop", Duration.ofSeconds(5));`,
    },
    {
      name: 'SelenideAppium.back()',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Navigates the app back to the previous screen. It is the same call as Selenide.back(): one navigate().back(), logged as a "back" step.',
      tip: "It does not wait for anything, so assert on the previous screen right after it. Android has a system Back key for this; iOS has none, so there the result depends on the Appium driver, and tapping the screen's own back button is more predictable.",
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppium.html#back()',
      code: `import com.codeborne.selenide.appium.SelenideAppium;
import io.appium.java_client.AppiumBy;

$(AppiumBy.accessibilityId("Settings")).click();
$(AppiumBy.accessibilityId("Settings title")).shouldBe(visible);
SelenideAppium.back();
$(AppiumBy.accessibilityId("Home title")).shouldBe(visible);`,
    },
    {
      name: 'AppiumCondition.attribute()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Checks an attribute whose name differs between platforms in one assertion. A CombinedAttribute names the Android attribute and the iOS one, and Selenide reads whichever matches the running driver.',
      tip: 'The value must be exactly equal. android() is the static factory and ios() chains on it; leave a platform out and the check fails there with a NullPointerException ("iOS selector not given"). Write AppiumCondition.attribute() qualified: a static import of it hides Condition.attribute() from Condition.*.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumCondition.html#attribute(com.codeborne.selenide.appium.conditions.CombinedAttribute,java.lang.String)',
      code: `import com.codeborne.selenide.appium.AppiumCondition;
import com.codeborne.selenide.appium.conditions.CombinedAttribute;
import io.appium.java_client.AppiumBy;

CombinedAttribute label = CombinedAttribute.android("content-desc").ios("name");
$(AppiumBy.accessibilityId("Accessibility"))
    .shouldHave(AppiumCondition.attribute(label, "Accessibility"));`,
    },
    {
      name: 'AppiumCollectionCondition.attributes()',
      level: 'advanced',
      platform: 'mobile',
      desc: 'Checks one cross-platform attribute on every element of a collection against an exact list of values, in order. Takes the values as varargs or as a List.',
      tip: 'The sizes must match too: it extends ExactTexts and fails with "List size mismatch (expected: 4, actual: 6)" or "Attribute #4 mismatch", where the index is 0-based. CollectionCondition.attributes(String, ...) has the same simple name, so keep this one qualified.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumCollectionCondition.html#attributes(com.codeborne.selenide.appium.conditions.CombinedAttribute,java.lang.String...)',
      code: `import com.codeborne.selenide.appium.AppiumCollectionCondition;
import com.codeborne.selenide.appium.conditions.CombinedAttribute;
import io.appium.java_client.AppiumBy;
import java.util.List;

CombinedAttribute title = CombinedAttribute.android("text").ios("label");
$$(AppiumBy.accessibilityId("Menu item"))
    .shouldHave(AppiumCollectionCondition.attributes(title, "Catalog", "Cart", "Profile"));

List<String> expected = List.of("Catalog", "Cart", "Profile");
$$(AppiumBy.accessibilityId("Menu item"))
    .shouldHave(AppiumCollectionCondition.attributes(title, expected));`,
    },
    {
      name: 'AppiumClipboard',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'With selenide-appium on the classpath, clipboard() returns an AppiumClipboard, which reads and writes the plain text clipboard of the device under test.',
      tip: 'It is registered as a ClipboardService through ServiceLoader, so there is nothing to configure and no need to construct it. In a browser session it falls back to the default clipboard. If the Appium driver lacks the "mobile: setClipboard" extension, it retries through the legacy clipboard endpoint, which works only when the driver unwraps to an AppiumDriver.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumClipboard.html',
      code: `import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.ClipboardConditions.content;

clipboard().setText("PROMO2026");
$(AppiumBy.accessibilityId("Paste promo code")).click();

$(AppiumBy.accessibilityId("Copy order id")).click();
clipboard().shouldHave(content("ORD-1001"));
String orderId = clipboard().getText();`,
    },
    {
      name: 'AppiumDriverRunner.isAndroidDriver()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Tells whether the current session runs on Android, and isIosDriver() whether it runs on iOS, for the rare steps that must differ per platform.',
      tip: 'Both read the platformName capability. Despite the Javadoc saying "false if session is not created", they throw IllegalStateException without a session, because they call WebDriverRunner.getWebDriver(). getAndroidDriver(), getIosDriver() and getMobileDriver() in the same class are deprecated for removal in 7.19.0. Prefer CombinedBy and CombinedAttribute over branching.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumDriverRunner.html#isAndroidDriver()',
      code: `import com.codeborne.selenide.appium.AppiumDriverRunner;
import com.codeborne.selenide.appium.SelenideAppium;
import io.appium.java_client.AppiumBy;

if (AppiumDriverRunner.isAndroidDriver()) {
  SelenideAppium.back();
} else if (AppiumDriverRunner.isIosDriver()) {
  $(AppiumBy.accessibilityId("Back")).click();
}`,
    },
  ],
};
