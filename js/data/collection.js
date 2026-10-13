/** @type {import('./index.js').Category} */
export default {
  cat: 'Collections',
  cls: 'collection',
  color: '#eab308',
  items: [
    {
      name: 'ElementsCollection (lazy)',
      level: 'beginner',
      platform: 'both',
      desc: 'An ElementsCollection is a lazy query, not a list of found elements. Every check, filter and element lookup re-runs the search, so a collection kept in a field never goes stale.',
      tip: 'On mobile, SelenideAppium.$$(By) returns a SelenideAppiumCollection, which extends ElementsCollection, so every collection condition works there too. The getters size() and texts() read once and never wait: assert with shouldHave() instead.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/ElementsCollection.html',
      code: `import com.codeborne.selenide.ElementsCollection;
import com.codeborne.selenide.appium.SelenideAppium;
import com.codeborne.selenide.appium.SelenideAppiumCollection;
import io.appium.java_client.AppiumBy;

ElementsCollection rows = $$("#orders tr"); // nothing is searched yet
$("#load-more").click();
rows.shouldHave(size(20)); // searched again on every check

// Mobile: same API, elements are SelenideAppiumElement
SelenideAppiumCollection items = SelenideAppium.$$(AppiumBy.className("android.widget.TextView"));
items.shouldHave(sizeGreaterThan(0));`,
    },
    {
      name: 'shouldHave(size())',
      level: 'beginner',
      platform: 'both',
      desc: 'Waits until the collection has exactly the given number of elements. empty is the predefined size(0).',
      tip: 'size(0) and empty also pass when the search itself fails, for example because the parent element is missing, since zero matches is what was asked for. Check the container with should(exist) first if that matters.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/CollectionCondition.html#size(int)',
      code: `$$(".cart-item").shouldHave(size(3));
$$(".error").shouldBe(empty); // same as size(0)`,
    },
    {
      name: 'shouldHave(sizeGreaterThan())',
      level: 'intermediate',
      platform: 'both',
      desc: 'Waits until the collection size compares as asked: sizeGreaterThan, sizeGreaterThanOrEqual, sizeLessThan, sizeLessThanOrEqual or sizeNotEqual.',
      tip: 'sizeLessThan(n) and sizeLessThanOrEqual(n) pass at once while the list is still empty, because zero is less than n. Wait for the list to load (sizeGreaterThan(0) or a loaded marker) before an upper-bound check.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/CollectionCondition.html#sizeGreaterThan(int)',
      code: `$$("#results li").shouldHave(sizeGreaterThan(0));
$$("#results li").shouldHave(sizeGreaterThanOrEqual(10));
$$("#results li").shouldHave(sizeLessThanOrEqual(50));
$$(".tab").shouldHave(sizeNotEqual(4));`,
    },
    {
      name: 'shouldHave(texts())',
      level: 'beginner',
      platform: 'both',
      desc: 'Asserts that the collection has as many elements as expected texts and that each element, in order, matches its text. Also takes a List.',
      tip: 'Matching follows Configuration.textCheck. The default, PARTIAL_TEXT, is a case-insensitive substring per element; FULL_TEXT compares the whole text, still ignoring case. Extra elements fail the check, so use containExactTextsCaseSensitive() for a subset.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/CollectionCondition.html#texts(java.lang.String...)',
      code: `$$("#menu li").shouldHave(texts("Home", "Docs", "Blog"));
// With the default PARTIAL_TEXT this also passes for
// [Home page, docs, Blog archive]`,
    },
    {
      name: 'shouldHave(exactTexts())',
      level: 'beginner',
      platform: 'both',
      desc: 'Asserts the collection has exactly these texts, element by element and in order, comparing the whole text of each element. exactTextsCaseSensitive() adds case.',
      tip: 'exactTexts() ignores case and collapses repeated whitespace, so "docs" equals "Docs". Use exactTextsCaseSensitive() when capitalisation is part of the requirement. Both fail on a size mismatch.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/CollectionCondition.html#exactTexts(java.lang.String...)',
      code: `$$("#menu li").shouldHave(exactTexts("Home", "Docs", "Blog"));
$$("#menu li").shouldHave(exactTextsCaseSensitive("Home", "Docs", "Blog"));`,
    },
    {
      name: 'shouldHave(textsInAnyOrder())',
      level: 'intermediate',
      platform: 'both',
      desc: 'Asserts the collection has these texts in any order. exactTextsCaseSensitiveInAnyOrder() is the strict variant: whole text and case-sensitive.',
      tip: 'The size must match, but each expected text is searched independently, so ("A", "A") passes against [A, B]. textsInAnyOrder() follows Configuration.textCheck, so by default it is a case-insensitive substring match.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/CollectionCondition.html#textsInAnyOrder(java.lang.String...)',
      code: `$$(".tag").shouldHave(textsInAnyOrder("selenide", "java", "testing"));
$$(".tag").shouldHave(exactTextsCaseSensitiveInAnyOrder("Selenide", "Java", "Testing"));`,
    },
    {
      name: 'shouldHave(itemWithText())',
      level: 'intermediate',
      platform: 'both',
      desc: 'Waits until at least one element of the collection has the given text.',
      tip: 'Unlike text(), this is an exact, case-sensitive match on the whole element text: "Order shipped" does not match "Order shipped today". To act on the element, use findBy(text(...)) instead.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/CollectionCondition.html#itemWithText(java.lang.String)',
      code: `$$("#notifications li").shouldHave(itemWithText("Order shipped"));`,
    },
    {
      name: 'should(containExactTextsCaseSensitive())',
      level: 'intermediate',
      platform: 'both',
      desc: 'Asserts that the collection contains elements with all the given texts, ignoring order and any extra elements.',
      tip: 'Each expected text must equal a whole element text, case included. A text listed twice needs two matching elements. This is the condition to use for a subset; texts() and exactTexts() fail on extra elements.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/CollectionCondition.html#containExactTextsCaseSensitive(java.lang.String...)',
      code: `// The page shows [Tom, John, Dick, Harry]
$$("li.user").should(containExactTextsCaseSensitive("Tom", "Dick", "Harry"));`,
    },
    {
      name: 'shouldHave(attributes())',
      level: 'intermediate',
      platform: 'both',
      desc: 'Asserts the value of one attribute on every element, in order. The number of values must equal the collection size.',
      tip: 'Values are compared with Objects.equals: exact and case-sensitive, and an element without the attribute counts as null. The getter $$.attributes(name) returns the values once without waiting, for logging rather than asserting.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/CollectionCondition.html#attributes(java.lang.String,java.lang.String...)',
      code: `$$("#steps li").shouldHave(attributes("data-state", "done", "done", "pending"));`,
    },
    {
      name: 'should(allMatch())',
      level: 'advanced',
      platform: 'both',
      desc: 'allMatch(), anyMatch() and noneMatch() check every element against a Predicate on the raw WebElement. The description string appears in the error message.',
      tip: 'allMatch() and noneMatch() fail on an empty collection, so noneMatch() cannot assert "no errors". Use filterBy(visible).shouldBe(empty) for that. Prefer a built-in condition where one exists: it gives a clearer error.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/CollectionCondition.html#allMatch(java.lang.String,java.util.function.Predicate)',
      code: `$$(".price").should(allMatch("has a currency", el -> el.getText().startsWith("EUR")));
$$(".row").should(anyMatch("is selected", el -> el.isSelected()));
$$(".field").should(noneMatch("is marked invalid", el -> "true".equals(el.getAttribute("aria-invalid"))));`,
    },
    {
      name: 'filterBy()',
      level: 'beginner',
      platform: 'both',
      desc: 'Returns a lazy sub-collection of the elements that match an element condition. filter() is the same method.',
      tip: 'The filter is applied again on every check, so filterBy(visible).shouldHave(size(2)) waits for the right elements. It takes a condition such as cssClass() or not(), never a lambda: wrap a predicate in match(). Each element is checked one by one, which is slow on long lists.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/BaseElementsCollection.html#filterBy(com.codeborne.selenide.WebElementCondition)',
      code: `$$("#todo li").filterBy(cssClass("completed")).shouldHave(size(2));
$$("#todo li").filter(visible).first().click(); // filter() is an alias`,
    },
    {
      name: 'excludeWith()',
      level: 'intermediate',
      platform: 'both',
      desc: 'Returns a lazy sub-collection without the elements that match a condition. exclude() is the same method.',
      tip: 'excludeWith(c) is filterBy(not(c)). It removes elements, it does not assert anything, so follow it with a shouldHave() check.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/BaseElementsCollection.html#excludeWith(com.codeborne.selenide.WebElementCondition)',
      code: `$$("#todo li").excludeWith(cssClass("completed")).shouldHave(size(3));
$$("#todo li").exclude(cssClass("completed")).first().shouldHave(text("Buy milk"));`,
    },
    {
      name: 'findBy()',
      level: 'beginner',
      platform: 'both',
      desc: 'Returns the first element of the collection that matches a condition, as a lazy SelenideElement. find() is the same method.',
      tip: 'Nothing is searched until you act or assert, and that call waits for a match. text() is a substring, so findBy(text("Al")) also picks "Alice": use exactText() when rows share a prefix.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/BaseElementsCollection.html#findBy(com.codeborne.selenide.WebElementCondition)',
      code: `$$("#users tr").findBy(exactText("Alice Smith")).$(".delete").click();
$$("#users tr").find(attribute("data-role", "admin")).shouldBe(visible);`,
    },
    {
      name: 'get(), first() and last()',
      level: 'beginner',
      platform: 'both',
      desc: 'get(index) (zero-based), first() and last() return one lazy element. first(n) and last(n) return a lazy sub-collection.',
      tip: '$(css) is faster than $$(css).first() and returns the same element. An index that is out of range is not an error until you use the element, which then waits and fails with ElementNotFound.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/BaseElementsCollection.html#get(int)',
      code: `$$("#results li").get(2).shouldHave(text("Third"));
$$("#results li").last().shouldBe(visible);
$$("#results li").first(3).shouldHave(texts("One", "Two", "Three"));
$$("#pages a").last(2).shouldHave(texts("9", "10"));`,
    },
    {
      name: 'asDynamicIterable() and asFixedIterable()',
      level: 'advanced',
      platform: 'both',
      desc: 'Choose how a for loop iterates a collection. asFixedIterable() takes one snapshot of the elements; asDynamicIterable() reloads them at each step.',
      tip: 'A plain for-each, iterator() or stream() uses the fixed snapshot: fast, but it can throw StaleElementReferenceException if the list re-renders. Use asDynamicIterable() for a live list. Better still, replace the loop with one collection condition.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/BaseElementsCollection.html#asDynamicIterable()',
      code: `import com.codeborne.selenide.SelenideElement;

for (SelenideElement row : $$("#orders tr").asDynamicIterable()) {
  row.$(".status").shouldHave(text("Paid"));
}

for (SelenideElement link : $$("nav a").asFixedIterable()) {
  System.out.println(link.getAttribute("href"));
}`,
    },
  ],
};
