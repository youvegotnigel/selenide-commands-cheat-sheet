/** @type {import('./index.js').Category} */
export default {
  cat: 'Selectors',
  cls: 'selector',
  color: '#3b82f6',
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
      name: '$x(xpath)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds the first element that matches an XPath expression. $$x() returns every match as a collection.',
      tip: 'Called on an element, start the expression with ./ or .// to stay inside it. An XPath that starts with // searches the whole document even from an element.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#$x(java.lang.String)',
      code: `$x("//button[@type='submit']").click();
$$x("//table[@id='users']//tr").shouldHave(size(5));
$("#users").$x(".//td[2]").shouldHave(text("Ann"));`,
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
      name: 'byTagAndText()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Finds an element with the given tag name and exact text. withTagAndText() is the substring variant.',
      tip: "Use them when the same text appears in several kinds of element, such as a heading and a button. Both are case-sensitive and, like byText(), match the element's own text nodes.",
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selectors.html#byTagAndText(java.lang.String,java.lang.String)',
      code: `import static com.codeborne.selenide.Selectors.*;

$(byTagAndText("button", "Delete")).click();
$(withTagAndText("li", "overdue")).shouldBe(visible);`,
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
      name: 'parent() and lastChild()',
      level: 'intermediate',
      platform: 'web',
      desc: 'parent() returns the direct parent of an element and lastChild() returns its last child element.',
      tip: 'Both are lazy XPath steps (.. and *[last()]), so they never fail at call time. There is no firstChild(); use find("*") or $x("./*[1]") for that.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#parent()',
      code: `$("td.price").parent().shouldHave(cssClass("selected"));
$("#steps").lastChild().shouldHave(text("Confirm"));`,
    },
    {
      name: 'closest() and ancestor()',
      level: 'intermediate',
      platform: 'web',
      desc: 'closest(selector) returns the nearest ancestor matching a tag, .class, [attribute] or [attribute=value]. ancestor(selector, index) picks one further up.',
      tip: 'closest(s) is the same as ancestor(s). Only ancestor takes an index: 0 is the nearest, 1 the next one up. The selector is not full CSS: combinators such as "div.card > form" are not supported.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#ancestor(java.lang.String,int)',
      code: `$("td.price").closest("table").shouldHave(attribute("id", "orders"));
$("#save").ancestor(".panel", 1).shouldBe(visible); // second .panel up`,
    },
    {
      name: 'sibling() and preceding()',
      level: 'intermediate',
      platform: 'web',
      desc: 'sibling(index) returns a following sibling of an element and preceding(index) returns a sibling before it.',
      tip: 'Both indexes are zero-based and count outward from the element: sibling(0) is the next sibling and preceding(0) the one directly before.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#sibling(int)',
      code: `$("td.total-label").sibling(0).shouldHave(text("42.00"));
$("#step-3").preceding(0).shouldHave(id("step-2"));`,
    },
  ],
};
