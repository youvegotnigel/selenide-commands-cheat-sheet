/** @type {import('./index.js').Category} */
export default {
  cat: 'Reports & Debugging',
  cls: 'report',
  color: '#f4c43a',
  items: [
    {
      name: 'Screenshot on failure',
      level: 'beginner',
      platform: 'both',
      desc: 'When a Selenide check or command fails, Selenide saves a screenshot and the page source into Configuration.reportsFolder and appends both paths to the error message. No code is needed.',
      tip: 'Files are named <timestamp>.<counter>. Since 7.19.0 (#3469) names built from test class and method, as in Screenshots.takeScreenShot(className, methodName), get the counter too, so two screenshots in the same millisecond no longer overwrite each other. A ScreenShooterExtension (Test Frameworks) puts them in a <test class>/<method> subfolder and also covers non-Selenide failures such as assertEquals. Appium runs save the source as .xml.',
      docs: 'https://selenide.org/documentation/screenshots.html',
      code: `$("#gameWin").shouldBe(hidden);
// Element should be hidden {#gameWin}
// Element: '<img class="gameOver" id="gameWin" src="img/thumbs-up.jpeg"></img>'
// Screenshot: file:/.../build/reports/tests/1760338211523.0.png
// Page source: file:/.../build/reports/tests/1760338211523.0.html
// Timeout: 4s`,
    },
    {
      name: 'screenshot(fileName)',
      level: 'beginner',
      platform: 'both',
      desc: 'Saves a screenshot of the current page as <fileName>.png in Configuration.reportsFolder, plus the page source when savePageSource is on, and returns the URL of the PNG as a String.',
      tip: 'The PNG is written even when Configuration.screenshots is false. The name is used as given, with no timestamp, so calling it twice with the same name overwrites the file. With Configuration.reportsUrl set, the returned URL points there instead of file:. Returns null if the browser has not been started.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#screenshot(java.lang.String)',
      code: `String pngUrl = screenshot("checkout-step-2");
// build/reports/tests/checkout-step-2.png
// build/reports/tests/checkout-step-2.html (page source)`,
    },
    {
      name: 'screenshot(OutputType)',
      level: 'intermediate',
      platform: 'both',
      desc: 'Takes a screenshot of the current page and returns it in memory as bytes, a Base64 string or a temporary file. Nothing is written to reportsFolder, which suits attaching the image to your own report.',
      tip: 'No page source is saved and the image does not appear in the error message. The FILE output is a temporary file, so copy it if you need to keep it. Returns null when the browser is not started or the driver cannot take screenshots. With selenide-full-screenshot on the classpath it captures the whole page too.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#screenshot(org.openqa.selenium.OutputType)',
      code: `import org.openqa.selenium.OutputType;
import java.io.File;

byte[] png = screenshot(OutputType.BYTES);
String base64 = screenshot(OutputType.BASE64);
File temporary = screenshot(OutputType.FILE);`,
    },
    {
      name: 'screenshot() and screenshotAsImage()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Captures just one element. screenshot() saves a PNG into reportsFolder and returns the File; screenshotAsImage() returns a BufferedImage without saving anything.',
      tip: 'The element must be visible: when WebDriver refuses (for example a hidden element) both throw RuntimeException "Cannot take screenshot", although the Javadoc of screenshot() mentions null. The file is named <timestamp>.<counter>.png. For an element inside a frame use Screenshots.takeScreenShot(iframe, element).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#screenshot()',
      code: `import java.awt.image.BufferedImage;
import java.io.File;

File logo = $("#logo").screenshot();
// build/reports/tests/<timestamp>.<counter>.png

BufferedImage chart = $("#sales-chart").screenshotAsImage();
int width = chart.getWidth();`,
    },
    {
      name: 'as() and describe()',
      level: 'intermediate',
      platform: 'both',
      desc: 'as("name") gives an element or collection a readable name for error messages and reports. describe() returns the element as HTML-like text with its attributes, for logging while debugging.',
      tip: 'The alias is shown in quotes but the selector is still printed in braces, so the message stays traceable. An empty alias throws IllegalArgumentException. describe() never throws: for a missing element it returns the "not found" message instead. Page object fields can use @As (Page Objects).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#as(java.lang.String)',
      code: `import com.codeborne.selenide.SelenideElement;

SelenideElement pay = $("#checkout > button.primary").as("Pay button");
pay.shouldBe(visible);
// Element "Pay button" should be visible {#checkout > button.primary}

System.out.println($("#pay").describe());
// <button class="primary" id="pay" displayed:false></button>`,
    },
    {
      name: 'highlight() and unhighlight()',
      level: 'beginner',
      platform: 'web',
      desc: 'Paints an element (a gradient background by default) so you can see what a locator matched in the browser, a screenshot or a video. unhighlight() restores the original look.',
      tip: 'It runs JavaScript that replaces the whole style attribute and keeps the old value in data-original-style, so inline styles such as display are gone until unhighlight(). Highlighting the same element twice stores the highlight as the original, and unhighlight() can then no longer restore it.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#highlight(com.codeborne.selenide.HighlightOptions)',
      code: `import com.codeborne.selenide.HighlightOptions;

$("#pay").highlight();
$("#total").highlight(HighlightOptions.border("2px solid red"));
screenshot("pay-and-total");
$("#total").unhighlight();`,
    },
    {
      name: 'SelenideLogger.addListener()',
      level: 'advanced',
      platform: 'both',
      desc: 'Registers a LogEventListener that Selenide calls before and after every step (open, click, should and so on). This is the hook for custom reports and step logs; removeListener(name) unregisters it.',
      tip: 'Listeners are kept per thread under a name: register in the thread that runs the test, and the same name replaces the earlier listener. Exceptions thrown by a listener are logged, not rethrown. SelenideLogger.step("name", () -> ...) reports your own block as one step. TextReportExtension and SoftAssertsExtension (Test Frameworks) use this mechanism.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/logevents/SelenideLogger.html#addListener(java.lang.String,com.codeborne.selenide.logevents.LogEventListener)',
      code: `import com.codeborne.selenide.logevents.LogEvent;
import com.codeborne.selenide.logevents.LogEventListener;
import com.codeborne.selenide.logevents.SelenideLogger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;

class ConsoleSteps implements LogEventListener {
  @Override
  public void beforeEvent(LogEvent event) {
  }

  @Override
  public void afterEvent(LogEvent event) {
    System.out.printf("%s %s: %s (%d ms)%n",
      event.getElement(), event.getSubject(), event.getStatus(), event.getDuration());
  }
}

@BeforeEach
void addStepLogger() {
  SelenideLogger.addListener("console", new ConsoleSteps());
}

@AfterEach
void removeStepLogger() {
  SelenideLogger.removeListener("console");
}`,
    },
    {
      name: 'selenide-full-screenshot',
      level: 'intermediate',
      platform: 'web',
      desc: 'A plugin that makes every page screenshot capture the whole scrollable page instead of the visible viewport. Adding the dependency is all it takes.',
      tip: 'The jar registers FullSizePhotographer as a service, so failure screenshots, screenshot(name) and screenshot(OutputType) all switch over. Firefox uses its full-page screenshot, Chromium browsers a DevTools capture; anything else, or an error, falls back to a normal viewport screenshot. Element screenshots are not affected.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/fullscreenshot/FullSizePhotographer.html',
      code: `// build.gradle.kts
dependencies {
  testImplementation("com.codeborne:selenide-full-screenshot:7.19.0")
}`,
    },
    {
      name: 'selenide-video-recorder',
      level: 'advanced',
      platform: 'web',
      desc: 'Records a video of the browser window while a test runs, to debug flaky tests. The video path is added to the error message as a "Video: file:..." line.',
      tip: 'FFmpeg must be installed. The default mode is ANNOTATED, so @EnableVideo alone records nothing: mark methods with @Video, or set selenide.video.mode=ALL and opt out with @NoVideo. Only failed tests keep their video (selenide.video.save.mode=FAILED_ONLY). Settings come only from selenide.properties or -D. TestNG: @Listeners(VideoRecorderListener.class).',
      docs: 'https://github.com/selenide/selenide/blob/main/modules/video-recorder/README.md',
      code: `// build.gradle.kts: testImplementation("com.codeborne:selenide-video-recorder:7.19.0")
import org.junit.jupiter.api.Test;
import org.selenide.videorecorder.core.Video;
import org.selenide.videorecorder.junit5.EnableVideo;

@EnableVideo // same as @ExtendWith(VideoRecorderExtension.class)
class CheckoutTest {
  @Video
  @Test
  void payByCard() {
    open("/checkout");
    $("#pay").click();
  }
}
// on failure: build/reports/tests/video.<timestamp>.<counter>.mp4`,
    },
    {
      name: 'AllureSelenide (Allure report)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Allure ships a Selenide listener, AllureSelenide, in its allure-selenide module. Registered with SelenideLogger, it turns Selenide steps into Allure steps with screenshots and page sources.',
      tip: 'The class belongs to Allure, not Selenide; selenide.org asks for allure-selenide 2.21.0 or higher and shows only the screenshots() and savePageSource() switches. As with any SelenideLogger listener, register it in the test thread: if @BeforeAll runs elsewhere, move it to @BeforeEach.',
      docs: 'https://selenide.org/documentation/reports.html',
      code: `// build.gradle.kts: testImplementation("io.qameta.allure:allure-selenide:2.21.0")
// AllureSelenide is imported from that artifact
import com.codeborne.selenide.logevents.SelenideLogger;
import org.junit.jupiter.api.BeforeAll;

@BeforeAll
static void setupAllureReports() {
  SelenideLogger.addListener("AllureSelenide", new AllureSelenide()
    .screenshots(false)
    .savePageSource(true));
}`,
    },
  ],
};
