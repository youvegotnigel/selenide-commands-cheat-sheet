/** @type {import('./index.js').Category} */
export default {
  cat: 'JavaScript, Storage, Clipboard',
  cls: 'javascript',
  color: '#e2f07d',
  items: [
    {
      name: 'executeJavaScript()',
      level: 'beginner',
      platform: 'web',
      desc: 'Runs JavaScript in the current page and returns its result. Extra parameters arrive in the script as arguments[0], arguments[1] and so on.',
      tip: 'The return type is a generic T inferred from the variable you assign to, and the cast is unchecked, so a wrong type fails with ClassCastException at the assignment, not in the browser. Read numbers into Number and convert. A promise can be awaited inline: Selenide\'s own clipboard code runs "return await navigator.clipboard.readText()" through this method.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#executeJavaScript(java.lang.String,java.lang.Object...)',
      code: `String title = executeJavaScript("return document.title");
Boolean loggedIn = executeJavaScript("return window.app.user != null");
Number items = executeJavaScript(
    "return document.querySelectorAll(arguments[0]).length", ".cart-item");
int count = items.intValue();

// no return value needed
executeJavaScript("window.scrollTo(arguments[0], arguments[1])", 0, 500);`,
    },
    {
      name: 'executeAsyncJavaScript()',
      level: 'advanced',
      platform: 'web',
      desc: 'Runs asynchronous JavaScript and blocks until the script calls the callback that WebDriver passes as the last argument. The value given to the callback is returned.',
      tip: 'Selenide hands the script to Selenium executeAsyncScript unchanged. For code that already returns a promise, plain executeJavaScript() with "return await ..." is simpler and needs no callback.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#executeAsyncJavaScript(java.lang.String,java.lang.Object...)',
      code: `String status = executeAsyncJavaScript(
    "const done = arguments[arguments.length - 1];"
        + "fetch(arguments[0]).then(r => done(String(r.status)));",
    "/api/health");`,
    },
    {
      name: 'localStorage()',
      level: 'beginner',
      platform: 'web',
      desc: "Reads and writes the current page's localStorage: getItem, setItem, removeItem, clear, size, isEmpty, containsItem and getItems.",
      tip: 'Every call runs JavaScript in the current page, so it acts on the origin that is open now: open() a page of the app first. getItem() returns null for a missing key, and values are strings. clearBrowserLocalStorage() is deprecated since 7.17.0 in favour of localStorage().clear(). To carry storage over between tests, see webdriver().saveBrowserState().',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#localStorage()',
      code: `import java.util.Map;

open("/");
localStorage().setItem("theme", "dark");
String theme = localStorage().getItem("theme"); // "dark", or null if missing
boolean hasToken = localStorage().containsItem("token");
Map<String, String> all = localStorage().getItems();
localStorage().removeItem("theme");
localStorage().clear();`,
    },
    {
      name: 'localStorage().shouldHave(itemWithValue())',
      level: 'intermediate',
      platform: 'web',
      desc: 'Waits until localStorage has a key, or a key with an exact value, using LocalStorageConditions. Useful when the app writes storage after an async call.',
      tip: 'It retries up to Configuration.timeout like any should, or takes a Duration. SessionStorageConditions has methods with the same names, item() and itemWithValue(), so a test that checks both storages cannot static-import both: qualify one with its class name.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/LocalStorageConditions.html#itemWithValue(java.lang.String,java.lang.String)',
      code: `import com.codeborne.selenide.SessionStorageConditions;
import java.time.Duration;
import static com.codeborne.selenide.LocalStorageConditions.item;
import static com.codeborne.selenide.LocalStorageConditions.itemWithValue;

$("#accept-all").click();
localStorage().shouldHave(itemWithValue("consent", "all"));
localStorage().shouldNotHave(item("pendingSync"), Duration.ofSeconds(10));
sessionStorage().shouldHave(SessionStorageConditions.item("cartId"));`,
    },
    {
      name: 'sessionStorage()',
      level: 'beginner',
      platform: 'web',
      desc: "The same API as localStorage() for the current page's sessionStorage, with its own conditions in SessionStorageConditions.",
      tip: 'sessionStorage is kept per tab and per origin and is cleared when the tab closes, so it is the place for wizard steps and one-tab state. Like localStorage(), it runs JavaScript in the current page, so open the app first.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#sessionStorage()',
      code: `import static com.codeborne.selenide.SessionStorageConditions.itemWithValue;

open("/checkout");
sessionStorage().setItem("step", "2");
int size = sessionStorage().size();
sessionStorage().shouldHave(itemWithValue("step", "2"));
sessionStorage().clear();`,
    },
    {
      name: 'cookies()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Reads, adds and deletes cookies of the current domain through a CookieStore, and waits for them with CookieStoreConditions.cookie().',
      tip: 'Every method works on the domain of the page that is open, so open() a page before add(). cookies().clear() replaces clearBrowserCookies(), deprecated since 7.17.0. The same cookie() checks exist for webdriver().shouldHave(); to keep cookies between tests, see open (browser state).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#cookies()',
      code: `import org.openqa.selenium.Cookie;
import static com.codeborne.selenide.CookieStoreConditions.cookie;

open("/");
cookies().add("locale", "de");
Cookie session = cookies().get("JSESSIONID"); // null if absent
int count = cookies().size();
cookies().shouldHave(cookie("locale", "de"));
cookies().delete("locale");
cookies().clear();`,
    },
    {
      name: 'clipboard()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Reads and writes clipboard text with getText() and setText(), and waits for its content with ClipboardConditions.content().',
      tip: 'In Chromium, local or on a Grid with DevTools access, Selenide grants clipboard permission over CDP and uses navigator.clipboard in the open page. Other browsers fall back to java.awt.Toolkit, the clipboard of the machine running the test, which throws IllegalStateException when Configuration.remote is set; selenide-selenoid and selenide-moon add a remote clipboard. The clipboard is shared, so parallel tests can overwrite each other.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#clipboard()',
      code: `import static com.codeborne.selenide.ClipboardConditions.content;

$("#copy-link").click();
clipboard().shouldHave(content("https://example.com/s/abc123"));
String copied = clipboard().getText();

clipboard().setText("PROMO-2026");`,
    },
    {
      name: 'paste()',
      level: 'beginner',
      platform: 'web',
      desc: 'Types the current clipboard text into an input field, after the text that is already there.',
      tip: 'It does not press Ctrl+V: the command reads the clipboard through ClipboardService and sends the text with sendKeys, so the page sees key events, not a paste event. The Javadoc also promises a change event, but the 7.19.0 command only calls sendKeys. Where clipboard() cannot reach the clipboard, paste() fails the same way.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#paste()',
      code: `clipboard().setText("PROMO-2026");
$("#coupon").paste();
$("#coupon").shouldHave(value("PROMO-2026"));`,
    },
    {
      name: 'clock().setFixedTime()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Freezes the JavaScript Date in the browser at a given Instant, so date-dependent pages render the same on every run. Added in Selenide 7.19.0.',
      tip: 'It installs a script for documents loaded after the call: call it before open(), or refresh() afterwards. Only Date is replaced and the time does not move (Date.now() always returns the same value); timers and performance.now() are untouched. Chromium uses CDP and Firefox uses WebDriver BiDi; a browser with neither throws UnsupportedOperationException. It lasts for the browser session, so call clock().reset() when the browser is reused.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/BrowserClock.html#setFixedTime(java.time.Instant)',
      code: `import java.time.Instant;

clock().setFixedTime(Instant.parse("2026-12-24T18:00:00Z"));
open("/");
$("#greeting").shouldHave(text("Merry Christmas"));

clock().reset();`,
    },
    {
      name: 'clock().setTimezone()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Overrides the browser timezone with an IANA id such as "Asia/Tokyo", for pages that format dates in the user\'s local zone. Added in Selenide 7.19.0.',
      tip: 'The argument is a String id, not a ZoneId. Combine it with setFixedTime() for fully repeatable date output, and set both before open(). clock().reset() removes the fixed time and the timezone override together, and does nothing when no browser has started. Supported in Chromium (CDP) and Firefox (BiDi) only.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/BrowserClock.html#setTimezone(java.lang.String)',
      code: `import java.time.Instant;

clock().setTimezone("Asia/Tokyo");
clock().setFixedTime(Instant.parse("2026-01-01T00:00:00Z"));
open("/orders");
$(".order-date").shouldHave(text("2026/01/01 09:00"));

clock().reset(); // fixed time and timezone back to normal`,
    },
    {
      name: 'emulateDevice() and resetEmulation()',
      level: 'advanced',
      platform: 'web',
      desc: 'emulateDevice(Device) sets the viewport size and pixel ratio of a phone, tablet or other device. resetEmulation() restores the normal viewport.',
      tip: 'Predefined devices include IPHONE_SE, IPHONE_14, PIXEL_7 and GALAXY_S21, and Device is a record of name, width, height and pixelRatio, so you can build your own. It works through DevTools in Chromium browsers and through BiDi in Firefox. Any other setup throws UnsupportedOperationException.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#emulateDevice(com.codeborne.selenide.Device)',
      code: `import com.codeborne.selenide.Device;

emulateDevice(Device.PIXEL_7);
open("/");
$("#mobile-menu").shouldBe(visible);
resetEmulation();`,
    },
  ],
};
