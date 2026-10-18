/** @type {import('./index.js').Category} */
export default {
  cat: 'Selectors',
  cls: 'selector',
  color: '#3bcddc',
  items: [
    {
      name: '$(css)',
      level: 'beginner',
      platform: 'web',
      desc: 'Finds the first element on the page that matches a CSS selector and returns a SelenideElement.',
      tip: 'The lookup is lazy: nothing touches the browser until you call an action or a should* check, so you can store the result in a field before the page has loaded. $ also accepts any Selenium By, such as $(byText("Save")).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#$(java.lang.String)',
      code: `SelenideElement email = $("#login input[name='email']");
email.setValue("ann@example.com");`,
    },
    {
      name: '$(css, index)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds the Nth element on the page that matches a CSS selector.',
      tip: 'The index is zero-based, so $("li", 1) is the second item. A By overload exists too: $(byText("Edit"), 2).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#$(java.lang.String,int)',
      code: `$("#todo li", 1).shouldHave(text("Buy milk")); // second li`,
    },
    {
      name: '$$(css)',
      level: 'beginner',
      platform: 'web',
      desc: 'Finds every element that matches a CSS selector and returns an ElementsCollection.',
      tip: 'An empty match is not an error: the collection is lazy and is only searched when you check or read it. Assert with shouldHave(size(n)) so the check waits, rather than reading size() once.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#$$(java.lang.String)',
      code: `$$("#results .item").shouldHave(size(3));
$$("#results .item").first().shouldHave(text("Selenide"));`,
    },
    {
      name: '$(By)',
      level: 'beginner',
      platform: 'web',
      desc: 'Finds elements with a Selenium By locator instead of a CSS string. $$(By) returns every match as a collection.',
      tip: 'Any Selectors helper returns a By, so $(byText("Save")) reads like the CSS form. A $(By, index) overload picks the Nth match.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#$(org.openqa.selenium.By)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(byText("Sign in")).click();
$$(byClassName("error")).shouldHave(size(0));`,
    },
    {
      name: '$x(xpath)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds the first element that matches an XPath expression.',
      tip: 'Called on an element, start the expression with ./ or .// to stay inside it. An XPath that starts with // searches the whole document even from an element.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#$x(java.lang.String)',
      code: `$x("//button[@type='submit']").click();
$("#users").$x(".//td[2]").shouldHave(text("Ann"));`,
    },
    {
      name: '$$x(xpath)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds every element that matches an XPath expression and returns an ElementsCollection.',
      tip: 'Lazy like $$(): an empty match is not an error until you check or read it, so assert with shouldHave(size(n)). Called on an element, start with ./ or .// to stay inside it, because a // path searches the whole document.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#$$x(java.lang.String)',
      code: `$$x("//table[@id='users']//tr").shouldHave(size(5));
$("#users").$$x(".//td").shouldHave(size(15));`,
    },
    {
      name: 'byText()',
      level: 'beginner',
      platform: 'web',
      desc: 'Web selector that finds an element whose whole text equals the given string.',
      tip: 'Exact and case-sensitive, but it compares one of the element\'s own text nodes, not its full text: a link reading "Hello" plus a bold "world" is not found by byText("Hello world"). Use withText() for a substring and byTextCaseInsensitive() to ignore case.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byText(java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.byText;

$(byText("Sign in")).click();`,
    },
    {
      name: 'byTextCaseInsensitive()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Same as byText(), but the case of the text is ignored.',
      tip: 'It still matches the whole text, not a substring. Use withTextCaseInsensitive() for a substring.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byTextCaseInsensitive(java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(byTextCaseInsensitive("sign in")).click();`,
    },
    {
      name: 'withText()',
      level: 'beginner',
      platform: 'web',
      desc: 'Web selector that finds an element whose text contains the given substring.',
      tip: "Like byText(), it looks at the element's own text nodes, so it returns the element that directly holds the text, not its wrappers. It is case-sensitive; withTextCaseInsensitive() ignores case.",
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#withText(java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.withText;

$(withText("items in your cart")).shouldBe(visible);`,
    },
    {
      name: 'withTextCaseInsensitive()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Same as withText(), but the case of the text is ignored.',
      tip: 'It matches a substring. Use byTextCaseInsensitive() when the whole text is known.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#withTextCaseInsensitive(java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(withTextCaseInsensitive("welcome")).shouldBe(visible);`,
    },
    {
      name: 'byTagAndText()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds an element with the given tag name and exact text.',
      tip: "Use it when the same text appears in several kinds of element, such as a heading and a button. It is case-sensitive and, like byText(), matches the element's own text nodes. withTagAndText() is the substring variant.",
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byTagAndText(java.lang.String,java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(byTagAndText("button", "Delete")).click();`,
    },
    {
      name: 'withTagAndText()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds an element with the given tag name whose text contains the given substring.',
      tip: "Like withText(), it is case-sensitive and matches the element's own text nodes. Use byTagAndText() when the whole text is known.",
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#withTagAndText(java.lang.String,java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(withTagAndText("li", "overdue")).shouldBe(visible);`,
    },
    {
      name: 'byLinkText()',
      level: 'beginner',
      platform: 'web',
      desc: 'Finds a link by its whole visible text.',
      tip: 'It wraps By.linkText(), so it matches anchor elements only, and the text is case-sensitive. byXpath(), byCssSelector(), byClassName() and byTagName() are wrappers of the same kind.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byLinkText(java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(byLinkText("Sign in")).click();`,
    },
    {
      name: 'byPartialLinkText()',
      level: 'beginner',
      platform: 'web',
      desc: 'Finds a link by part of its visible text.',
      tip: 'It wraps By.partialLinkText(), so it matches anchor elements only whose text contains the given text, and the text is case-sensitive. Use byLinkText() when the whole text is known.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byPartialLinkText(java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(byPartialLinkText("Terms")).click();`,
    },
    {
      name: 'byAttribute()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds an element whose attribute has the given value. It builds the CSS selector [name="value"] for you.',
      tip: 'Append a CSS operator to the attribute name for partial matches: "href*" contains, "href^" starts with, "href$" ends with, "class~" has the word. byTitle(), byValue() and the 7.12.0 byPlaceholder() and byAltText() are shortcuts for common attributes.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byAttribute(java.lang.String,java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(byAttribute("data-state", "open")).shouldBe(visible);
$(byAttribute("href*", "/invoices/")).click();`,
    },
    {
      name: 'byPlaceholder()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds an input by its placeholder attribute. Added in Selenide 7.12.0.',
      tip: 'The whole value must match. An overload takes TextMatchOptions, such as partialText().caseInsensitive(), for a substring or case-insensitive match.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byPlaceholder(java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(byPlaceholder("Search")).setValue("selenide").pressEnter();`,
    },
    {
      name: 'byTitle()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds an element by its title attribute.',
      tip: 'Handy for icon buttons that have no text. A 7.12.0 overload takes TextMatchOptions for a partial or case-insensitive match.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byTitle(java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(byTitle("Close")).click();`,
    },
    {
      name: 'byAltText()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds an element by its alt attribute, such as an image. Added in Selenide 7.12.0.',
      tip: 'The whole value must match. An overload takes TextMatchOptions for a partial or case-insensitive match.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byAltText(java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(byAltText("Company logo")).shouldBe(visible);`,
    },
    {
      name: 'byId()',
      level: 'beginner',
      platform: 'web',
      desc: 'Selectors offers static shortcuts for the plain Selenium locators: byId, byName, byClassName, byTagName, byXpath, byLinkText and byCssSelector.',
      tip: 'Each one just returns the matching Selenium By (byId("x") is By.id("x")), so they read better with a static import but find nothing new. For id and class, a CSS string in $() is usually shorter.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byId(java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(byId("username")).setValue("ann");
$(byName("password")).setValue("secret");
$$(byClassName("error")).shouldHave(size(0));`,
    },
    {
      name: 'byTestId()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds an element by its test id attribute, the stable hook a front end adds for tests. Available since Selenide 7.12.0.',
      tip: 'The attribute is data-test-id by default. If your app uses data-testid, set selenide.test-id.attribute=data-testid in selenide.properties or pass -Dselenide.test-id.attribute=data-testid.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byTestId(java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.byTestId;

$(byTestId("checkout-button")).click();`,
    },
    {
      name: 'byLabel()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds the form field that belongs to a label with the given text. The text must match the whole label, unless a TextMatchOptions is passed.',
      tip: "It follows the label: the element whose id equals the label's for attribute, or else the input, select or textarea inside the label. TextMatchOptions.partialText() matches part of the label text. Qualify it, because Condition has its own partialText(String).",
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byLabel(java.lang.String,com.codeborne.selenide.TextMatchOptions)',
      code: `import com.codeborne.selenide.TextMatchOptions;
import static com.codeborne.selenide.Selectors.byLabel;

$(byLabel("Email")).setValue("ada@example.com");
$(byLabel("Pass", TextMatchOptions.partialText())).setValue("secret");`,
    },
    {
      name: 'byRole()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds an element by its ARIA role, optionally with its accessible name. Available since Selenide 7.17.0.',
      tip: 'It matches both an explicit role attribute and common implicit roles, such as button for a button tag and heading for h1 to h6. The name is matched as full text by default; pass TextMatchOptions as a third argument to change that.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byRole(java.lang.String,java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.byRole;

$(byRole("button", "Save changes")).click();
$$(byRole("checkbox")).shouldHave(size(3));`,
    },
    {
      name: 'shadowCss()',
      level: 'advanced',
      platform: 'web',
      desc: 'Finds an element inside open shadow roots by giving the target CSS selector and then the chain of shadow hosts that lead to it.',
      tip: 'The target comes first and the hosts follow from the outermost inwards. Every host in the chain must have an open shadow root; a closed one throws. If you do not know the path, use shadowDeepCss().',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#shadowCss(java.lang.String,java.lang.String...)',
      code: `import static com.codeborne.selenide.Selectors.shadowCss;

// target, then outer host, then inner host
$(shadowCss("button.submit", "#app-shell", "login-form")).click();`,
    },
    {
      name: 'shadowDeepCss()',
      level: 'advanced',
      platform: 'web',
      desc: 'Finds an element by CSS through any number of nested open shadow roots, without naming the hosts.',
      tip: 'Convenient when the component tree changes, but it walks every open shadow root on the page, so it can match an element in an unrelated component. Prefer shadowCss() when the host chain is stable.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#shadowDeepCss(java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.shadowDeepCss;

$(shadowDeepCss("#app-shell login-form button.submit")).click();`,
    },
    {
      name: 'find() (inside an element)',
      level: 'beginner',
      platform: 'web',
      desc: 'Finds the first matching element inside another element. element.$(css) is the same call.',
      tip: 'Chained lookups stay lazy and are re-resolved on every retry, so a stale parent is not a problem. Overloads take a By and an index: find(byText("Edit"), 1).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#find(java.lang.String)',
      code: `SelenideElement form = $("#signup");
form.find("input[name='email']").setValue("ann@example.com");
form.$("button[type='submit']").click(); // same as find()`,
    },
    {
      name: 'findAll() (inside an element)',
      level: 'beginner',
      platform: 'web',
      desc: 'Finds every matching element inside another element and returns an ElementsCollection. element.$$(css) is the same call.',
      tip: 'Scope a collection to its container instead of writing one long page-wide selector. The container is found again on each check, so the collection survives a re-render.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#findAll(java.lang.String)',
      code: `$("#cart").findAll("tr.item").shouldHave(size(2));
$("#cart").$$("tr.item").first().shouldHave(text("Book"));`,
    },
    {
      name: 'parent()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Returns the direct parent of an element, such as the tr above a td.',
      tip: 'Lazy: it is the XPath step .. and is only resolved when you act on it, so the call itself never fails. Chain it to climb more than one level.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#parent()',
      code: `$("td.price").parent().shouldHave(cssClass("selected"));`,
    },
    {
      name: 'lastChild()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Returns the last child element of an element, such as the last td of a tr.',
      tip: 'Lazy, the XPath step *[last()]. There is no firstChild(); use find("*") or $x("./*[1]") for that.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#lastChild()',
      code: `$("#steps").lastChild().shouldHave(text("Confirm"));`,
    },
    {
      name: 'closest()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Returns the nearest ancestor matching a tag, .class, [attribute] or [attribute=value].',
      tip: 'Same as ancestor(selector) and has no index overload. The selector is not full CSS: combinators such as "div.card > form" are not supported.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#closest(java.lang.String)',
      code: `$("td.price").closest("table").shouldHave(attribute("id", "orders"));`,
    },
    {
      name: 'ancestor()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Returns an ancestor matching a tag, .class, [attribute] or [attribute=value]. ancestor(selector) is the nearest, ancestor(selector, index) picks one further up.',
      tip: 'The index is zero-based: 0 is the nearest match, 1 the next one up. ancestor(selector) is the same as closest(selector). The selector is not full CSS.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#ancestor(java.lang.String,int)',
      code: `$("#save").ancestor(".panel", 1).shouldBe(visible); // second .panel up`,
    },
    {
      name: 'sibling()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Returns a following sibling of an element, counted from the element outwards.',
      tip: 'The index is zero-based: sibling(0) is the next sibling. Use preceding() for the siblings before the element.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#sibling(int)',
      code: `$("td.total-label").sibling(0).shouldHave(text("42.00"));`,
    },
    {
      name: 'preceding()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Returns a sibling that comes before an element, counted from the element backwards.',
      tip: 'The index is zero-based: preceding(0) is the sibling directly before. Use sibling() for the ones after.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#preceding(int)',
      code: `$("#step-3").preceding(0).shouldHave(id("step-2"));`,
    },
  ],
};
