/** @type {import('./index.js').Category} */
export default {
  cat: 'Windows, Frames, Alerts',
  cls: 'window',
  color: '#84d987',
  items: [
    {
      name: 'switchTo().window(index)',
      level: 'beginner',
      platform: 'web',
      desc: 'Switches to a window or tab by its position, waiting until a window with that index exists. The usual way to follow a link that opens a new tab.',
      tip: 'The index is 0-based and follows the order of getWindowHandles(), which the Javadoc warns can differ between browsers. Because it waits, switchTo().window(1) right after the click is enough. The Duration overload replaces Configuration.timeout for this switch only.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideTargetLocator.html#window(int)',
      code: `import java.time.Duration;

$("a[target=_blank]").click();
switchTo().window(1); // 0 is the first tab
$("h1").shouldHave(text("Help"));
switchTo().window(0);

// a slow popup: wait longer than Configuration.timeout
switchTo().window(1, Duration.ofSeconds(20));`,
    },
    {
      name: 'switchTo().window(nameOrHandleOrTitle)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Switches to a window by its name or handle, falling back to its title, and waits until such a window appears.',
      tip: 'The title fallback is an exact, case-sensitive match, and it works by switching into each window in turn, so a failed lookup leaves you in some other window. Save the handle of the main window first so you can return to it reliably.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideTargetLocator.html#window(java.lang.String)',
      code: `import static com.codeborne.selenide.WebDriverRunner.getWebDriver;

String main = getWebDriver().getWindowHandle();
$("#open-report").click();
switchTo().window("Monthly report"); // name, handle or exact title
$("table.report").shouldBe(visible);
switchTo().window(main);`,
    },
    {
      name: 'webdriver().shouldHave(numberOfWindows())',
      level: 'intermediate',
      platform: 'web',
      desc: 'Asserts how many windows and tabs the browser has open, retrying until Configuration.timeout runs out.',
      tip: 'Use it after closeWindow() to prove the tab really closed. To prove a link did not open a tab it is weak: numberOfWindows(1) passes at once, before a late tab could appear. A Duration overload, shouldHave(condition, timeout), also exists.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverConditions.html#numberOfWindows(int)',
      code: `import static com.codeborne.selenide.WebDriverConditions.numberOfWindows;

$("a[target=_blank]").click();
webdriver().shouldHave(numberOfWindows(2));
switchTo().window(1);
closeWindow();
switchTo().window(0);
webdriver().shouldHave(numberOfWindows(1));`,
    },
    {
      name: 'switchTo().frame()',
      level: 'beginner',
      platform: 'web',
      desc: 'Switches into a frame or iframe by name or id, by index, or by element, waiting until the frame is available. Every $() call after it searches inside that frame.',
      tip: 'The frame index is 0-based and the Javadoc warns the order can differ between browsers, so prefer a name, id or element. The name/id and index forms have Duration overloads. frame(WebElement) has none and always waits up to Configuration.timeout.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideTargetLocator.html#frame(java.lang.String)',
      code: `switchTo().frame("payment"); // name or id
$("#card-number").setValue("4242 4242 4242 4242");
switchTo().defaultContent();

switchTo().frame($("iframe.captcha")); // element
$("#checkbox").click();
switchTo().defaultContent();`,
    },
    {
      name: 'switchTo().innerFrame()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Switches into a nested frame by a path of frame names or ids, from the outermost frame to the innermost.',
      tip: 'It always starts from defaultContent(), so the path is absolute no matter which frame you are in, unlike frame(). Each step matches only the id or name attribute of a frame or iframe, never an index or element. It takes at least one name and returns void.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideTargetLocator.html#innerFrame(java.lang.String,java.lang.String...)',
      code: `// top page > iframe#editor > iframe[name=preview]
switchTo().innerFrame("editor", "preview");
$("h1").shouldHave(text("Preview"));
switchTo().defaultContent();`,
    },
    {
      name: 'parentFrame() and defaultContent()',
      level: 'beginner',
      platform: 'web',
      desc: 'switchTo().parentFrame() moves up one frame level. switchTo().defaultContent() returns to the top page from any depth.',
      tip: 'Selenide never leaves a frame on its own. A $() call on the top page while you are still inside a frame fails with ElementNotFound, so switch back as soon as the frame work is done.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideTargetLocator.html#defaultContent()',
      code: `switchTo().frame("editor");
switchTo().frame("toolbar");
$("#bold").click();
switchTo().parentFrame(); // back in "editor"
$("#body").setValue("Hello");
switchTo().defaultContent(); // back on the top page
$("#save").click();`,
    },
    {
      name: 'confirm()',
      level: 'beginner',
      platform: 'web',
      desc: 'Waits for a JavaScript alert or confirm dialog, clicks OK and returns the dialog text. confirm(text) also checks the text.',
      tip: 'The dialog is accepted before the text is compared, so on a DialogTextMismatch the dialog is already closed and the action it guarded has run. The comparison is exact and case-sensitive, unlike the text() condition.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#confirm(java.lang.String)',
      code: `$("#delete").click();
confirm("Delete 3 files?"); // clicks OK, then checks the exact text

$("#reset").click();
String message = confirm(); // any text, returned for logging or your own checks
$("#status").shouldHave(text("Settings reset"));`,
    },
    {
      name: 'dismiss()',
      level: 'beginner',
      platform: 'web',
      desc: 'Waits for a JavaScript confirm or prompt dialog, clicks Cancel and returns the dialog text. dismiss(text) also checks the text.',
      tip: 'Like confirm(), it closes the dialog first and compares the text afterwards, exactly and case-sensitively. There is no dismiss(text, Duration): for a custom timeout pass ModalOptions.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#dismiss(java.lang.String)',
      code: `$("#delete-account").click();
dismiss("Delete your account permanently?");
$("#profile").shouldBe(visible);`,
    },
    {
      name: 'prompt()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Waits for a JavaScript prompt dialog, optionally types into it, clicks OK and returns the dialog text.',
      tip: 'The one-argument prompt(text) is the input to type, not the expected dialog text. To check the text as well, use prompt(expectedText, inputText). prompt() with no input accepts the default value.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#prompt(java.lang.String,java.lang.String)',
      code: `$("#rename").click();
prompt("Enter a new name", "Quarterly.pdf"); // checks the text, types, clicks OK

$("#nickname").click();
prompt("Alice"); // types "Alice" only, no text check`,
    },
    {
      name: 'ModalOptions',
      level: 'intermediate',
      platform: 'web',
      desc: 'Combines an expected dialog text with a timeout for confirm(), dismiss() and prompt(), which otherwise wait up to Configuration.timeout for the dialog.',
      tip: 'withExpectedText() and withTimeout() are the starting points, and .timeout() adds a timeout to an expected text. For anything these helpers do not cover, switchTo().alert() waits for the dialog and returns the Selenium Alert without closing it.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/ModalOptions.html',
      code: `import java.time.Duration;
import static com.codeborne.selenide.ModalOptions.withExpectedText;
import static com.codeborne.selenide.ModalOptions.withTimeout;

$("#export").click();
confirm(withExpectedText("Export finished").timeout(Duration.ofSeconds(30)));

$("#slow-cancel").click();
dismiss(withTimeout(Duration.ofSeconds(10)));`,
    },
  ],
};
