/** @type {import('./index.js').Category} */
export default {
  cat: 'Test Frameworks',
  cls: 'framework',
  color: '#a8a29e',
  items: [
    {
      name: 'ScreenShooterExtension',
      level: 'beginner',
      platform: 'both',
      desc: 'JUnit 5 extension that saves a screenshot and the page source when a test fails for a reason other than a Selenide check, such as an AssertJ assertion or a NullPointerException.',
      tip: 'A failing Selenide check (ElementNotFound, ElementShould and the other UIAssertionError types) is skipped, because Selenide has already saved a screenshot for it. new ScreenShooterExtension(true) captures every test, passed or failed. to() sets the global Configuration.reportsFolder. Only the static Selenide driver is captured, not a new SelenideDriver().',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/junit5/ScreenShooterExtension.html#%3Cinit%3E(boolean)',
      code: `import com.codeborne.selenide.junit5.ScreenShooterExtension;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;

// failed tests only (default)
@ExtendWith(ScreenShooterExtension.class)
class CheckoutTest { }

// every test, saved to a custom folder
class SearchTest {
  @RegisterExtension
  static ScreenShooterExtension screenshots =
      new ScreenShooterExtension(true).to("build/screenshots");
}`,
    },
    {
      name: 'TextReportExtension',
      level: 'beginner',
      platform: 'both',
      desc: 'JUnit 5 extension that logs a table of every Selenide step in the test (element, action, PASSED or FAILED, time in ms) when the test ends.',
      tip: 'The table goes to SLF4J, and the extension throws IllegalStateException ("SLF4J is not configured") when no binding such as slf4j-simple or logback-classic is on the test classpath. Steps are collected per thread, so actions run in another thread are missing. The class lives in selenide-core, so selenide-appium projects have it too. For Allure or your own SelenideLogger listener, see Reports & Debugging.',
      docs: 'https://selenide.org/documentation/reports.html',
      code: `import com.codeborne.selenide.junit5.TextReportExtension;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(TextReportExtension.class)
class LoginTest { }

// logged at INFO after each test:
// +--------------------+-----------------+--------+-----+
// |Element             |Subject          |Status  |ms.  |
// +--------------------+-----------------+--------+-----+
// |open                |/login           |PASSED  |812  |
// |#username           |set value(bob)   |PASSED  |64   |
// |#submit             |click()          |PASSED  |97   |
// +--------------------+-----------------+--------+-----+`,
    },
    {
      name: 'SoftAssertsExtension',
      level: 'intermediate',
      platform: 'both',
      desc: 'With Configuration.assertionMode set to SOFT, a failing should* check is recorded instead of thrown, and the test fails once at the end with a SoftAssertionError that lists every failure.',
      tip: 'Only should, shouldBe, shouldHave and their shouldNot forms keep going: click() or setValue() on a missing element still stops the test at once. SOFT without the extension throws IllegalStateException on the first should*. assertionMode is a global static, so reset it to STRICT after the test, or later classes without the extension fail. new SoftAssertsExtension(false) shortens the stack traces.',
      docs: 'https://github.com/selenide/selenide/wiki/SoftAssertions',
      code: `import com.codeborne.selenide.AssertionMode;
import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.junit5.SoftAssertsExtension;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static com.codeborne.selenide.AssertionMode.SOFT;

@ExtendWith(SoftAssertsExtension.class)
class ProfileTest {
  @BeforeEach
  void soft() { Configuration.assertionMode = SOFT; }

  @AfterEach
  void strict() { Configuration.assertionMode = AssertionMode.STRICT; }

  @Test
  void showsProfile() {
    open("/profile");
    $("#name").shouldHave(text("Bob"));        // recorded, test goes on
    $("#email").shouldHave(text("bob@example.com"));
    $$(".role").shouldHave(size(2));
  } // every failure is thrown here as one SoftAssertionError
}`,
    },
    {
      name: 'BrowserPerTestStrategyExtension',
      level: 'beginner',
      platform: 'both',
      desc: 'JUnit 5 extensions that call closeWebDriver() for you: BrowserPerTestStrategyExtension after each test, BrowserStrategyExtension after all tests of the class.',
      tip: 'Without either, Selenide keeps one browser per thread for the whole run, so cookies and local storage carry over between tests. Closing after each test is the cleanest and the slowest option. On selenide-appium this ends the Appium session, so the next test starts a fresh one.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/junit5/BrowserPerTestStrategyExtension.html',
      code: `import com.codeborne.selenide.junit5.BrowserPerTestStrategyExtension;
import com.codeborne.selenide.junit5.BrowserStrategyExtension;
import org.junit.jupiter.api.extension.ExtendWith;

// new browser for every test
@ExtendWith(BrowserPerTestStrategyExtension.class)
class CartTest { }

// one browser for the class, closed after its last test
@ExtendWith(BrowserStrategyExtension.class)
class CatalogTest { }`,
    },
    {
      name: 'Extension autodetection (junit-platform.properties)',
      level: 'intermediate',
      platform: 'both',
      desc: 'Registers Selenide extensions for every test class at once, with no @ExtendWith: list them in a ServiceLoader file and switch on JUnit extension autodetection. The selenide-appium example project is wired this way.',
      tip: 'The example project switches autodetection on in junit-platform.properties next to the services file. Each extension is built with its no-argument constructor, so ScreenShooterExtension captures failed tests only; use @RegisterExtension in a class that needs options.',
      docs: 'https://github.com/selenide-examples/selenide-appium/blob/main/src/test/resources/META-INF/services/org.junit.jupiter.api.extension.Extension',
      code: `# junit-platform.properties (in src/test/resources)
junit.jupiter.extensions.autodetection.enabled=true

# META-INF/services/org.junit.jupiter.api.extension.Extension (in src/test/resources)
# one fully qualified class name per line
com.codeborne.selenide.junit5.TextReportExtension
com.codeborne.selenide.junit5.ScreenShooterExtension`,
    },
    {
      name: 'JUnit 4 rules (selenide-junit4)',
      level: 'intermediate',
      platform: 'both',
      desc: 'JUnit 4 versions of the same hooks, as rules from the com.codeborne:selenide-junit4 artifact: ScreenShooter, TextReport, SoftAsserts and BrowserStrategy.',
      tip: 'The package is com.codeborne.selenide.junit, without the 4. ScreenShooter has a private constructor: start from failedTests() and add succeededTests() to capture every test. BrowserStrategy closes the browser after each test as a @Rule, or after the class as a static @ClassRule. SoftAsserts still needs Configuration.assertionMode = SOFT.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/junit/package-summary.html',
      code: `import com.codeborne.selenide.junit.BrowserStrategy;
import com.codeborne.selenide.junit.ScreenShooter;
import com.codeborne.selenide.junit.SoftAsserts;
import com.codeborne.selenide.junit.TextReport;
import org.junit.ClassRule;
import org.junit.Rule;

public class LoginTest {
  @Rule public ScreenShooter screenshots = ScreenShooter.failedTests().to("build/screenshots");
  @Rule public TextReport report = new TextReport();
  @Rule public SoftAsserts softAsserts = new SoftAsserts();
  @ClassRule public static BrowserStrategy perClass = new BrowserStrategy();
}`,
    },
    {
      name: 'TestNG listeners (selenide-testng)',
      level: 'intermediate',
      platform: 'both',
      desc: 'TestNG listeners from the com.codeborne:selenide-testng artifact, attached with @Listeners: ScreenShooter, TextReport, SoftAsserts, BrowserPerTest and BrowserPerClass.',
      tip: 'Options are public static fields shared by the whole run: ScreenShooter.captureSuccessfulTests, TextReport.onSucceededTest, SoftAsserts.fullStacktraces. TextReport and SoftAsserts only act on classes whose own @Listeners (or a superclass one) names them, so listing them in testng.xml alone does nothing. SoftAsserts skips methods with expectedExceptions. BrowserPerClass closes the browser in the TestNG onFinish(ITestContext) callback.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/testng/package-summary.html',
      code: `import com.codeborne.selenide.testng.BrowserPerClass;
import com.codeborne.selenide.testng.ScreenShooter;
import com.codeborne.selenide.testng.SoftAsserts;
import com.codeborne.selenide.testng.TextReport;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Listeners;

// BrowserPerTest.class instead closes the browser after every test method
@Listeners({ScreenShooter.class, TextReport.class, SoftAsserts.class, BrowserPerClass.class})
public class LoginTest {
  @BeforeSuite
  public void setUp() {
    ScreenShooter.captureSuccessfulTests = true; // static: applies to every class
  }
}`,
    },
  ],
};
