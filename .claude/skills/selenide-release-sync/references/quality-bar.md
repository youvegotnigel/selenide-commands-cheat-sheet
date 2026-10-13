# Quality bar for cheat sheet entries

`CLAUDE.md` holds the schema, which `tests/helpers/schema.js` and `data-integrity.spec.js`
enforce. This file covers the judgement calls that no test can check.

## Every claim is sourced

| Claim | Source |
|---|---|
| Method name, parameters, overloads, option and property names, return type | `.cache/sources/` (`grep -rn`) |
| Default values | The source: the field initialiser or `getProperty("selenide.x", "<default>")` in `SelenideConfig.java`, and the Javadoc comment above it |
| "Added in X.Y.Z", behaviour change, deprecation | `CHANGELOG.md` at the release tag (`npm run release:delta`) |
| Mobile setup patterns (`WebDriverProvider`, JUnit lifecycle, `selenide.properties`) | `github.com/selenide-examples/selenide-appium` and `modules/appium` in `github.com/selenide/selenide` |
| `docs` URL and anchor | The live page, via the link checker |

If a source contradicts the changelog or the docs, the sources jar wins, and the discrepancy
goes in the report under "Conflicts". Any source not listed in `SKILL.md` needs the user's
approval first.

## Writing an entry

- **name**: the identifier a user would search for, such as `shouldHave(exactText())`,
  `click(ClickOptions)` or `Configuration.timeout`. It must be globally unique and contain no
  `<` or `>` (names are rendered as HTML). To add a variant of a concept that already has an
  entry, follow the `concept (option)` pattern.
- **level**: `beginner` for the everyday path, `intermediate` for options most suites
  eventually need, `advanced` for specialised or tooling-oriented APIs.
- **platform**: `web` for browser-only, `mobile` for selenide-appium-only, `both` for
  concepts that work the same on `SelenideElement` and `SelenideAppiumElement`.
- **desc**: what it does, in one or two sentences. End new APIs with
  `Added in Selenide X.Y.Z.`
- **tip**: the non-obvious part, such as a gotcha, a default, an Android/iOS difference,
  when to prefer something else, or what it replaces. Do not restate desc.
- **code**: Java 17+, one concept, realistic. Snippets assume
  `import static com.codeborne.selenide.Selenide.*;`, `...Condition.*;` and
  `...CollectionCondition.*;`. Any other import (`AppiumBy`, `CombinedBy`,
  `AppiumClickOptions`, `Selectors`) is written inside the snippet. No class boilerplate
  unless the concept is the class (page objects, JUnit extensions, `WebDriverProvider`).
  - `selenide.properties` snippets start with a `# selenide.properties` line.
  - Maven snippets are XML starting with `<dependency>`; Gradle snippets use Kotlin DSL.
  - Shell snippets start with `mvn`, `./gradlew` or a `#` comment.
  - Inside the template literal, write `\${` for a literal `${` and double every backslash
    (Java `"\\d+"` is written `"\\\\d+"`).
- **Mobile scope**: selenide-appium's own API only. `AppiumBy` and other java-client classes
  appear only inside Selenide calls (`$(AppiumBy.accessibilityId("Login"))`) or a
  `WebDriverProvider`, never as standalone entries.
- Apply the dash ban to every field, including code comments.
- Read the snippet back as Java. The suite does not compile it.

## Placement

Put a new entry next to its closest relative in the same category file, not at the end by
default. New categories are out of scope for a sync. Propose one under follow-ups instead.

## Finding a real anchor

Javadoc pages use quoted ids. List them:

```bash
curl -sf https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html \
  | grep -oE 'id="[^"]+"' | sed -E 's/id="//; s/"$//' | sort -u
```

Method anchors are signatures with fully qualified parameter types, for example
`open(java.lang.String)`, `shouldHave(com.codeborne.selenide.WebElementCondition...)`
(varargs as `...`). Fields are bare names (`#timeout`).

GitHub README anchors are heading slugs:
`https://github.com/selenide/selenide/blob/main/modules/appium/README.md#how-to-add-dependency-to-your-project`.
The link checker finds them as `user-content-<slug>` ids in the page.

## Tests

Every expected value is hand-written from an independent source: here, the sources jar.
Never compute an expected value with the code under test, never paste current output in as
the expectation, and never assert an entry's facts by reading the same entry. Write the test
first and watch it fail before writing the entry.

Add one block per release (or per category during initial content) in
`tests/content/<cls>.spec.js`:

```js
import { test, expect } from '@playwright/test';
import { itemIn } from '../helpers/items.js';

test.describe('Selenide X.Y.Z entries', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('"<name>" exists at level <level>, platform <platform>', async ({ page }) => {
    const entry = await itemIn(page, '<Category>', '<name>');
    expect(entry).not.toBeNull();
    expect(entry.level).toBe('<level>');
    expect(entry.platform).toBe('<platform>');
    // <artifact> X.Y.Z <File>.java: <exact signature line from .cache/sources/>
    expect(entry.code).toContain('<the call that proves the entry is right>');
  });
});
```

Assert the detail that would be wrong if someone copied an older or invented answer, such
as the new method name or option. When an API is removed or a wrong name is common, add a
negative guard (`expect(entry.code).not.toContain('<old form>')`).

`categories` is the page global. Specs must not import project ESM files from `js/`.

## Report

```
New entries: <name> (<Category>, X.Y.Z): one line on what and why
Updated: <name>: what changed and which changelog item caused it
Fixed: broken docs links, stale version references, pre-existing inaccuracies
Deliberately left out: <changelog item>: reason
Conflicts: <docs or Context7 claim> vs <what the jar shows>
Wanted sources: <source>: why it would help (not used)
```
