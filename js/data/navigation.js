/** @type {import('./index.js').Category} */
export default {
  cat: 'Navigation & Browser',
  cls: 'navigation',
  color: '#76bafe',
  items: [
    {
      name: 'open()',
      level: 'beginner',
      platform: 'web',
      desc: 'Opens a URL in the browser, starting the browser on first use. A relative URL is prefixed with Configuration.baseUrl.',
      tip: 'A URL that does not start with http://, https:// or file:// is treated as relative. The browser is reused across calls and closed automatically when the tests finish.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#open(java.lang.String)',
      code: `Configuration.baseUrl = "https://shop.example.com";
open("/login"); // opens https://shop.example.com/login`,
    },
    {
      name: 'open (basic auth)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Opens a URL behind HTTP Basic Auth. The arguments are url, domain, login and password, and the credentials are only sent to hosts matching the domain.',
      tip: 'An empty domain sends the credentials to every host, which through the Selenide proxy includes third-party calls. The domain may list several hosts separated by "," or "|". Other schemes such as Bearer need the open(url, AuthenticationType, Credentials) overload and Configuration.proxyEnabled = true.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#open(java.lang.String,java.lang.String,java.lang.String,java.lang.String)',
      code: `open("https://intranet.example.com/admin", "intranet.example.com", "admin", "s3cret");`,
    },
    {
      name: 'open (browser state)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Opens a page with cookies, localStorage and sessionStorage restored from a JSON file, and logs in (then saves a fresh file) only when the file is missing or the session has expired. Added in Selenide 7.19.0.',
      tip: "Call loggedInIf() before orLogin(), or orLogin() throws IllegalStateException. The URL must be on the origin stored in the file, because Selenide first loads that origin's /favicon.ico to set the cookies. Parallel threads sharing one file log in only once. The file holds live session tokens, so keep it under build/ and out of version control.",
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#open(java.lang.String,com.codeborne.selenide.OpenOptions)',
      code: `import static com.codeborne.selenide.OpenOptions.withBrowserState;
import java.time.Duration;

open("/dashboard", withBrowserState("build/auth.json")
  .loggedInIf(() -> $("#logout").is(visible, Duration.ofSeconds(2)))
  .orLogin(() -> {
    open("/login");
    $("#username").setValue("bob");
    $("#password").setValue("secret").pressEnter();
  }));`,
    },
    {
      name: 'webdriver().saveBrowserState()',
      level: 'advanced',
      platform: 'web',
      desc: "Saves the current page's origin, cookies, localStorage and sessionStorage to a JSON file, which restoreBrowserState() later applies to a page of the same origin. Added in Selenide 7.19.0.",
      tip: 'Only cookies visible to the current page are saved. restoreBrowserState() does not navigate and keeps existing cookies: the browser must already be on the saved origin, or it throws IllegalStateException. open(url, withBrowserState(file)) is usually simpler because it opens the origin for you.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/BrowserSession.html#saveBrowserState(java.nio.file.Path)',
      code: `import com.codeborne.selenide.BrowserState;
import java.nio.file.Path;

// after logging in once
webdriver().saveBrowserState(Path.of("build/auth.json"));

// later, in a fresh browser on the same origin
open("/favicon.ico");
webdriver().restoreBrowserState(BrowserState.fromFile("build/auth.json"));
open("/dashboard");`,
    },
    {
      name: 'back()',
      level: 'beginner',
      platform: 'web',
      desc: "Moves one step back in the browser history, like the browser's Back button.",
      tip: 'It calls WebDriver navigate().back(), so on a single-page app it can return before the previous view renders. Assert on an element or the URL before acting on the page.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#back()',
      code: `open("/catalog");
$("a.product").click();
back(); // to /catalog
$("h1").shouldHave(text("Catalog"));`,
    },
    {
      name: 'forward()',
      level: 'beginner',
      platform: 'web',
      desc: "Moves one step forward in the browser history, like the browser's Forward button.",
      tip: 'It only has somewhere to go after a back(). It calls WebDriver navigate().forward(), so on a single-page app assert on an element or the URL before acting on the page.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#forward()',
      code: `open("/catalog");
$("a.product").click();
back();
forward(); // to the product page again
$("h1").shouldHave(text("Product"));`,
    },
    {
      name: 'refresh()',
      level: 'beginner',
      platform: 'web',
      desc: "Reloads the current page, like the browser's reload button.",
      tip: 'A SelenideElement held in a variable keeps working after the reload, because Selenide looks the element up again on every call. A raw WebElement would throw StaleElementReferenceException.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#refresh()',
      code: `import com.codeborne.selenide.SelenideElement;

SelenideElement cartCount = $("#cart-count");
$("#clear-cart").click();
refresh();
cartCount.shouldHave(text("0")); // same variable, looked up again`,
    },
    {
      name: 'updateHash()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Changes the hash part of the current URL without reloading the page. It accepts "#hash" or "hash".',
      tip: 'It runs window.location.hash = ... in the page, so it is the way to move around an ajax or single-page app, where open(url) would reload everything. The page must listen to hashchange to react.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#updateHash(java.lang.String)',
      code: `open("/app");
updateHash("#/orders/42");
$("h1").shouldHave(text("Order 42"));`,
    },
    {
      name: 'zoom()',
      level: 'advanced',
      platform: 'web',
      desc: 'Zooms the current page in or out. The factor is relative to normal size: 1.5 zooms in, 0.5 zooms out.',
      tip: 'It scales document.body with a CSS transform, so the layout does not reflow like browser zoom and media queries do not change. The next page load resets it, and zoom(1.0) restores normal size at once.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#zoom(double)',
      code: `zoom(2.0);
$("#menu").shouldBe(visible);
zoom(1.0);`,
    },
    {
      name: 'title()',
      level: 'beginner',
      platform: 'web',
      desc: 'Returns the title of the current page.',
      tip: 'title() reads once and does not wait, so right after a click it may still return the old title. To wait for it, use webdriver().shouldHave(WebDriverConditions.title(...)).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#title()',
      code: `import com.codeborne.selenide.WebDriverConditions;

String current = title(); // read once, no waiting
webdriver().shouldHave(WebDriverConditions.title("Checkout")); // waits`,
    },
    {
      name: 'url()',
      level: 'beginner',
      platform: 'web',
      desc: 'Returns the URL of the current page as a String. currentFrameUrl() returns the URL of the frame you switched into.',
      tip: 'It lives in WebDriverRunner, not in Selenide, so it needs its own static import. It reads once and does not wait: after a click that navigates, assert with webdriver().shouldHave(url(...)) instead. It can return null when no page is open.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverRunner.html#url()',
      code: `import static com.codeborne.selenide.WebDriverRunner.url;

open("/search?q=selenide");
String current = url();`,
    },
    {
      name: 'source()',
      level: 'beginner',
      platform: 'web',
      desc: 'Returns the HTML source of the current page as a String.',
      tip: 'It lives in WebDriverRunner, not in Selenide, so it needs its own static import. It reads once and does not wait, and it can return null when no page is open. To check what the page shows, use element conditions such as $("body").shouldHave(text(...)).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverRunner.html#source()',
      code: `import static com.codeborne.selenide.WebDriverRunner.source;

open("/search?q=selenide");
String html = source();`,
    },
    {
      name: 'webdriver().shouldHave(url())',
      level: 'beginner',
      platform: 'web',
      desc: 'Waits until the current URL equals the expected value, up to Configuration.timeout.',
      tip: 'url() comes from WebDriverConditions, not Condition, so it needs its own import. It is an exact match on the full URL, query string and fragment included, and baseUrl is not prepended. For part of the URL use urlContaining() or urlStartingWith().',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverConditions.html#url(java.lang.String)',
      code: `import static com.codeborne.selenide.WebDriverConditions.url;

$("#login").click();
webdriver().shouldHave(url("https://shop.example.com/dashboard"));`,
    },
    {
      name: 'webdriver().shouldHave(urlContaining())',
      level: 'intermediate',
      platform: 'web',
      desc: 'Waits until the current URL contains, or starts with, the expected text. shouldNotHave() waits for the opposite.',
      tip: "These check the top-level page URL even while you are switched into an iframe. For the frame's own URL use currentFrameUrl(), currentFrameUrlContaining() or currentFrameUrlStartingWith().",
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverConditions.html#urlContaining(java.lang.String)',
      code: `import static com.codeborne.selenide.WebDriverConditions.urlContaining;
import static com.codeborne.selenide.WebDriverConditions.urlStartingWith;

webdriver().shouldHave(urlContaining("/orders/"));
webdriver().shouldHave(urlStartingWith("https://shop.example.com/checkout"));
webdriver().shouldNotHave(urlContaining("/login"));`,
    },
    {
      name: 'closeWindow()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Closes the current window or tab. If it is the last one open, the browser quits.',
      tip: "Focus does not move to another window: call switchTo().window(...) before the next command. To end the whole browser, use closeWebDriver(), which also releases Selenide's driver and proxy.",
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#closeWindow()',
      code: `$("a[target=_blank]").click();
switchTo().window(1);
closeWindow();
switchTo().window(0); // back to the first tab`,
    },
    {
      name: 'closeWebDriver()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Quits the browser of the current thread, closing all its windows. The next open() starts a new browser.',
      tip: 'Selenide reuses one browser across tests and closes it when the JVM exits, so you only need this for a fresh browser per test. In JUnit 5, @ExtendWith(BrowserPerTestStrategyExtension.class) calls it after each test for you.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#closeWebDriver()',
      code: `import org.junit.jupiter.api.AfterEach;

@AfterEach
void tearDown() {
  closeWebDriver();
}`,
    },
    {
      name: 'SelenideDriver (multiple browsers)',
      level: 'advanced',
      platform: 'web',
      desc: 'An explicit browser object with its own config, for tests that drive two or more browsers at once, such as a chat between two users.',
      tip: 'new SelenideConfig() starts from selenide.properties and -Dselenide.* values, not from what you set on Configuration. The unprefixed $() and open() still use the default browser. For a short block in a second browser, inNewBrowser(() -> ...) opens one and closes it afterwards.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideDriver.html#%3Cinit%3E(com.codeborne.selenide.Config)',
      code: `import com.codeborne.selenide.SelenideConfig;
import com.codeborne.selenide.SelenideDriver;

SelenideDriver alice = new SelenideDriver(new SelenideConfig().browser("chrome"));
SelenideDriver bob = new SelenideDriver(new SelenideConfig().browser("firefox"));

alice.open("https://chat.example.com");
bob.open("https://chat.example.com");
alice.$("#message").setValue("Hi Bob").pressEnter();
bob.$(".last-message").shouldHave(text("Hi Bob"));

alice.close();
bob.close();`,
    },
  ],
};
