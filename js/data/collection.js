/** @type {import('./index.js').Category} */
export default {
  cat: 'Collections',
  cls: 'collection',
  color: '#75ecde',
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
