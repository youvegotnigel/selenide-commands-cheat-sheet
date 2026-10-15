/** @type {import('./index.js').Category} */
export default {
  cat: 'Waits & Timeouts',
  cls: 'wait',
  color: '#feb671',
  items: [
    {
      name: 'Implicit waits (should and actions)',
      level: 'beginner',
      platform: 'both',
      desc: 'Selenide has no separate wait step. Every should* method and every action such as click() or setValue() retries until Configuration.timeout runs out (4000 ms by default), trying again every Configuration.pollingInterval (200 ms by default).',
      tip: 'Actions wait for a usable element, not just a present one: click() waits until the element is clickable (visible or opacity: 0, and enabled), setValue() until it is editable. Some errors stop the retry at once, such as an invalid selector, a JavascriptException or a lost browser session.',
      docs: 'https://selenide.org/documentation.html',
      code: `$("#query").setValue("selenide"); // waits until the input is editable
$("#search").click();              // waits until the button is clickable
$("#results").shouldHave(text("selenide")); // retries until the text appears`,
    },
    {
      name: 'Wait for a loader to disappear',
      level: 'beginner',
      platform: 'both',
      desc: 'To wait out a spinner or overlay, assert that it is hidden, with a longer Duration when the work is slow. shouldNot(exist) is the stricter form for a loader that is removed from the DOM.',
      tip: 'hidden also passes when the element does not exist, so a check right after the click can pass before the loader has even appeared. Checking visible first closes that gap only if the loader stays up longer than the polling interval, so the result itself is the most reliable signal.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#disappear',
      code: `import java.time.Duration;

$("#search").click();
$(".loader").shouldBe(visible);                        // the search has started
$(".loader").shouldBe(hidden, Duration.ofSeconds(30)); // and finished
$$(".result").shouldHave(sizeGreaterThan(0));`,
    },
    {
      name: 'is(condition) and has(condition)',
      level: 'intermediate',
      platform: 'both',
      desc: 'Return true or false at once, without waiting and without failing the test. Use them to branch, for example to dismiss a cookie banner only when it is shown.',
      tip: 'A missing element is not an error: is(visible) returns false and is(hidden) returns true. The Javadoc marks both methods as not recommended for checks, because a check that never waits makes flaky tests. Assert with should* instead.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#is(com.codeborne.selenide.WebElementCondition)',
      code: `if ($("#cookie-banner").is(visible)) {
  $("#cookie-banner .accept").click();
}
boolean premium = $("#plan").has(text("Premium"));`,
    },
    {
      name: 'is(condition, Duration)',
      level: 'advanced',
      platform: 'both',
      desc: 'Polls the condition every Configuration.pollingInterval for up to the given Duration, then returns false instead of failing. has(condition, Duration) is the same method.',
      tip: 'Every false answer costs the full Duration, so a popup that rarely shows adds that delay to almost every test. Added in 7.1.0 and labelled not recommended in its own Javadoc: prefer making the popup predictable in test setup.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#is(com.codeborne.selenide.WebElementCondition,java.time.Duration)',
      code: `import java.time.Duration;

if ($("#survey-popup").is(visible, Duration.ofSeconds(3))) {
  $("#survey-popup .close").click();
}`,
    },
    {
      name: 'sleep(milliseconds)',
      level: 'intermediate',
      platform: 'both',
      desc: 'Selenide.sleep() pauses the test for at least the given number of milliseconds. Unlike Thread.sleep(), it keeps sleeping until the full time has passed and throws no checked InterruptedException.',
      tip: 'A fixed pause is too short on a slow CI machine and wasted time on a fast one. Wait for something observable instead, such as a should* on an element or webdriver().shouldHave(). Keep sleep() for a known delay with nothing to observe, such as a debounce, and comment why.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#sleep(long)',
      code: `// Avoid: guesses how long the save takes
$("#save").click();
sleep(2000);
$("#status").shouldHave(text("Saved"));

// Prefer: waits only as long as needed
$("#save").click();
$("#status").shouldHave(text("Saved"));`,
    },
    {
      name: 'webdriver().shouldHave(condition, Duration)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Waits for a browser-level condition from WebDriverConditions, such as numberOfWindows(), title() or cookie(), with its own timeout. shouldNotHave() waits until the condition is no longer true.',
      tip: 'This shouldHave() comes from the Conditional interface, which localStorage(), sessionStorage() and clipboard() implement too, so they wait the same way. Without a Duration it uses Configuration.timeout.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Conditional.html#shouldHave(com.codeborne.selenide.ObjectCondition,java.time.Duration)',
      code: `import static com.codeborne.selenide.WebDriverConditions.cookie;
import static com.codeborne.selenide.WebDriverConditions.numberOfWindows;
import java.time.Duration;

$("#open-report").click();
webdriver().shouldHave(numberOfWindows(2), Duration.ofSeconds(15));
webdriver().shouldHave(cookie("session_id"), Duration.ofSeconds(10));`,
    },
    {
      name: 'Wait() (SelenideWait)',
      level: 'advanced',
      platform: 'both',
      desc: 'Wait() returns a SelenideWait, a Selenium FluentWait of WebDriver preset with Configuration.timeout and Configuration.pollingInterval. Use it with until() for conditions Selenide does not offer.',
      tip: 'On timeout it throws Selenium TimeoutException rather than a Selenide assertion error, and SelenideWait does no Selenide logging, so the wait is missing from the Selenide report. Try a should* method or webdriver().shouldHave() first.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#Wait()',
      code: `import com.codeborne.selenide.SelenideWait;
import org.openqa.selenium.Alert;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

SelenideWait wait = Wait(); // FluentWait<WebDriver> with Selenide timeout and polling
Alert alert = wait.until(ExpectedConditions.alertIsPresent());

Wait().withTimeout(Duration.ofSeconds(20))
    .until(driver -> Boolean.TRUE.equals(executeJavaScript("return window.appReady")));`,
    },
  ],
};
