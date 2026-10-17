/** @type {import('./index.js').Category} */
export default {
  cat: 'Patterns',
  cls: 'pattern',
  color: '#f996a9',
  items: [
    {
      name: 'Page ready marker (no sleep)',
      level: 'beginner',
      platform: 'web',
      desc: 'Waits for a page to be ready by asserting something that only exists once it is ready, such as a data attribute the app sets after loading, instead of pausing for a fixed time.',
      tip: 'A fixed pause is too short on a slow CI agent and wasted time everywhere else, while a should* check returns as soon as the marker appears. If the app has no such marker, ask for one: a data-ready attribute is cheaper than any wait you can build from outside. Pick a marker that the new page sets, not one the previous page also had.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#attribute(java.lang.String,java.lang.String)',
      code: `import java.time.Duration;

open("/reports");
// the app sets data-ready="true" on <body> once its data has loaded
$("body").shouldHave(attribute("data-ready", "true"), Duration.ofSeconds(15));
$$(".report-row").shouldHave(sizeGreaterThan(0));`,
    },
    {
      name: 'Fluent page objects (return the next page)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Each action method returns the page object the user lands on, so a test reads as one chain and the compiler only offers actions that exist on the current page.',
      tip: 'Check in the constructor that the page really opened, so a wrong turn fails at that step and not three calls later. Use plain $() there: page() runs the constructor first and fills @FindBy fields afterwards, so they are still null inside it. Return this from methods that stay on the same page.',
      docs: 'https://selenide.org/documentation/page-objects.html',
      code: `public class LoginPage {
  public DashboardPage loginAs(String user, String password) {
    $("#username").setValue(user);
    $("#password").setValue(password).pressEnter();
    return page(DashboardPage.class);
  }
}

public class DashboardPage {
  DashboardPage() {
    $("#dashboard").shouldBe(visible); // fails here if the login did not work
  }

  public DashboardPage dismissBanner() {
    $(".banner .close").click();
    return this;
  }
}

open("/login", LoginPage.class)
    .loginAs("alice", "secret")
    .dismissBanner();`,
    },
    {
      name: 'Condition library (static factories)',
      level: 'intermediate',
      platform: 'both',
      desc: "Collects your app's own conditions in one final class of static methods, so after a static import tests read like the built-in ones. Each method combines built-in conditions, match() or a WebElementCondition subclass.",
      tip: 'The name you pass to and() or match() is what a failure message shows, so name it after the domain ("toast success"), not the mechanics. Do not reuse a name and parameter list that Condition already has, such as text(String): with both classes statically imported, the call becomes ambiguous and no longer compiles. Writing a condition class is covered under Custom WebElementCondition in Conditions.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#and(java.lang.String,com.codeborne.selenide.WebElementCondition,com.codeborne.selenide.WebElementCondition,com.codeborne.selenide.WebElementCondition...)',
      code: `import com.codeborne.selenide.WebElementCondition;

public final class AppConditions {
  private AppConditions() {}

  public static WebElementCondition toast(String level) {
    return and("toast " + level, visible, cssClass("toast-" + level));
  }

  public static WebElementCondition widerThan(int px) {
    return match("wider than " + px + "px", el -> el.getSize().getWidth() > px);
  }
}

// import static com.example.AppConditions.*;
$(".toast").shouldBe(toast("success"));
$("#avatar").should(widerThan(100));`,
    },
    {
      name: 'execute(Command) (custom command)',
      level: 'advanced',
      platform: 'both',
      desc: 'Packs a reusable element action into a class: extend FluentCommand (or implement Command<T> to return a value) and run it with $(...).execute(command). A FluentCommand returns the element, so the chain continues.',
      tip: 'execute() passes the command no arguments, so give it its data through a constructor or a static factory. Override the two-argument execute(WebElementSource, args): the three-argument one is deprecated. execute(command, Duration) runs it with its own timeout. Registering a name with Commands.getInstance().add() does not add a method to SelenideElement or SelenideAppiumElement, so prefer execute(). The same command works on web and mobile elements.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#execute(com.codeborne.selenide.FluentCommand)',
      code: `import com.codeborne.selenide.FluentCommand;
import com.codeborne.selenide.impl.WebElementSource;
import org.openqa.selenium.WebElement;

public class ReplaceText extends FluentCommand {
  private final String text;

  private ReplaceText(String text) {
    this.text = text;
  }

  public static ReplaceText replaceText(String text) {
    return new ReplaceText(text);
  }

  @Override
  protected void execute(WebElementSource locator, Object[] args) {
    WebElement field = locator.findAndAssertElementIsInteractable();
    field.clear();
    field.sendKeys(text);
  }
}

// import static com.example.ReplaceText.replaceText;
$("#search").execute(replaceText("selenide")).pressEnter();`,
    },
    {
      name: 'toWebElement() and getWrappedElement()',
      level: 'advanced',
      platform: 'both',
      desc: 'Return the Selenium WebElement behind a SelenideElement, for libraries and Selenium APIs that need the raw element.',
      tip: 'toWebElement() throws NoSuchElementException at once if the element is missing. getWrappedElement() waits up to Configuration.timeout and throws Selenide ElementNotFound. The raw element is not retried afterwards.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#toWebElement()',
      code: `import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

WebElement raw = $("#chart").toWebElement();
Select select = new Select($("#country").getWrappedElement());`,
    },
    {
      name: 'cached()',
      level: 'advanced',
      platform: 'both',
      desc: 'Returns the element with its lookup cached: later calls do not find it in the browser again.',
      tip: 'It saves repeated lookups on a long chain of calls. If the page re-renders the element, the cached one becomes stale and calls on it fail, so use it only for elements that stay in the DOM during the steps.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#cached()',
      code: `SelenideElement form = $("#checkout").cached();
form.$(".email").setValue("ada@example.com");
form.$(".pay").click();`,
    },
    {
      name: 'inNewBrowser() (second user)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Opens a fresh browser with the same settings, runs the block in it and closes it at the end. After the block the first browser is active again, for checks such as "the other user sees my message".',
      tip: 'The new browser has no cookies or storage, so log in inside the block. It is closed even when the block fails. With inNewBrowser(config, ...) (since 7.6.0) the Config only decides how the browser starts (browser, headless, size, remote): inside the block, timeouts and the baseUrl for open() still come from the thread settings. When two users act back and forth many times, two SelenideDriver objects are simpler.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#inNewBrowser(java.lang.Runnable)',
      code: `import com.codeborne.selenide.SelenideConfig;

open("/chat");
$("#message").setValue("Hi Bob").pressEnter();

inNewBrowser(() -> {
  open("/chat"); // a second, clean browser
  $(".last-message").shouldHave(text("Hi Bob"));
}); // closed here

inNewBrowser(new SelenideConfig().browser("firefox"), () -> {
  open("/chat");
  $(".last-message").shouldHave(text("Hi Bob"));
});

$(".read-receipt").shouldBe(visible); // the first browser again`,
    },
    {
      name: 'using(webDriver, lambda)',
      level: 'advanced',
      platform: 'web',
      desc: 'Runs a block of Selenide calls in a WebDriver you created yourself, then switches the thread back to the browser it had before, even if the block throws.',
      tip: 'Selenide never quits this driver, so call quit() yourself in a finally block. Call using() again with the same driver to return to it with its cookies intact. Selenide applies none of its own setup to the driver (no browser size, no listeners). The overload using(driver, proxy, lambda) also binds a SelenideProxyServer.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#using(org.openqa.selenium.WebDriver,java.lang.Runnable)',
      code: `import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

open("/orders/42"); // the default browser
WebDriver admin = new FirefoxDriver();
try {
  using(admin, () -> {
    open("/admin/orders/42"); // in the admin's Firefox
    $("#approve").click();
  });
  refresh(); // back in the default browser
  $("#status").shouldHave(text("Approved"));
} finally {
  admin.quit();
}`,
    },
    {
      name: 'Per-thread settings (open with SelenideConfig)',
      level: 'advanced',
      platform: 'web',
      desc: 'In parallel runs each thread has its own browser, but the Configuration fields are static and shared by all threads. open(url, config) gives the current thread its own settings until closeWebDriver().',
      tip: 'SelenideConfig has no equals(), so open() compares by instance: passing a new SelenideConfig on every call closes and restarts the browser each time. Build it once per thread and reuse it. new SelenideConfig() starts from selenide.properties and -Dselenide.* values, not from Configuration. closeWebDriver() puts the thread back on Configuration.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#open(java.lang.String,com.codeborne.selenide.Config)',
      code: `import com.codeborne.selenide.SelenideConfig;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

class CheckoutTest {
  // one instance per thread, reused by every test that runs on it
  private static final ThreadLocal<SelenideConfig> FIREFOX = ThreadLocal.withInitial(
      () -> new SelenideConfig()
          .browser("firefox")
          .baseUrl("https://shop.example.com")
          .timeout(10000));

  @Test
  void pays() {
    open("/checkout", FIREFOX.get()); // this thread's browser and settings
    $("#pay").click(); // waits up to 10 s
  }

  @AfterEach
  void tearDown() {
    closeWebDriver(); // the thread is back on the static Configuration
  }
}`,
    },
    {
      name: 'WebDriverProvider (custom browser)',
      level: 'advanced',
      platform: 'web',
      desc: 'A class that builds the WebDriver itself. Set its class name as Configuration.browser and Selenide calls createDriver() whenever the thread needs a new browser.',
      tip: 'Merge the capabilities you are given, or Configuration.browserCapabilities and page load strategy are lost. Configuration.headless is not applied for you, and the provider is skipped entirely when Configuration.remote is set. For plain options, Configuration.browserCapabilities is simpler. The class Javadoc recommends a DriverFactory when you need the Selenide proxy or downloads folder.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverProvider.html#createDriver(org.openqa.selenium.Capabilities)',
      code: `import com.codeborne.selenide.WebDriverProvider;
import java.util.Map;
import org.openqa.selenium.Capabilities;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

public class MobileChromeProvider implements WebDriverProvider {
  @Override
  public WebDriver createDriver(Capabilities capabilities) {
    ChromeOptions options = new ChromeOptions()
        .setExperimentalOption("mobileEmulation", Map.of("deviceName", "Pixel 7"))
        .addArguments("--headless=new");
    return new ChromeDriver(options.merge(capabilities)); // keep what Selenide prepared
  }
}

// or -Dselenide.browser=com.example.MobileChromeProvider
Configuration.browser = MobileChromeProvider.class.getName();`,
    },
  ],
};
