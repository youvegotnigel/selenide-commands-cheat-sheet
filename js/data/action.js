/** @type {import('./index.js').Category} */
export default {
  cat: 'Actions',
  cls: 'action',
  color: '#3ec87d',
  items: [
    {
      name: 'click()',
      level: 'beginner',
      platform: 'web',
      desc: 'Clicks the element after waiting until it is interactable and enabled.',
      tip: 'click() returns void because it overrides WebElement.click(), so it cannot start a chain. click(ClickOptions) returns the element. Configuration.clickViaJs = true turns every plain click into a JavaScript click.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#click()',
      code: `$("button[type=submit]").click();
$(".flash").shouldHave(text("Saved"));`,
    },
    {
      name: 'click(ClickOptions)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Clicks with options: a JavaScript click, an offset from the centre of the element, keys held down during the click, or a forced click.',
      tip: 'The static factories are using(), usingDefaultMethod(), usingJavaScript(), withOffset() and withTimeout(). force(), holdingKeys() and offset() are instance methods chained onto one of them. force() skips the clickable check. withTimeout(d) replaces Configuration.timeout for this click and is also applied as the pageLoadTimeout while it runs, which helps for links that open slow pages.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/ClickOptions.html',
      code: `import static com.codeborne.selenide.ClickOptions.*;
import org.openqa.selenium.Keys;

$("#menu").click(usingJavaScript());
$("#canvas").click(withOffset(30, -10)); // relative to the centre
$("#row-3").click(usingDefaultMethod().holdingKeys(Keys.SHIFT));
$("#half-covered").click(usingDefaultMethod().force());`,
    },
    {
      name: 'doubleClick()',
      level: 'beginner',
      platform: 'web',
      desc: 'Double-clicks the element after waiting until it is interactable and enabled.',
      tip: 'Unlike click(), it returns the element, so it chains. doubleClick(ClickOptions) takes the same options as click, for example doubleClick(usingJavaScript()).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#doubleClick()',
      code: `$(".cell").doubleClick().shouldHave(cssClass("editing"));`,
    },
    {
      name: 'contextClick()',
      level: 'beginner',
      platform: 'web',
      desc: 'Right-clicks the element through Selenium Actions to open its context menu.',
      tip: 'There is no ClickOptions overload, so it is always a native right click. Only an HTML context menu drawn by the page can be asserted: the browser menu is outside the DOM.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#contextClick()',
      code: `$("#file-row").contextClick();
$(".context-menu").shouldBe(visible);`,
    },
    {
      name: 'hover()',
      level: 'beginner',
      platform: 'web',
      desc: 'Moves the mouse over the element without clicking, so hover menus and tooltips appear.',
      tip: 'Assert the revealed element with shouldBe(visible) rather than reading it straight away: hover menus often fade in. hover(HoverOptions.withOffset(x, y)) moves to a point away from the centre.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#hover()',
      code: `$("#account").hover();
$("#account-menu").shouldBe(visible);`,
    },
    {
      name: 'setValue()',
      level: 'beginner',
      platform: 'web',
      desc: 'Replaces the content of an input or textarea: clears it, then sends the text. val(text) is the same command.',
      tip: 'setValue("") clears the field and blurs it. With Configuration.fastSetValue = true the value is set by JavaScript, which is faster but skips real key events. Use type() for fields that react to each key, and append() to keep the existing text.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#setValue(java.lang.String)',
      code: `$("#email").setValue("santa@claus.fi");
$("#city").val("Helsinki"); // same as setValue`,
    },
    {
      name: 'setValue(SetValueOptions)',
      level: 'intermediate',
      platform: 'web',
      desc: 'setValue with options: date, time and datetime-local values, a choice of sendKeys or JavaScript, or a value masked in reports.',
      tip: 'withDate(), withDateTime() and withTime() set the value by JavaScript in the ISO format the input expects, which avoids locale-specific typing into native pickers. sensitive() masks the value in reports and logs, so use it for passwords.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SetValueOptions.html',
      code: `import static com.codeborne.selenide.SetValueOptions.withDate;
import static com.codeborne.selenide.SetValueOptions.withText;
import java.time.LocalDate;

$("#birthday").setValue(withDate(LocalDate.of(1990, 12, 24)));
$("#password").setValue(withText("s3cret").sensitive());`,
    },
    {
      name: 'append()',
      level: 'beginner',
      platform: 'web',
      desc: 'Sends the text to an input or textarea without clearing what is already there.',
      tip: 'Use it for prefilled fields where setValue() would wipe the existing text. Do not write clear() then append(): setValue() does both in one call.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#append(java.lang.String)',
      code: `$("#notes").append(" (updated)");
$("#notes").shouldHave(value("Call back (updated)"));`,
    },
    {
      name: 'clear()',
      level: 'beginner',
      platform: 'web',
      desc: 'Empties an input or textarea, then blurs it so change and blur handlers run.',
      tip: 'It returns void, so it ends a chain. Underneath it calls WebElement.clear(), which some React and Vue inputs ignore. Add the selenide-clear-with-shortcut module for those.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#clear()',
      code: `$("#search").clear();
$("#search").shouldHave(exactValue(""));`,
    },
    {
      name: 'selenide-clear-with-shortcut',
      level: 'advanced',
      platform: 'web',
      desc: 'An optional module that makes clear() also select all text and press Delete, for framework inputs that ignore WebElement.clear().',
      tip: 'It registers itself through ServiceLoader, so there is nothing to configure, and setValue() and type() use it too because they clear through the same command. The shortcut key (Cmd or Ctrl) comes from navigator.platform of the browser, not the OS running the tests. Without JavaScript it falls back to a plain clear.',
      docs: 'https://github.com/selenide/selenide/tree/v7.19.0/modules/clear-with-shortcut',
      code: `// build.gradle.kts: testImplementation("com.codeborne:selenide-clear-with-shortcut:7.19.0")
// No code change: the module replaces the built-in clear command.
$("#react-input").clear();
$("#react-input").setValue("new value"); // also clears with the shortcut`,
    },
    {
      name: 'type(TypeOptions)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Types text one character at a time like a user, for autocomplete fields that react to each key. type(text) uses the default options.',
      tip: 'Defaults: 200 ms between characters and the field is cleared first. withDelay() changes the pace, clearFirst(false) keeps existing text and sensitive() masks the text in reports. It is much slower than setValue(), so keep it for fields where key events matter.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/TypeOptions.html',
      code: `import com.codeborne.selenide.TypeOptions;
import java.time.Duration;

$("#city").type("Hel");
$("#city").type(TypeOptions.text("sinki").withDelay(Duration.ofMillis(50)).clearFirst(false));
$$(".suggestion").first().shouldHave(text("Helsinki"));`,
    },
    {
      name: 'pressEnter()',
      level: 'beginner',
      platform: 'web',
      desc: 'pressEnter(), pressTab() and pressEscape() send that key to the element and return it for chaining.',
      tip: 'Each checks that the element is displayed first. pressTab() moves focus to the next field, so blur and change fire on the one you leave. To blur without moving focus, use unfocus().',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#pressEnter()',
      code: `$("#query").setValue("selenide").pressEnter();
$("#email").setValue("santa@claus.fi").pressTab();
$(".modal input").pressEscape();`,
    },
    {
      name: 'press()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Sends any keys, including Selenium Keys and chords, to the element and returns it for chaining.',
      tip: 'Unlike sendKeys(), it checks that the element is displayed and it chains. For a select-all shortcut, macOS browsers need Keys.COMMAND, not Keys.CONTROL.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#press(java.lang.CharSequence...)',
      code: `import org.openqa.selenium.Keys;

$("#list").press(Keys.ARROW_DOWN, Keys.ARROW_DOWN).press(Keys.ENTER);
$("#editor").press(Keys.chord(Keys.CONTROL, "a"));`,
    },
    {
      name: 'unfocus()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Removes focus from the element by calling blur() on it in JavaScript, which triggers blur-driven validation.',
      tip: 'Unlike pressTab(), focus does not land on another field, so no focus handler elsewhere runs. In a browser it needs JavaScript; selenide-appium has its own implementation for native apps.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#unfocus()',
      code: `$("#iban").setValue("FI00 1234").unfocus();
$("#iban-error").shouldHave(text("Invalid IBAN"));`,
    },
    {
      name: 'selectOption()',
      level: 'beginner',
      platform: 'web',
      desc: 'Selects an option of a select element by its exact visible text or by 0-based index. selectOptionByValue() selects by the value attribute.',
      tip: 'They return void. Text must equal the whole option text: use selectOptionContainingText() for a substring. Extra arguments select several options in a multiple select, and a disabled option throws. Custom dropdowns that are not a real select need click().',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#selectOption(java.lang.String,java.lang.String...)',
      code: `$("#country").selectOption("Finland");
$("#country").selectOption(0); // first option
$("#country").selectOptionByValue("fi");
$("#country").getSelectedOption().shouldHave(text("Finland"));`,
    },
    {
      name: 'getSelectedOptionText() and getSelectedOptionValue()',
      level: 'beginner',
      platform: 'web',
      desc: 'Read the selected option of a select element: its visible text, or its value attribute.',
      tip: 'getSelectedOptionText() returns null when no option is selected and throws IllegalArgumentException when the element is not a select. getSelectedOptionValue() returns null when the option has no value attribute. To check a selection, use getSelectedOption().shouldHave(text("...")), which waits.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#getSelectedOptionText()',
      code: `String country = $("#country").getSelectedOptionText(); // "Finland"
String code = $("#country").getSelectedOptionValue();   // "fi"`,
    },
    {
      name: 'getOptions() and getSelectedOptions()',
      level: 'intermediate',
      platform: 'web',
      desc: 'getOptions() returns all option elements of a select as an ElementsCollection. getSelectedOptions() returns only the selected ones, and is empty when nothing is selected.',
      tip: 'Both return a lazy collection, so collection conditions wait and retry. getSelectedOptions() is the way to read a multiple select, where getSelectedOption() returns one option only.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#getOptions()',
      code: `$("#country").getOptions().shouldHave(size(3));
$("#country").getOptions().shouldHave(texts("Finland", "Sweden", "Norway"));
$("#interests").getSelectedOptions().shouldHave(exactTexts("Music", "Sport"));`,
    },
    {
      name: 'selectRadio()',
      level: 'beginner',
      platform: 'web',
      desc: 'Clicks the radio button with the given value among all elements the selector matches, and returns that radio.',
      tip: 'Call it on a selector that matches the whole group, such as By.name(), not on a single radio. It throws ElementNotFound when no radio has that value, and fails on a readonly radio.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#selectRadio(java.lang.String)',
      code: `import org.openqa.selenium.By;

$(By.name("delivery")).selectRadio("express").shouldBe(selected);`,
    },
    {
      name: 'getSelectedRadio()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Returns the checked radio button of a group as a SelenideElement, found by the By locator of the whole group.',
      tip: 'It is a static method of Selenide, not of an element. It returns null when nothing is selected, so check for null before you chain a call on the result. To assert a choice, check the radio you expect: $("input[name=plan][value=pro]").shouldBe(checked).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#getSelectedRadio(org.openqa.selenium.By)',
      code: `import static com.codeborne.selenide.Selectors.byName;

SelenideElement plan = getSelectedRadio(byName("plan"));
if (plan != null) {
  plan.shouldHave(value("pro"));
}`,
    },
    {
      name: 'setSelected()',
      level: 'beginner',
      platform: 'web',
      desc: 'Sets a checkbox, radio or option to checked (true) or unchecked (false), clicking only when the state differs.',
      tip: 'Prefer it to click() on checkboxes: a click toggles, so a test that starts from an unknown state ends up wrong. It fails on invisible, readonly or disabled elements, so a styled checkbox that hides its input needs a click on the label.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#setSelected(boolean)',
      code: `$("#terms").setSelected(true).shouldBe(checked);
$("#newsletter").setSelected(false);`,
    },
    {
      name: 'dragAndDrop(DragAndDropOptions)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Drags this element onto a target given as a CSS selector or an element, built with DragAndDropOptions.to().',
      tip: 'The default is a JavaScript simulation of HTML5 drag events. Switch to usingSeleniumActions() for libraries that listen to mouse events instead. It waits for the target to become visible. The pre-7.0 dragAndDropTo() no longer exists.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/DragAndDropOptions.html',
      code: `import static com.codeborne.selenide.DragAndDropOptions.to;

$("#card-1").dragAndDrop(to("#done-column"));
$("#slider-handle").dragAndDrop(to($("#slider-end")).usingSeleniumActions());`,
    },
    {
      name: 'actions()',
      level: 'advanced',
      platform: 'web',
      desc: 'Returns a Selenium Actions builder for gestures that Selenide has no method for, such as key chords or a multi-step pointer path.',
      tip: 'Nothing happens until the chain ends with perform(). Pass SelenideElement objects wherever Actions wants a WebElement. The chain does not retry, so wait for the elements first with shouldBe(visible).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#actions()',
      code: `import org.openqa.selenium.Keys;

actions()
  .keyDown(Keys.SHIFT)
  .click($("#row-1"))
  .click($("#row-5"))
  .keyUp(Keys.SHIFT)
  .perform();`,
    },
    {
      name: 'scrollIntoView(ScrollIntoViewOptions)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Scrolls the element into view with typed options for behavior and for vertical (block) and horizontal (inline) alignment.',
      tip: 'instant() starts as block start and inline nearest; chain block() and inline() to change them. The Javadoc recommends it over scrollIntoView(boolean) and scrollIntoView(String).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#scrollIntoView(com.codeborne.selenide.ScrollIntoViewOptions)',
      code: `import static com.codeborne.selenide.ScrollIntoViewOptions.instant;
import static com.codeborne.selenide.ScrollIntoViewOptions.Block.center;
import static com.codeborne.selenide.ScrollIntoViewOptions.Inline.end;

$(".logo").scrollIntoView(instant().block(center).inline(end));`,
    },
    {
      name: 'scrollIntoCenter()',
      level: 'beginner',
      platform: 'web',
      desc: 'Scrolls the element vertically to the centre of the viewport, instantly.',
      tip: 'Prefer it to scrollTo(), which scrolls the window so the element sits at the top edge, where a sticky header can cover it. Neither is usually needed before click(), which brings the element into view itself.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#scrollIntoCenter()',
      code: `$("#comments").scrollIntoCenter().shouldBe(visible);
$("footer").scrollTo(); // aligns to the top of the window`,
    },
  ],
};
