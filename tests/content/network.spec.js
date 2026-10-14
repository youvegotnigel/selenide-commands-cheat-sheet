import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Proxy & Network entries (Selenide 7.19.0)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"Selenide proxy (proxyEnabled)" exists at level beginner, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Proxy & Network', 'Selenide proxy (proxyEnabled)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Configuration.java: public static boolean proxyEnabled = defaults.proxyEnabled();
    expect(entry.code).toContain('Configuration.proxyEnabled = true');
    // selenide-core 7.19.0 CreateDriverCommand.java: throw new IllegalStateException("Cannot initialize proxy. " +
    //   "Probably you should add \"selenide-proxy\" dependency to your project " + ...
    expect(entry.code).toContain('com.codeborne:selenide-proxy');
  });

  test('"getSelenideProxy()" exists at level beginner, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Proxy & Network', 'getSelenideProxy()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('beginner');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 WebDriverRunner.java: public static SelenideProxyServer getSelenideProxy() {
    expect(entry.code).toContain('WebDriverRunner.getSelenideProxy()');
    // selenide-core 7.19.0 SelenideProxyServer.java: public BrowserUpProxy getProxy() {
    // The selenide.org 2019 post shows BrowserMobProxy, which Selenide no longer uses.
    expect(entry.code).toContain('BrowserUpProxy');
    expect(entry.code).not.toContain('BrowserMobProxy');
  });

  test('"addRequestFilter()" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Proxy & Network', 'addRequestFilter()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideProxyServer.java:
    //   public void addRequestFilter(String name, RequestFilter requestFilter) {
    // MockResponseFilter.java (implements RequestFilter):
    //   public io.netty.handler.codec.http.@Nullable HttpResponse filterRequest(
    //     HttpRequest request, HttpMessageContents contents, HttpMessageInfo messageInfo)
    expect(entry.code).toContain('addRequestFilter("');
    expect(entry.code).toContain('(request, contents, messageInfo) ->');
    expect(entry.code).toContain('return null;');
  });

  test('"addResponseFilter()" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Proxy & Network', 'addResponseFilter()');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideProxyServer.java:
    //   public void addResponseFilter(String name, ResponseFilter responseFilter) {
    // FileDownloadFilter.java (implements ResponseFilter):
    //   public void filterResponse(HttpResponse response, HttpMessageContents contents, HttpMessageInfo messageInfo) {
    expect(entry.code).toContain('addResponseFilter("');
    expect(entry.code).toContain('(response, contents, messageInfo) ->');
  });

  test('"responseMocker() (mockText)" exists at level intermediate, platform web', async ({
    page,
  }) => {
    const entry = await itemIn(page, 'Proxy & Network', 'responseMocker() (mockText)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 SelenideProxyServer.java: public MockResponseFilter responseMocker() {
    expect(entry.code).toContain('.responseMocker()');
    // MockResponseFilter.java:
    //   public void mockText(String name, RequestMatcher requestMatcher, Supplier<String> mockedResponse) {
    //   public void mockText(String name, RequestMatcher requestMatcher, int status, Supplier<String> mockedResponse) {
    expect(entry.code).toContain('.mockText("');
    // RequestMatchers.java: public static RequestMatcher urlContains(HttpMethod method, String url) {
    expect(entry.code).toContain('urlContains(GET, "');
  });

  test('"RequestMatchers" exists at level advanced, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Proxy & Network', 'RequestMatchers');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('advanced');
    expect(entry.platform).toBe('web');
    // selenide-core 7.19.0 RequestMatchers.java: every factory takes the HttpMethod first, e.g.
    //   public static RequestMatcher urlMatches(HttpMethod method, String urlRegex) {
    expect(entry.code).toContain('urlMatches(GET, "');
    // There is no one-argument form such as urlContains("/api"): the method is never optional.
    expect(entry.code).not.toMatch(/url(Equals|StartsWith|EndsWith|Contains|Matches)\("/);
    // RequestMatcher.java: boolean match(HttpRequest request, HttpMessageContents contents, HttpMessageInfo messageInfo);
    expect(entry.code).toContain('RequestMatcher ');
    expect(entry.code).toContain('(request, contents, messageInfo) ->');
  });

  test('"open (proxy auth)" exists at level intermediate, platform web', async ({ page }) => {
    const entry = await itemIn(page, 'Proxy & Network', 'open (proxy auth)');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('intermediate');
    expect(entry.platform).toBe('web');
    // selenide 7.19.0 Selenide.java:
    //   public static void open(String relativeOrAbsoluteUrl, AuthenticationType authenticationType, Credentials credentials) {
    // selenide-core 7.19.0 BearerTokenCredentials.java: public record BearerTokenCredentials(String domain, String token)
    expect(entry.code).toContain('AuthenticationType.BEARER');
    expect(entry.code).toContain('new BearerTokenCredentials("');
  });
});
