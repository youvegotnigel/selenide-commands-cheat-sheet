/** @type {import('./index.js').Category} */
export default {
  cat: 'Collection Conditions',
  cls: 'collection-condition',
  color: '#fca25f',
  items: [
    {
      name: 'shouldHave(size())',
      level: 'beginner',
      platform: 'both',
      desc: 'Waits until the collection has exactly the given number of elements. empty is the predefined size(0).',
      tip: 'size(0) and empty also pass when the search itself fails, for example because the parent element is missing, since zero matches is what was asked for. Check the container with should(exist) first if that matters. Condition and CollectionCondition both define empty, so with both imported statically a bare empty does not compile: qualify it.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/CollectionCondition.html#size(int)',
      code: `import com.codeborne.selenide.CollectionCondition;

$$(".cart-item").shouldHave(size(3));
$$(".error").shouldBe(CollectionCondition.empty); // same as size(0)`,
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
$$("#results li").shouldHave(sizeLessThan(51));
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
      tip: 'All three fail on an empty collection, so noneMatch() cannot assert "no errors". Use filterBy(visible).shouldHave(size(0)) for that. Prefer a built-in condition where one exists: it gives a clearer error.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/CollectionCondition.html#allMatch(java.lang.String,java.util.function.Predicate)',
      code: `$$(".price").should(allMatch("has a currency", el -> el.getText().startsWith("EUR")));
$$(".row").should(anyMatch("is selected", el -> el.isSelected()));
$$(".field").should(noneMatch("is marked invalid", el -> "true".equals(el.getAttribute("aria-invalid"))));`,
    },
    {
      name: 'should(collectionCondition, Duration)',
      level: 'intermediate',
      platform: 'both',
      desc: 'should, shouldBe and shouldHave on a collection each have an overload that takes one collection condition and a Duration, which replaces Configuration.timeout for that check only.',
      tip: 'As on an element, the Duration overload takes a single condition, and the varargs form always uses the global timeout. Raise the timeout for the one slow list, such as search results, not for the whole suite.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/BaseElementsCollection.html#shouldHave(com.codeborne.selenide.WebElementsCondition,java.time.Duration)',
      code: `import java.time.Duration;

$$("#results li").shouldHave(sizeGreaterThan(0), Duration.ofSeconds(30));
$$(".job.running").shouldHave(size(0), Duration.ofMinutes(2));`,
    },
    {
      name: 'Custom WebElementsCondition',
      level: 'advanced',
      platform: 'both',
      desc: 'A reusable collection condition is a subclass of WebElementsCondition that overrides check(Driver, List) to judge all the found elements at once, and toString() to name the expectation.',
      tip: 'toString() is abstract, so the class does not compile without it. Its result is printed as Expected in the error, and the actual value given to CheckResult as Actual. CollectionCondition is only the class of static factories, not a base class.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebElementsCondition.html#check(com.codeborne.selenide.Driver,java.util.List)',
      code: `import com.codeborne.selenide.CheckResult;
import com.codeborne.selenide.Driver;
import com.codeborne.selenide.WebElementsCondition;
import java.util.List;
import org.openqa.selenium.WebElement;

public class SortedTexts extends WebElementsCondition {
  @Override
  public CheckResult check(Driver driver, List<WebElement> elements) {
    List<String> texts = elements.stream().map(WebElement::getText).toList();
    List<String> sorted = texts.stream().sorted().toList();
    return new CheckResult(!texts.isEmpty() && texts.equals(sorted), texts);
  }

  @Override
  public String toString() {
    return "texts in alphabetical order";
  }
}

// usage
$$("#products .name").should(new SortedTexts());`,
    },
  ],
};
