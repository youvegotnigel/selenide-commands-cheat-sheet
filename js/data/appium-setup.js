/** @type {import('./index.js').Category} */
export default {
  cat: 'Appium Setup',
  cls: 'appium-setup',
  color: '#9e92f3',
  items: [
    {
      name: 'selenide-appium dependency (Maven)',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Adds the Selenide adaptor for Appium to a Maven project. One dependency is enough: it brings selenide and the Appium java-client with it.',
      tip: 'selenide-appium is released together with selenide, so its version is always the Selenide version (7.19.0 depends on selenide 7.19.0 and io.appium:java-client 11.0.0). Do not declare java-client yourself at another version: a mismatched client breaks the driver classes Selenide calls. If you also list com.codeborne:selenide, keep both on the same version.',
      docs: 'https://github.com/selenide/selenide/blob/main/modules/appium/README.md#how-to-add-dependency-to-your-project',
      code: `<dependency>
  <groupId>com.codeborne</groupId>
  <artifactId>selenide-appium</artifactId>
  <version>7.19.0</version>
  <scope>test</scope>
</dependency>`,
    },
    {
      name: 'selenide-appium dependency (Gradle)',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Adds selenide-appium to a Gradle project (Kotlin DSL), and forwards -Dselenide.* and -Dcapabilities.* flags to the test JVM so the device can be switched from the command line.',
      tip: 'Gradle runs tests in a forked JVM that does not see properties passed to the build, so without the forwarding block -Dselenide.browser=... is silently ignored. The selenide-appium module build.gradle forwards selenide.* the same way; capabilities.* is added here because Selenide copies those keys into the capabilities your WebDriverProvider receives.',
      docs: 'https://github.com/selenide/selenide/blob/main/modules/appium/README.md#how-to-add-dependency-to-your-project',
      code: `// build.gradle.kts
dependencies {
  testImplementation("com.codeborne:selenide-appium:7.19.0")
}

tasks.withType<Test>().configureEach {
  useJUnitPlatform()
  System.getProperties().stringPropertyNames()
    .filter { it.startsWith("selenide.") || it.startsWith("capabilities.") }
    .forEach { systemProperty(it, System.getProperty(it)) }
}`,
    },
    {
      name: 'WebDriverProvider (Android)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'The one place that knows how to start an Android session: implement createDriver() and return an AndroidDriver built from UiAutomator2Options. Selenide calls it when the first command needs a driver.',
      tip: 'Build the options from the capabilities argument (new UiAutomator2Options(capabilities)) so -Dcapabilities.* flags and Configuration.browserCapabilities reach the session. In java-client 11, options.merge(capabilities) returns a new object, so calling it as a bare statement, as many samples do, drops them. Do not cache the driver in a field: Selenide binds it to the test thread. Leave Configuration.remote empty: when it is set, Selenide builds a RemoteWebDriver and never calls the provider.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverProvider.html#createDriver(org.openqa.selenium.Capabilities)',
      code: `import com.codeborne.selenide.WebDriverProvider;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.options.UiAutomator2Options;
import java.net.MalformedURLException;
import java.net.URI;
import java.time.Duration;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.WebDriver;

public class AndroidDriverProvider implements WebDriverProvider {
  @Override
  public WebDriver createDriver(Capabilities capabilities) {
    UiAutomator2Options options = new UiAutomator2Options(capabilities)
      .setDeviceName("Android Emulator")
      .setApp("build/apps/ApiDemos-debug.apk")
      .setAppPackage("io.appium.android.apis")
      .setAppActivity(".ApiDemos")
      .setNewCommandTimeout(Duration.ofSeconds(60));
    try {
      return new AndroidDriver(URI.create("http://127.0.0.1:4723").toURL(), options);
    } catch (MalformedURLException e) {
      throw new IllegalArgumentException(e);
    }
  }
}`,
    },
    {
      name: 'WebDriverProvider (iOS)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'The iOS counterpart: return an IOSDriver built from XCUITestOptions. The test code stays the same; only the provider class changes.',
      tip: 'Use setBundleId() for an app that is already installed and setApp() for a .app or .ipa path; Android uses setAppPackage()/setAppActivity() instead. The first session on a fresh simulator can be very slow, which is why the selenide-appium tests raise setWdaLaunchTimeout() to 10 minutes; that wait happens inside createDriver(), before any Selenide timeout applies.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverProvider.html',
      code: `import com.codeborne.selenide.WebDriverProvider;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.ios.options.XCUITestOptions;
import java.net.MalformedURLException;
import java.net.URI;
import java.time.Duration;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.WebDriver;

public class IosDriverProvider implements WebDriverProvider {
  @Override
  public WebDriver createDriver(Capabilities capabilities) {
    XCUITestOptions options = new XCUITestOptions(capabilities)
      .setDeviceName("iPhone 15")
      .setPlatformVersion("17.5")
      .setBundleId("com.example.shop")
      .setWdaLaunchTimeout(Duration.ofMinutes(5));
    try {
      return new IOSDriver(URI.create("http://127.0.0.1:4723").toURL(), options);
    } catch (MalformedURLException e) {
      throw new IllegalArgumentException(e);
    }
  }
}`,
    },
    {
      name: 'SelenideAppium.launchApp()',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Starts the app under test: point Configuration.browser at your WebDriverProvider class, then call launchApp(). Selenide creates the driver through the provider and binds it to the current thread.',
      tip: 'It does nothing if a driver is already running in this thread, so it is safe in @BeforeEach. Before starting it sets Configuration.browserSize = null and Configuration.pageLoadTimeout = -1, so Selenide does not try to resize a phone screen or set a page load timeout on a native app. Plain open() also starts the provider, as the examples repo does, but skips those two resets.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppium.html#launchApp()',
      code: `import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.appium.SelenideAppium;
import io.appium.java_client.AppiumBy;

Configuration.browser = AndroidDriverProvider.class.getName();
SelenideAppium.launchApp();

$(AppiumBy.accessibilityId("Views")).shouldBe(visible);`,
    },
    {
      name: 'Provider in selenide.properties',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Names the default WebDriverProvider in selenide.properties instead of in code, so tests only call launchApp() and never mention a platform.',
      tip: 'The value is the fully qualified class name, exactly what Class.getName() returns (a nested class needs $, as in Providers$Android). -D system properties override the file, and an assignment to Configuration.browser in code overrides both, so remove it from setup methods once the file owns the choice.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#browser',
      code: `# selenide.properties
# src/test/resources
selenide.browser=com.example.mobile.AndroidDriverProvider
selenide.timeout=10000`,
    },
    {
      name: 'Switching platform with -Dselenide.browser',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Runs the same suite on Android or iOS by passing the provider class on the command line. Extra -Dcapabilities.* flags reach the provider as capabilities.',
      tip: 'Selenide copies every capabilities.* system property into the Capabilities passed to createDriver(), with "true"/"false" and numbers converted, so one provider can serve several devices if it builds its options from that argument. Gradle needs the forwarding block from the Gradle dependency entry; Maven passes -D flags through.',
      docs: 'https://github.com/selenide/selenide/blob/main/modules/appium/README.md#initiating-android--ios-driver-session',
      code: `mvn test -Dselenide.browser=com.example.mobile.AndroidDriverProvider

mvn test -Dselenide.browser=com.example.mobile.IosDriverProvider

# override one capability for this run (read by new UiAutomator2Options(capabilities))
mvn test -Dselenide.browser=com.example.mobile.AndroidDriverProvider -Dcapabilities.appium:udid=emulator-5556`,
    },
    {
      name: 'MobileTestExtension (JUnit 5)',
      level: 'advanced',
      platform: 'mobile',
      desc: 'A JUnit 5 extension that owns the session lifecycle, modelled on the selenide-examples/selenide-appium project: every test starts from a fresh app session with mobile-safe settings.',
      tip: 'The example registers it for all classes through ServiceLoader autodetection, and its beforeAll also starts a local Appium server with the java-client service builder, which is outside Selenide. closeWebDriver() first makes the next launchApp() create a new session instead of reusing the old one, at the cost of a slower test. To keep the app between tests, drop that call and reset the app with relaunchApp(appId) instead.',
      docs: 'https://github.com/selenide-examples/selenide-appium/blob/main/src/test/java/org/selenide/examples/appium/MobileTestExtension.java',
      code: `import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.appium.SelenideAppium;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;

public class MobileTestExtension implements BeforeEachCallback, AfterEachCallback {
  @Override
  public void beforeEach(ExtensionContext context) {
    closeWebDriver();
    Configuration.browserSize = null;
    Configuration.pageLoadTimeout = -1;
    SelenideAppium.launchApp();
  }

  @Override
  public void afterEach(ExtensionContext context) {
    closeWebDriver();
  }
}

// usage (import org.junit.jupiter.api.extension.ExtendWith)
@ExtendWith(MobileTestExtension.class)
class LoginTest { /* ... */ }`,
    },
    {
      name: 'Mobile timeouts',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Which waits matter on a device: Configuration.timeout for every should* check, raised for slow emulators, while the page load timeout is switched off for native apps.',
      tip: 'The selenide-appium tests use Configuration.timeout = 10_000 instead of the 4000 ms default. Configuration.remoteReadTimeout and remoteConnectionTimeout only apply to a RemoteWebDriver that Selenide builds itself, never to a driver returned by your WebDriverProvider. The Appium-side idle limit, newCommandTimeout, belongs in the provider options.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#timeout',
      code: `import com.codeborne.selenide.Configuration;
import java.time.Duration;
import static com.codeborne.selenide.appium.AppiumSelectors.byText;

Configuration.timeout = 10_000;     // every should*, default 4000 ms
Configuration.pageLoadTimeout = -1; // no page loads in a native app (launchApp() sets it)

// one slow screen: wait longer here only
$(byText("Order placed")).shouldBe(visible, Duration.ofSeconds(30));`,
    },
  ],
};
