/** @type {import('./index.js').Category} */
export default {
  cat: 'Element Conditions',
  cls: 'condition',
  color: '#f98e52',
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
      name: 'getText() and text()',
      level: 'beginner',
      platform: 'both',
      desc: 'Returns the visible text of the element as a String, trimmed. text() is the short form. For a select it returns the text of the selected option.',
      tip: 'The Javadoc marks getters as NOT RECOMMENDED for checks: they wait until the element exists, then return whatever text it has at that moment, so a value that is still loading is read too early. To check text, use shouldHave(text("...")). Use getText() when the test needs the value itself.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#getText()',
      code: `String total = $("#cart-total").getText(); // "42.50 EUR"
double amount = Double.parseDouble(total.split(" ")[0]);
$("#coupon").setValue(String.valueOf(amount / 10));
String same = $("#cart-total").text();`,
    },
    {
      name: 'shouldHave(partialText())',
      level: 'intermediate',
      platform: 'both',
      desc: 'Asserts that the element text contains the given substring, ignoring case and repeated whitespace. partialTextCaseSensitive() also compares case.',
      tip: 'text() follows Configuration.textCheck, so under FULL_TEXT it becomes a whole-text match. partialText() is always a substring match, whatever the setting. Both reject an empty string, and on a select both read the selected option text.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#partialText(java.lang.String)',
      code: `import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.TextCheck;

Configuration.textCheck = TextCheck.FULL_TEXT; // text() now compares the whole text
$("h1").shouldHave(partialText("ello Joh"));   // still a substring
$("h1").shouldHave(partialTextCaseSensitive("Hello"));`,
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
      name: 'shouldBe(interactable)',
      level: 'intermediate',
      platform: 'web',
      desc: 'interactable passes when the element is visible or is transparent, which a user can still click or type into. clickable (since 7.2.0) is interactable and enabled.',
      tip: 'A transparent element, with opacity: 0, fails shouldBe(visible) but passes interactable. A styled file input hidden behind a button is the usual case. click() already waits for clickable, so assert it only when nothing else is done with the element.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#interactable',
      code: `$("input[type=file]").shouldBe(interactable); // opacity: 0, so not visible
$("#buy").shouldBe(clickable);`,
    },
    {
      name: 'shouldBe(editable)',
      level: 'intermediate',
      platform: 'web',
      desc: 'editable passes when the element is interactable, enabled and has no readonly attribute. readonly checks for the readonly attribute alone, with any value.',
      tip: 'Use it when a form unlocks after an action, such as an Edit button. readonly looks at the HTML attribute only, not at aria-readonly or disabled, so a disabled field is not readonly.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#editable',
      code: `$("#email").shouldBe(readonly);
$("#edit-profile").click();
$("#email").shouldBe(editable);`,
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
      name: 'shouldHave(ownText())',
      level: 'intermediate',
      platform: 'web',
      desc: 'Checks only the text nodes of the element itself, leaving out the text of its child elements. ownText() is a substring match and exactOwnText() compares the whole own text; each has a CaseSensitive form.',
      tip: 'Useful for a list item that also holds a counter badge, where text() would include the count. The own text is read with JavaScript, so this is browser only. ownText() rejects an empty string: use exactOwnText("") instead.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#ownText(java.lang.String)',
      code: `// <li id="inbox">Inbox <span class="badge">3</span></li>
$("#inbox").shouldHave(exactText("Inbox 3"));
$("#inbox").shouldHave(exactOwnText("Inbox"));
$("#inbox").shouldHave(ownText("inbox"));
$("#inbox").shouldHave(ownTextCaseSensitive("Inbox"));
$("#inbox").shouldHave(exactOwnTextCaseSensitive("Inbox"));`,
    },
    {
      name: 'innerHtml() and getOwnText()',
      level: 'intermediate',
      platform: 'web',
      desc: 'innerHtml() returns the HTML of the element with its children. getOwnText() returns the text of the element without the text of its child elements.',
      tip: 'The Javadoc marks both NOT RECOMMENDED for checks. innerHtml() also works on a hidden element, where getText() returns an empty string. It is short for getAttribute("innerHTML"). To check own text, use shouldHave(ownText()) or exactOwnText() instead of the getter.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#innerHtml()',
      code: `// <li id="inbox">Inbox <span class="badge">3</span></li>
String html = $("#inbox").innerHtml(); // Inbox <span class="badge">3</span>
String own = $("#inbox").getOwnText(); // Inbox`,
    },
    {
      name: 'shouldHave(innerText())',
      level: 'advanced',
      platform: 'web',
      desc: 'Checks the text of an element that is hidden, where text() reads nothing because Selenium returns only displayed text.',
      tip: 'Despite the name, Selenide reads the textContent attribute (innerText only on Internet Explorer), so text inside display: none children counts too. Case-insensitive, and it follows Configuration.textCheck like text().',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#innerText(java.lang.String)',
      code: `// <div id="tooltip" style="display: none">Saved 3 minutes ago</div>
$("#tooltip").shouldNotBe(visible);
$("#tooltip").shouldHave(innerText("Saved"));`,
    },
    {
      name: 'shouldHave(oneOfTexts())',
      level: 'intermediate',
      platform: 'both',
      desc: 'Passes when the element text matches any one of the given texts. oneOfTexts() is a case-insensitive substring match and oneOfExactTexts() compares the whole text; each has a CaseSensitive form. Added in Selenide 7.0.3.',
      tip: 'These ignore Configuration.textCheck: the name fixes substring or whole text. An empty list throws IllegalArgumentException, and oneOfTexts() also rejects blank strings. A test that accepts two outcomes is often a sign that it should control its data better.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#oneOfTexts(java.lang.String...)',
      code: `$("#status").shouldHave(oneOfTexts("Saved", "Up to date"));
$("#status").shouldHave(oneOfExactTexts("Saved", "Up to date"));
$("#status").shouldHave(oneOfTextsCaseSensitive("OK", "DONE"));
$("#status").shouldHave(oneOfExactTextsCaseSensitive("OK", "DONE"));`,
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
      name: 'val() and getValue()',
      level: 'beginner',
      platform: 'web',
      desc: 'Return the value attribute of an input, textarea or select as a String. val() and getValue() are the same method.',
      tip: 'The Javadoc marks them NOT RECOMMENDED for checks. They return null when the element has no value attribute. val("text") with an argument is setValue("text"), not a getter. To check a value, use shouldHave(value("...")) or exactValue(), which wait for the value to change.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#val()',
      code: `String email = $("#email").val();
String same = $("#email").getValue();
$("#email-copy").setValue(email);`,
    },
    {
      name: 'shouldHave(partialValue())',
      level: 'intermediate',
      platform: 'web',
      desc: 'Asserts that the value of an input contains the given substring, ignoring case and repeated whitespace.',
      tip: 'value() follows Configuration.textCheck and becomes a whole-value match under FULL_TEXT. partialValue() is always a substring. An empty string throws: use shouldBe(empty) or exactValue("") for a cleared field.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#partialValue(java.lang.String)',
      code: `$("#iban").setValue("GB33 BUKB 2020 1555 5555 55");
$("#iban").shouldHave(partialValue("gb33"));`,
    },
    {
      name: 'shouldHave(selectedText())',
      level: 'advanced',
      platform: 'web',
      desc: 'Checks the part of a text input or textarea that is currently selected (highlighted), for example after a double-click.',
      tip: 'It reads value.substring(selectionStart, selectionEnd) with JavaScript, so it works on input and textarea, not on a select: use text() on the select for the chosen option. Case-sensitive, and a substring match under the default Configuration.textCheck.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#selectedText(java.lang.String)',
      code: `$("#title").setValue("Draft");
$("#title").doubleClick();
$("#title").shouldHave(selectedText("Draft"));`,
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
      name: 'getAttribute()',
      level: 'beginner',
      platform: 'both',
      desc: 'Returns the value of an attribute of the element as a String, or null when the attribute is missing.',
      tip: 'The Javadoc marks it NOT RECOMMENDED for checks. It waits for the element, then reads the attribute once. To check an attribute, use shouldHave(attribute("name", "value")), which retries. getAttribute() suits a value the test reuses, such as an id taken from the page.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#getAttribute(java.lang.String)',
      code: `String orderId = $("#order").getAttribute("data-id");
$("#search").setValue(orderId);
String link = $("a.help").getAttribute("href");`,
    },
    {
      name: 'shouldHave(href())',
      level: 'beginner',
      platform: 'web',
      desc: 'Checks the href of a link. Unlike attribute("href", ...), it accepts the relative URL written in the HTML.',
      tip: 'Selenium returns href as an absolute URL, so attribute("href", "/docs") fails. href() passes when the decoded URL ends with the expected value, with or without a trailing slash, so "/pricing" also matches "/en/pricing".',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#href(java.lang.String)',
      code: `// <a id="docs" href="/docs/quick-start">Docs</a>
$("#docs").shouldHave(href("/docs/quick-start"));`,
    },
    {
      name: 'id(), name(), type() and tagName()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Shortcuts for common checks: id(), name() and type() are attribute("id", ...), attribute("name", ...) and attribute("type", ...). tagName() checks the element tag.',
      tip: 'All four compare exactly, case included, and tagName() expects the tag as the browser reports it, which is lower case for HTML. Selenium also has By.id() and By.name(), but those are locators, not conditions.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#id(java.lang.String)',
      code: `$("form input").shouldHave(name("email"));
$("form input").shouldHave(type("email"));
$("label[for=email] + input").shouldHave(id("email"));
$(".btn-primary").shouldHave(tagName("button"));`,
    },
    {
      name: 'shouldHave(domAttribute())',
      level: 'advanced',
      platform: 'web',
      desc: 'domAttribute() reads an attribute as written in the HTML, and domProperty() the live JavaScript property. With one argument each checks presence, with two the value. Added in Selenide 7.4.0.',
      tip: 'attribute() uses WebElement.getAttribute(), which mixes the two. The difference shows on an input the user typed into: the value attribute still holds the initial HTML value, the value property the current one. Both compare exactly.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#domAttribute(java.lang.String,java.lang.String)',
      code: `// <input id="qty" value="1">
$("#qty").setValue("5");
$("#qty").shouldHave(domAttribute("value", "1"));
$("#qty").shouldHave(domProperty("value", "5"));
$("#menu").shouldHave(domAttribute("hidden"));`,
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
      name: 'shouldHave(pseudo())',
      level: 'advanced',
      platform: 'web',
      desc: 'Checks a computed CSS property of a pseudo-element such as ::before or ::after. With two arguments it checks the content property.',
      tip: 'Use it for required-field asterisks and CSS-only icons, which text() cannot see. The value is compared ignoring case, and content comes back with its quotes, so the expected Java string holds escaped quotes.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#pseudo(java.lang.String,java.lang.String,java.lang.String)',
      code: `$("label.required").shouldHave(pseudo("::after", "color", "rgb(220, 38, 38)"));
$("label.required").shouldHave(pseudo("::after", "\\"*\\""));`,
    },
    {
      name: 'shouldBe(empty)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Passes when an input has no value, or when another element has no text.',
      tip: 'text("") and value("") throw IllegalArgumentException under the default partial text check, because every string contains "". shouldBe(empty) is the way to assert a cleared field. CollectionCondition has an empty too, so with both imported statically write Condition.empty.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#empty',
      code: `import com.codeborne.selenide.Condition;

$("#search").clear();
$("#search").shouldBe(Condition.empty);
$("#cart-items").shouldBe(Condition.empty);`,
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
      name: 'shouldBe(focused)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Asserts that the element has keyboard focus, by comparing it with document.activeElement.',
      tip: 'Use it to test autofocus, focus traps in dialogs and Tab order. On failure the message names the element that does have focus, which makes a wrong Tab order easy to spot.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#focused',
      code: `open("/login");
$("#username").shouldBe(focused); // autofocus
$("#username").pressTab();
$("#password").shouldBe(focused);`,
    },
    {
      name: 'getFocusedElement()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Returns the element that has the keyboard focus. When no field has focus, that is the body element.',
      tip: 'The element is looked up again on each call, from document.activeElement, so it is never null and is the body when nothing has focus. To assert that a field has focus, use shouldBe(focused), which waits. getFocusedElement() helps when you do not know which field should be focused.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#getFocusedElement()',
      code: `$("#email").pressTab();
SelenideElement active = getFocusedElement();
String id = active.getAttribute("id");`,
    },
    {
      name: 'shouldBe(image)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Asserts that an img element has finished loading with a non-zero natural width, so a broken image fails.',
      tip: 'Only img elements can pass: a CSS background image or an inline svg always fails. An image with loading="lazy" is not fetched until it nears the viewport, so scroll to it first.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#image',
      code: `$("img.avatar").shouldBe(image);
$$("#gallery img").filterBy(not(image)).shouldHave(size(0)); // no broken images`,
    },
    {
      name: 'shouldNotBe(animated)',
      level: 'advanced',
      platform: 'web',
      desc: 'animated passes while the element moves or changes size between two animation frames. shouldNotBe(animated) waits until a slide-in or expand animation has finished. Added in Selenide 7.0.7.',
      tip: 'It compares getBoundingClientRect() across two requestAnimationFrame callbacks, so colour and opacity transitions do not count. In a background tab it throws IllegalStateException, because browsers pause animation frames there.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#animated',
      code: `$("#drawer-toggle").click();
$("#drawer").shouldNotBe(animated);
$("#drawer a.settings").click();`,
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
$("#submit").shouldBe(readyToSubmit);
$("#submit").shouldBe(allOf(visible, enabled)); // synonym, the name is optional`,
    },
    {
      name: 'or()',
      level: 'intermediate',
      platform: 'both',
      desc: 'Passes when at least one of the conditions passes. anyOf() is a synonym, and condition.or(other) is the instance form.',
      tip: 'The Selenide Javadoc calls an "or" check probably a flag of bad test design: a test should know which state to expect. Consider splitting it into two tests.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#or(java.lang.String,com.codeborne.selenide.WebElementCondition,com.codeborne.selenide.WebElementCondition,com.codeborne.selenide.WebElementCondition...)',
      code: `$("#result").shouldHave(or("saved or unchanged", text("Saved"), text("No changes")));
$("#result").shouldHave(anyOf(text("Saved"), text("No changes"))); // synonym, no name

// instance form
$("#result").shouldHave(text("Saved").or(text("No changes")));`,
    },
    {
      name: 'be() and have()',
      level: 'intermediate',
      platform: 'both',
      desc: 'be() and have() wrap a condition so that a should() with several conditions reads like a sentence. They change only the wording of the error message, not the check.',
      tip: 'shouldBe() and shouldHave() already add the word, so wrapping only helps with plain should(). appear is literally be(visible), and disappear is be(hidden).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#be(com.codeborne.selenide.WebElementCondition)',
      code: `$("#greeting").should(be(visible), have(text("Hello")));`,
    },
    {
      name: 'because()',
      level: 'intermediate',
      platform: 'both',
      desc: 'because("reason") attaches an explanation to a condition, shown in the error message when the check fails: in brackets after an element condition, on a Because: line for a collection condition.',
      tip: 'On an element condition because() returns a new condition. On a collection condition it stores the reason on the same object and returns it, so CollectionCondition.empty.because(...) changes the shared empty for every later check. Call it on a fresh one, such as size(0).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebElementCondition.html#because(java.lang.String)',
      code: `$("#pay").shouldBe(enabled.because("the cart has items"));
$$(".error").shouldHave(size(0).because("the form was filled in correctly"));`,
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
