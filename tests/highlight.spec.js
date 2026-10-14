import { test, expect } from '@playwright/test';

// Expected HTML is written by hand from the token rules in the spec (section 7).
// Never regenerate these strings by running the highlighter.

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

const java = (page, code) => page.evaluate((c) => window.highlight(c), code);
const shell = (page, code) => page.evaluate((c) => window.highlightShell(c), code);
const xml = (page, code) => page.evaluate((c) => window.highlightXml(c), code);

test.describe('highlight() for Java', () => {
  test('$ and $$ are API tokens, methods before ( are fn, strings are strings', async ({
    page,
  }) => {
    expect(await java(page, '$("#id").shouldHave(text("Hi"));')).toBe(
      '<span class="tok-api">$</span>(<span class="tok-string">"#id"</span>).' +
        '<span class="tok-fn">shouldHave</span>(<span class="tok-fn">text</span>(' +
        '<span class="tok-string">"Hi"</span>));'
    );
    expect(await java(page, '$$(".row").shouldHave(size(3));')).toBe(
      '<span class="tok-api">$$</span>(<span class="tok-string">".row"</span>).' +
        '<span class="tok-fn">shouldHave</span>(<span class="tok-fn">size</span>(' +
        '<span class="tok-number">3</span>));'
    );
  });

  test('an API name followed by ( stays an API token', async ({ page }) => {
    expect(await java(page, 'open("/login");')).toBe(
      '<span class="tok-api">open</span>(<span class="tok-string">"/login"</span>);'
    );
  });

  test('annotations are keywords', async ({ page }) => {
    expect(await java(page, '@Test\nvoid login() {}')).toBe(
      '<span class="tok-keyword">@Test</span>\n<span class="tok-keyword">void</span> ' +
        '<span class="tok-fn">login</span>() {}'
    );
  });

  test('a text block is one string, even with quotes and // inside', async ({ page }) => {
    const code = 'String json = """\n  {"a": "//b"}\n  """;';
    expect(await java(page, code)).toBe(
      'String json = <span class="tok-string">"""\n  {"a": "//b"}\n  """</span>;'
    );
  });

  test('// inside a string is not a comment; a trailing // is', async ({ page }) => {
    expect(await java(page, 'open("https://example.com"); // go')).toBe(
      '<span class="tok-api">open</span>(<span class="tok-string">"https://example.com"</span>); ' +
        '<span class="tok-comment">// go</span>'
    );
  });

  test('escaped quotes and a trailing escaped backslash stay inside the string', async ({
    page,
  }) => {
    const code = String.raw`String s = "say \"hi\" \\";`;
    expect(await java(page, code)).toBe(
      String.raw`String s = <span class="tok-string">"say \"hi\" \\"</span>;`
    );
  });

  test('char literals are strings', async ({ page }) => {
    expect(await java(page, "char c = 'a';")).toBe(
      '<span class="tok-keyword">char</span> c = <span class="tok-string">\'a\'</span>;'
    );
  });

  test('long, underscore, hex, float and exponent numbers', async ({ page }) => {
    const code = 'long t = 10L; int n = 1_000; int h = 0xFF; float f = 1.5f; double e = 2e3;';
    expect(await java(page, code)).toBe(
      '<span class="tok-keyword">long</span> t = <span class="tok-number">10L</span>; ' +
        '<span class="tok-keyword">int</span> n = <span class="tok-number">1_000</span>; ' +
        '<span class="tok-keyword">int</span> h = <span class="tok-number">0xFF</span>; ' +
        '<span class="tok-keyword">float</span> f = <span class="tok-number">1.5f</span>; ' +
        '<span class="tok-keyword">double</span> e = <span class="tok-number">2e3</span>;'
    );
  });

  test('generics are escaped and an identifier before < is plain', async ({ page }) => {
    expect(await java(page, 'List<SelenideElement> rows = new ArrayList<>();')).toBe(
      'List&lt;<span class="tok-api">SelenideElement</span>&gt; rows = ' +
        '<span class="tok-keyword">new</span> ArrayList&lt;&gt;();'
    );
  });

  test('modern Java keywords: record, sealed, permits, non-sealed', async ({ page }) => {
    expect(await java(page, 'record Point(int x) {}')).toBe(
      '<span class="tok-keyword">record</span> <span class="tok-fn">Point</span>(' +
        '<span class="tok-keyword">int</span> x) {}'
    );
    expect(await java(page, 'sealed interface Shape permits Sq {}')).toBe(
      '<span class="tok-keyword">sealed</span> <span class="tok-keyword">interface</span> Shape ' +
        '<span class="tok-keyword">permits</span> Sq {}'
    );
    expect(await java(page, 'non-sealed class Sq {}')).toBe(
      '<span class="tok-keyword">non-sealed</span> <span class="tok-keyword">class</span> Sq {}'
    );
  });

  test('JavaScript-only words are plain in Java', async ({ page }) => {
    expect(await java(page, 'let await function')).toBe('let await function');
  });

  test('block and Javadoc comments', async ({ page }) => {
    expect(await java(page, '/** Docs */ int a;')).toBe(
      '<span class="tok-comment">/** Docs */</span> <span class="tok-keyword">int</span> a;'
    );
  });

  test('escapes HTML so snippets cannot inject markup', async ({ page }) => {
    expect(await java(page, 'if (a < b && c > d) {}')).toBe(
      '<span class="tok-keyword">if</span> (a &lt; b &amp;&amp; c &gt; d) {}'
    );
  });

  test('is deterministic across repeated calls (regex lastIndex reset)', async ({ page }) => {
    const [a, b] = await page.evaluate(() => {
      const c = 'open("/x");';
      return [window.highlight(c), window.highlight(c)];
    });
    expect(a).toBe(b);
  });
});

