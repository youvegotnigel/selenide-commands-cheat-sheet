/** @type {import('./index.js').Category} */
export default {
  cat: 'Proxy & Network',
  cls: 'network',
  color: '#14b8a6',
  items: [
    {
      name: 'Selenide proxy (proxyEnabled)',
      level: 'beginner',
      platform: 'web',
      desc: "Runs the browser through Selenide's embedded BrowserUp proxy. It is off by default and is what makes request and response filters, response mocks, proxy authentication and download() in PROXY mode work.",
      tip: 'Without the selenide-proxy artifact the first open() fails with IllegalStateException "Cannot initialize proxy", which asks for that dependency. The browser must be able to connect back to the test machine, so for a Grid or Selenoid browser set proxyHost to an address the node can reach. Every browser starts its own proxy, so a fixed proxyPort only suits one browser at a time.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#proxyEnabled',
      code: `// Maven/Gradle: com.codeborne:selenide-proxy:7.19.0 (BrowserUp proxy, LittleProxy, Netty)
import com.codeborne.selenide.Configuration;

Configuration.proxyEnabled = true;    // before the browser opens
Configuration.proxyPort = 8888;       // optional, default 0 = any free port
Configuration.proxyHost = "10.0.0.5"; // optional, address the browser uses to reach the proxy
// or -Dselenide.proxyEnabled=true -Dselenide.proxyPort=8888
open("/");`,
    },
    {
      name: 'getSelenideProxy()',
      level: 'beginner',
      platform: 'web',
      desc: "Returns the SelenideProxyServer of the current thread's browser. From it you add filters, mock responses, or reach the underlying BrowserUpProxy with getProxy().",
      tip: 'The browser must be open already: before the first open() it throws "No webdriver is bound to current thread", and with proxyEnabled false it throws IllegalStateException ("Proxy server is not enabled"). Call open() with no URL to start the browser and its proxy, register filters, then open the page. A SelenideDriver instance has its own proxy: use driver.getProxy().',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverRunner.html#getSelenideProxy()',
      code: `import com.browserup.bup.BrowserUpProxy;
import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.WebDriverRunner;
import com.codeborne.selenide.proxy.SelenideProxyServer;

Configuration.proxyEnabled = true;
open(); // starts the browser and its proxy, no page yet
SelenideProxyServer proxy = WebDriverRunner.getSelenideProxy();
proxy.requestFilterNames(); // [selenide.proxy.filter.mockResponse, ...]
BrowserUpProxy bup = proxy.getProxy(); // raw BrowserUp API`,
    },
    {
      name: 'addRequestFilter()',
      level: 'advanced',
      platform: 'web',
      desc: 'Registers a named filter that sees every request from the browser before the proxy forwards it, so a test can add headers or inspect what the page sends.',
      tip: 'Return null to pass the request on. Returning a Netty HttpResponse answers the browser without reaching the server, which is how the built-in MockResponseFilter works (prefer responseMocker() for that). A different filter under a name already in use throws IllegalArgumentException ("Duplicate request filter"); adding the same instance again is ignored. Filters stay for the whole browser session until removeRequestFilter(name).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/proxy/SelenideProxyServer.html#addRequestFilter(java.lang.String,com.browserup.bup.filters.RequestFilter)',
      code: `import static com.codeborne.selenide.WebDriverRunner.getSelenideProxy;

open();
getSelenideProxy().addRequestFilter("feature-flag", (request, contents, messageInfo) -> {
  if (messageInfo.getUrl().contains("/api/")) {
    request.headers().add("X-Feature-Flags", "new-checkout");
  }
  return null; // null = forward to the server
});
open("/checkout");
getSelenideProxy().removeRequestFilter("feature-flag");`,
    },
    {
      name: 'addResponseFilter()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Registers a named filter that sees every response before it reaches the browser. Typical use: collect status codes, URLs or bodies of the traffic a test causes.',
      tip: 'The filter runs on proxy threads, not the test thread, so collect into a thread-safe list. contents gives the body (getTextContents(), getBinaryContents(), getContentType()); Selenide raises the BrowserUp 2 MB message limit, so filters see whole bodies. Remove it with removeResponseFilter(name) or cleanupFilters() when the browser is reused.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/proxy/SelenideProxyServer.html#addResponseFilter(java.lang.String,com.browserup.bup.filters.ResponseFilter)',
      code: `import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import static com.codeborne.selenide.WebDriverRunner.getSelenideProxy;

List<String> errors = new CopyOnWriteArrayList<>();
open();
getSelenideProxy().addResponseFilter("http-errors", (response, contents, messageInfo) -> {
  if (response.status().code() >= 400) {
    errors.add(response.status().code() + " " + messageInfo.getUrl());
  }
});
open("/dashboard");
$("#widgets").shouldBe(visible);
if (!errors.isEmpty()) throw new AssertionError("Failed requests: " + errors);`,
    },
    {
      name: 'responseMocker() (mockText)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Answers matching requests from the proxy with a canned body, so the page gets fake API data without a stub server. mockText() replies with status 200; an overload takes the status code.',
      tip: 'mockText() sends no Content-Type header, only Content-Length, Access-Control-Allow-Origin: * and X-Mocked-By with the mock name; use mockResponse() with a Selenium HttpResponse when the page needs headers. Matchers also accept every OPTIONS request, so CORS preflights are answered too. The first registered mock that matches wins, and a name in use throws IllegalArgumentException until reset(name).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/proxy/MockResponseFilter.html#mockText(java.lang.String,com.codeborne.selenide.proxy.RequestMatcher,java.util.function.Supplier)',
      code: `import com.codeborne.selenide.proxy.MockResponseFilter;
import static com.codeborne.selenide.WebDriverRunner.getSelenideProxy;
import static com.codeborne.selenide.proxy.RequestMatcher.HttpMethod.GET;
import static com.codeborne.selenide.proxy.RequestMatchers.urlContains;

open();
MockResponseFilter mocker = getSelenideProxy().responseMocker();
mocker.mockText("users", urlContains(GET, "/api/users"), () -> "[{\\"name\\":\\"Ann\\"}]");
mocker.mockText("orders-down", urlContains(GET, "/api/orders"), 503, () -> "{}");

open("/users");
$$(".user").shouldHave(size(1));
mocker.reset("users");`,
    },
    {
      name: 'RequestMatchers',
      level: 'advanced',
      platform: 'web',
      desc: 'Factories for the RequestMatcher a mock uses: urlEquals, urlStartsWith, urlEndsWith, urlContains, urlMatches (regex) and urlMatcher (any Function). RequestMatcher is a functional interface, so a lambda can match on the method, headers or body.',
      tip: 'Every factory takes an HttpMethod first (GET, POST, PUT, PATCH, DELETE or OPTIONS), and every one of them also matches OPTIONS requests. The URL tested is the full one from messageInfo.getUrl(), scheme and host included, and urlMatches() uses Matcher.matches(), so the regex must cover the whole URL, which is why the example starts with .*',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/proxy/RequestMatchers.html',
      code: `import com.codeborne.selenide.proxy.RequestMatcher;
import static com.codeborne.selenide.WebDriverRunner.getSelenideProxy;
import static com.codeborne.selenide.proxy.RequestMatcher.HttpMethod.GET;
import static com.codeborne.selenide.proxy.RequestMatchers.*;

RequestMatcher cart = urlEquals(GET, "https://shop.example.com/api/cart");
RequestMatcher images = urlEndsWith(GET, ".png");
RequestMatcher item = urlMatches(GET, ".*/api/items/\\\\d+"); // whole URL
RequestMatcher coupon = (request, contents, messageInfo) ->
  request.method().name().equals("POST") && contents.getTextContents().contains("coupon");

getSelenideProxy().responseMocker().mockText("bad-coupon", coupon, 422, () -> "{}");`,
    },
    {
      name: 'cleanupFilters()',
      level: 'intermediate',
      platform: 'web',
      desc: "Removes every request and response filter you added, leaving Selenide's own filters (named selenide.proxy.filter.*) in place. Use it in @AfterEach when one browser serves many tests.",
      tip: 'Response mocks are not separate filters: they live inside the built-in mockResponse filter, so cleanupFilters() keeps them. Call responseMocker().resetAll() as well. Removing a built-in filter by name throws RuntimeException. cleanupRequestFilters() and cleanupResponseFilters() clean one side only.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/proxy/SelenideProxyServer.html#cleanupFilters()',
      code: `import org.junit.jupiter.api.AfterEach;
import static com.codeborne.selenide.WebDriverRunner.getSelenideProxy;
import static com.codeborne.selenide.WebDriverRunner.hasWebDriverStarted;

@AfterEach
void resetProxy() {
  if (hasWebDriverStarted()) {
    getSelenideProxy().cleanupFilters();            // your filters only
    getSelenideProxy().responseMocker().resetAll(); // mocks survive cleanupFilters()
  }
}`,
    },
    {
      name: 'open (proxy auth)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Opens a page and has the proxy add an Authorization header for any AuthenticationType (BASIC, BEARER, DIGEST and others) to requests whose host matches the credentials domain. For plain Basic Auth without the proxy, see "open (basic auth)".',
      tip: 'The header (sent as both Authorization and Proxy-Authorization) goes to every request whose host equals one of the domains (comma or pipe separated, exact match, so no subdomains), and every later open() replaces or clears it. Without the proxy only BASIC works (through CDP or user:password@ in the URL); other types throw UnsupportedOperationException. An empty domain sends the secret to every host, third parties included.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#open(java.lang.String,com.codeborne.selenide.AuthenticationType,com.codeborne.selenide.Credentials)',
      code: `import com.codeborne.selenide.AuthenticationType;
import com.codeborne.selenide.BasicAuthCredentials;
import com.codeborne.selenide.BearerTokenCredentials;
import com.codeborne.selenide.Configuration;

Configuration.proxyEnabled = true;
open("https://api.example.com/admin", AuthenticationType.BEARER,
  new BearerTokenCredentials("api.example.com", System.getenv("API_TOKEN")));

// Basic through the proxy: name the domain so third parties never get it
open("https://intranet.example.com/", AuthenticationType.BASIC,
  new BasicAuthCredentials("intranet.example.com", "admin", "s3cret"));`,
    },
  ],
};
