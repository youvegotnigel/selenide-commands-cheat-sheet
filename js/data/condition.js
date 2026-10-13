/** @type {import('./index.js').Category} */
export default {
  cat: 'Conditions',
  cls: 'condition',
  color: '#f97316',
  items: [
    {
      name: 'shouldHave(text())',
      level: 'beginner',
      platform: 'both',
      desc: 'Asserts the element contains the given text, retrying until Configuration.timeout runs out.',
      tip: 'text() is a case-insensitive substring match that ignores repeated whitespace. Use exactText() for an exact match. An empty string is rejected.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#text(java.lang.String)',
      code: `$("#greeting").shouldHave(text("Hello"));`,
    },
    {
      name: 'shouldBe(visible)',
      level: 'beginner',
      platform: 'both',
      desc: 'Waits until the element is displayed, as reported by WebElement.isDisplayed(). The everyday check before reading or clicking an element.',
      tip: 'An element with opacity: 0 is not visible, yet a user can still click or type into it. Use shouldBe(interactable) for such inputs. appear is a synonym that reads better after an action.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#visible',
      code: `$("#login-form").shouldBe(visible);
$("#toast").should(appear); // synonym for be(visible)`,
    },
    {
      name: 'shouldBe(hidden)',
      level: 'beginner',
      platform: 'both',
      desc: 'Waits until the element is not displayed, or is not in the DOM at all.',
      tip: 'hidden also passes when the element does not exist, so on its own it cannot prove the element is rendered but hidden. Add should(exist) for that. disappear is a synonym.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#hidden',
      code: `$("#spinner").shouldBe(hidden);
$(".modal").should(disappear); // synonym for be(hidden)`,
    },
    {
      name: 'should(exist)',
      level: 'beginner',
      platform: 'both',
      desc: 'Waits until the element is present in the DOM, visible or not. shouldNot(exist) waits until it is removed.',
      tip: 'exist ignores visibility, so an element with display: none passes. Use visible when the user has to see the element.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#exist',
      code: `$("input[name=csrf]").should(exist);
$("#deleted-row").shouldNot(exist);`,
    },
    {
      name: 'shouldBe(enabled)',
      level: 'beginner',
      platform: 'both',
      desc: 'enabled and disabled check WebElement.isEnabled(), for example on a submit button that unlocks after validation.',
      tip: 'enabled does not imply visible. clickable (since 7.2.0) means interactable and enabled, but click() already performs that check, so you rarely need to assert it first.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#enabled',
      code: `$("#submit").shouldBe(disabled);
$("#terms").click();
$("#submit").shouldBe(enabled);`,
    },
    {
      name: 'shouldHave(exactText())',
      level: 'beginner',
      platform: 'both',
      desc: 'Asserts that the whole text of the element equals the given text, not just a part of it.',
      tip: 'Still case-insensitive, and whitespace is collapsed and trimmed, so "  Order  CONFIRMED " matches. Use exactTextCaseSensitive() when case matters.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#exactText(java.lang.String)',
      code: `$("h1").shouldHave(exactText("Order confirmed"));`,
    },
    {
      name: 'shouldHave(textCaseSensitive())',
      level: 'intermediate',
      platform: 'both',
      desc: 'Case-sensitive forms of the text checks: textCaseSensitive() for a substring and exactTextCaseSensitive() for the whole text.',
      tip: 'text() and exactText() ignore case, so "ERROR" passes text("error"). The case-sensitive forms still collapse repeated whitespace.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#textCaseSensitive(java.lang.String)',
      code: `$("#status").shouldHave(textCaseSensitive("OK"));
$("#status").shouldHave(exactTextCaseSensitive("OK: 3 files uploaded"));`,
    },
    {
      name: 'shouldHave(visibleText())',
      level: 'intermediate',
      platform: 'web',
      desc: 'Checks the text as it is rendered, leaving out characters clipped by overflow: hidden or replaced by a text-overflow: ellipsis on the element or its ancestors. exactVisibleText() is the whole-text form. Added in Selenide 7.19.0.',
      tip: 'text() reads the DOM text, so a label cut off on screen still passes it. Text that is only scrolled out of the viewport still counts as visible, and a select uses the full selected option text. Measured with JavaScript, so browser only.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#visibleText(java.lang.String)',
      code: `// .title has width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap
$(".title").shouldHave(text("Wireless Headphones"));        // full DOM text passes
$(".title").shouldHave(visibleText("Wireless"));            // the part on screen
$(".title").shouldNotHave(visibleText("Headphones"));       // clipped away

$("#badge").shouldHave(exactVisibleText("Paid"));`,
    },
    {
      name: 'shouldHave(matchText())',
      level: 'intermediate',
      platform: 'both',
      desc: 'Asserts that the element text matches a Java regular expression.',
      tip: 'With the default Configuration.textCheck the regex can match any part of the text (it is wrapped in .*regex.* with DOTALL), so no leading .* is needed. Unlike text(), the match is case-sensitive.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#matchText(java.lang.String)',
      code: `$("#order").shouldHave(matchText("Order #\\\\d{6} confirmed"));`,
    },
    {
      name: 'shouldHave(value())',
      level: 'beginner',
      platform: 'web',
      desc: 'Checks the value of an input, textarea or select. value() is a partial match, exactValue() requires the whole value.',
      tip: 'value() ignores case, collapses whitespace and, with the default Configuration.textCheck, matches a substring. exactValue() is attribute("value", ...), so it is exact and case-sensitive.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#value(java.lang.String)',
      code: `$("#email").setValue("ada@example.com");
$("#email").shouldHave(value("example.com"));
$("#email").shouldHave(exactValue("ada@example.com"));`,
    },
    {
      name: 'shouldHave(attribute())',
      level: 'beginner',
      platform: 'both',
      desc: 'attribute(name) checks that the attribute is present with any value. attribute(name, value) checks its value.',
      tip: 'The value comparison is exact and case-sensitive, with no whitespace trimming. Use attributeMatching(name, regex) for a pattern, and href() for links, because Selenium returns href as an absolute URL.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#attribute(java.lang.String,java.lang.String)',
      code: `$("#save").shouldHave(attribute("data-loading"));
$("#save").shouldHave(attribute("aria-pressed", "true"));
$("#ticket").shouldHave(attributeMatching("data-id", "T-\\\\d+"));`,
    },
    {
      name: 'shouldHave(cssClass())',
      level: 'beginner',
      platform: 'web',
      desc: 'Asserts that the class attribute contains the given class. Other classes may be present too.',
      tip: 'It compares whole class names, so cssClass("btn") does not match an element whose only class is "btn-primary". Pass one class per call.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#cssClass(java.lang.String)',
      code: `$("#tab-settings").shouldHave(cssClass("active"));
$("#tab-profile").shouldNotHave(cssClass("active"));`,
    },
    {
      name: 'shouldHave(cssValue())',
      level: 'intermediate',
      platform: 'web',
      desc: 'Checks a computed CSS property of the element, as returned by WebElement.getCssValue().',
      tip: 'The browser reports computed values, so colors come back as rgba(...) and lengths in px. Case is ignored. A property that is not set returns "", so assert against an empty string.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#cssValue(java.lang.String,java.lang.String)',
      code: `$(".error").shouldHave(cssValue("color", "rgba(220, 38, 38, 1)"));
$("#sidebar").shouldHave(cssValue("display", "none"));`,
    },
    {
      name: 'shouldBe(empty)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Passes when an input has no value, or when another element has no text.',
      tip: 'text("") and value("") throw IllegalArgumentException under the default partial text check, because every string contains "". shouldBe(empty) is the way to assert a cleared field.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#empty',
      code: `$("#search").clear();
$("#search").shouldBe(empty);
$("#cart-items").shouldBe(empty);`,
    },
    {
      name: 'shouldBe(checked)',
      level: 'beginner',
      platform: 'web',
      desc: 'checked asserts that a checkbox or radio button is ticked. selected does the same for an option of a select. Both read WebElement.isSelected().',
      tip: 'Use shouldNotBe(checked) for an unticked box. To check which option a select shows, shouldHave(text(...)) on the select itself reads the selected option text.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#checked',
      code: `$("#remember-me").click();
$("#remember-me").shouldBe(checked);
$("#newsletter").shouldNotBe(checked);
$("#country option[value=NZ]").shouldBe(selected);`,
    },
    {
      name: 'shouldNotHave(text())',
      level: 'beginner',
      platform: 'both',
      desc: 'shouldNot, shouldNotHave and shouldNotBe wait until the element stops matching the condition. They are synonyms, so pick the one that reads best.',
      tip: 'For visible and exist a missing element counts as a pass, so shouldNotBe(visible) also passes once the element is gone. For text and attribute conditions the element must exist, otherwise the check fails with ElementNotFound.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#shouldNotHave(com.codeborne.selenide.WebElementCondition...)',
      code: `$("#status").shouldNotHave(text("Error"));
$("#save").shouldNotBe(disabled);
$("#banner").shouldNot(exist);`,
    },
    {
      name: 'not()',
      level: 'intermediate',
      platform: 'both',
      desc: 'Negates a condition so that it can be passed where a WebElementCondition is expected, for example inside and().',
      tip: 'On an element, prefer shouldNot(condition). not() is for composing. It follows the same rule as shouldNot, so not(visible) also passes for a missing element.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#not(com.codeborne.selenide.WebElementCondition)',
      code: `import com.codeborne.selenide.WebElementCondition;

WebElementCondition validInput = and("valid input", editable, not(cssClass("error")));
$("#email").shouldBe(validInput);`,
    },
    {
      name: 'and()',
      level: 'intermediate',
      platform: 'both',
      desc: 'Combines two or more conditions into one named condition that passes only when all of them pass. allOf() is a synonym, with or without a name.',
      tip: 'The name is required and comes first: it is what the error message shows. For a one-off check, shouldBe(visible, enabled) with several arguments is simpler.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#and(java.lang.String,com.codeborne.selenide.WebElementCondition,com.codeborne.selenide.WebElementCondition,com.codeborne.selenide.WebElementCondition...)',
      code: `import com.codeborne.selenide.WebElementCondition;

WebElementCondition readyToSubmit = and("ready to submit", visible, enabled, cssClass("primary"));
$("#submit").shouldBe(readyToSubmit);`,
    },
    {
      name: 'or()',
      level: 'intermediate',
      platform: 'both',
      desc: 'Passes when at least one of the conditions passes. anyOf() is a synonym, and condition.or(other) is the instance form.',
      tip: 'The Selenide Javadoc calls an "or" check probably a flag of bad test design: a test should know which state to expect. Consider splitting it into two tests.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#or(java.lang.String,com.codeborne.selenide.WebElementCondition,com.codeborne.selenide.WebElementCondition,com.codeborne.selenide.WebElementCondition...)',
      code: `$("#result").shouldHave(or("saved or unchanged", text("Saved"), text("No changes")));

// instance form
$("#result").shouldHave(text("Saved").or(text("No changes")));`,
    },
    {
      name: 'should(match())',
      level: 'intermediate',
      platform: 'both',
      desc: 'Builds a one-off condition from a description and a Predicate on the WebElement, without writing a class.',
      tip: 'The predicate is retried until the timeout, so keep it free of side effects. The error shows only the description, not the actual value. Subclass WebElementCondition when the report needs the actual value.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#match(java.lang.String,java.util.function.Predicate)',
      code: `$("#avatar").should(match("wider than 100px", el -> el.getSize().getWidth() > 100));`,
    },
    {
      name: 'Custom WebElementCondition',
      level: 'advanced',
      platform: 'both',
      desc: 'A reusable condition is a subclass of WebElementCondition that implements check(Driver, WebElement) and returns a CheckResult with the verdict and the actual value.',
      tip: 'Condition is a final class of static factories in Selenide 7.19.0, so older examples that write new Condition(...) { ... } do not compile. The actual value given to CheckResult is printed in the error message.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebElementCondition.html#check(com.codeborne.selenide.Driver,org.openqa.selenium.WebElement)',
      code: `import com.codeborne.selenide.CheckResult;
import com.codeborne.selenide.Driver;
import com.codeborne.selenide.WebElementCondition;
import org.openqa.selenium.WebElement;

public class TextOfLength extends WebElementCondition {
  private final int length;

  public TextOfLength(int length) {
    super("text of length " + length);
    this.length = length;
  }

  @Override
  public CheckResult check(Driver driver, WebElement element) {
    String text = element.getText();
    return new CheckResult(text.length() == length, text);
  }
}

// usage
$("#otp-code").shouldHave(new TextOfLength(6));`,
    },
    {
      name: 'should(condition, Duration)',
      level: 'intermediate',
      platform: 'both',
      desc: 'Every should* method has an overload that takes one condition and a Duration, which replaces Configuration.timeout for that check only.',
      tip: 'The Duration overload takes a single condition. The varargs form, such as shouldBe(visible, enabled), always uses the global timeout. Raise the timeout for the one slow element, not for the whole suite.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#shouldBe(com.codeborne.selenide.WebElementCondition,java.time.Duration)',
      code: `import java.time.Duration;

$("#report-ready").shouldBe(visible, Duration.ofSeconds(30));
$("#progress").shouldNotBe(visible, Duration.ofMinutes(2));`,
    },
  ],
};