test.describe('highlightShell()', () => {
  test('./gradlew is a program, --tests a flag, the quoted name a string', async ({ page }) => {
    expect(await shell(page, './gradlew test --tests "LoginTest"')).toBe(
      '<span class="tok-api">./gradlew</span> test <span class="tok-keyword">--tests</span> ' +
        '<span class="tok-string">"LoginTest"</span>'
    );
  });

  test('a -D system property flag includes its dotted name', async ({ page }) => {
    expect(await shell(page, 'mvn test -Dselenide.browser=firefox')).toBe(
      '<span class="tok-api">mvn</span> test <span class="tok-keyword">-Dselenide.browser</span>=firefox'
    );
  });

  test('# glued to a word is not a comment (mvn -Dtest=Class#method)', async ({ page }) => {
    expect(await shell(page, 'mvn test -Dtest=LoginTest#login')).toBe(
      '<span class="tok-api">mvn</span> test <span class="tok-keyword">-Dtest</span>=LoginTest#login'
    );
  });

  test('# at line start is a comment, key=value lines stay plain', async ({ page }) => {
    expect(await shell(page, '# selenide.properties\nselenide.browser=chrome')).toBe(
      '<span class="tok-comment"># selenide.properties</span>\nselenide.browser=chrome'
    );
  });

  test('// in a URL is not a comment', async ({ page }) => {
    expect(await shell(page, 'mvn test -Dselenide.baseUrl=https://example.com')).toBe(
      '<span class="tok-api">mvn</span> test <span class="tok-keyword">-Dselenide.baseUrl</span>=https://example.com'
    );
  });
});

test.describe('highlightXml()', () => {
  test('tags are keywords, text is plain', async ({ page }) => {
    expect(await xml(page, '<dependency>\n  <groupId>com.codeborne</groupId>\n</dependency>')).toBe(
      '&lt;<span class="tok-keyword">dependency</span>&gt;\n' +
        '  &lt;<span class="tok-keyword">groupId</span>&gt;com.codeborne&lt;/' +
        '<span class="tok-keyword">groupId</span>&gt;\n&lt;/<span class="tok-keyword">dependency</span>&gt;'
    );
  });

  test('${property} references are API tokens', async ({ page }) => {
    expect(await xml(page, '<version>${selenide.version}</version>')).toBe(
      '&lt;<span class="tok-keyword">version</span>&gt;<span class="tok-api">${selenide.version}</span>' +
        '&lt;/<span class="tok-keyword">version</span>&gt;'
    );
  });

  test('attribute names are fn, values are strings, apostrophes in text are plain', async ({
    page,
  }) => {
    expect(await xml(page, '<plugin id="x"/>')).toBe(
      '&lt;<span class="tok-keyword">plugin</span> <span class="tok-fn">id</span>=' +
        '<span class="tok-string">"x"</span>/&gt;'
    );
    expect(await xml(page, "<name>Nigel's tests</name>")).toBe(
      '&lt;<span class="tok-keyword">name</span>&gt;Nigel\'s tests&lt;/' +
        '<span class="tok-keyword">name</span>&gt;'
    );
  });

  test('comments', async ({ page }) => {
    expect(await xml(page, '<!-- test scope -->')).toBe(
      '<span class="tok-comment">&lt;!-- test scope --&gt;</span>'
    );
  });
});

test.describe('pickHighlighter()', () => {
  const cases = [
    [{ cls: 'cli', code: 'selenide.browser=chrome' }, 'shell'],
    [{ cls: 'config', code: 'mvn test' }, 'shell'],
    [{ cls: 'config', code: './gradlew test' }, 'shell'],
    [{ cls: 'config', code: '  # selenide.properties\nselenide.timeout=6000' }, 'shell'],
    [{ cls: 'config', code: 'emulator -avd Pixel_4' }, 'shell'],
    [{ cls: 'config', code: '<dependency/>' }, 'xml'],
    [{ cls: 'config', code: '\n<project>' }, 'xml'],
    [{ cls: 'config', code: '$("#a").click();' }, 'java'],
    [{ cls: 'config', code: 'mvnHelper();' }, 'java'],
    [{ cls: 'config', code: 'gradleTask.run();' }, 'java'],
  ];
  for (const [item, expected] of cases) {
    test(`${JSON.stringify(item.code)} in "${item.cls}" uses ${expected}`, async ({ page }) => {
      expect(await page.evaluate((i) => window.pickHighlighter(i), item)).toBe(expected);
    });
  }
});

test.describe('round-trip over every entry', () => {
  test('stripping the highlighting gives back each item.code exactly (Copy invariant)', async ({
    page,
  }) => {
    const mismatches = await page.evaluate(() =>
      window.categories.flatMap((c) =>
        c.items
          .filter((item) => {
            const div = document.createElement('div');
            div.innerHTML = window.highlightFor({ ...item, cls: c.cls });
            return div.textContent !== item.code;
          })
          .map((item) => item.name)
      )
    );
    expect(mismatches).toEqual([]);
  });

  test('the modal shows the highlighted snippet with token spans', async ({ page }) => {
    await page.locator('.tile', { hasText: 'shouldHave(text())' }).click();
    await expect(page.locator('#m-code .tok-api').first()).toHaveText('$');
    await expect(page.locator('#m-code .tok-fn').first()).toHaveText('shouldHave');
  });
});
