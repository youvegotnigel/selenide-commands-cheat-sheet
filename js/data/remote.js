/** @type {import('./index.js').Category} */
export default {
  cat: 'Remote & Grid',
  cls: 'remote',
  color: '#8ad1ff',
  items: [
    {
      name: 'Selenium Grid',
      level: 'intermediate',
      platform: 'web',
      desc: 'Runs the browser on a Selenium Grid node instead of the test machine. Point Configuration.remote at the hub and describe the browser with Configuration.browser and browserCapabilities.',
      tip: 'Selenide builds the same capabilities as for a local browser and sends them to the hub. It sets a LocalFileDetector, so uploadFile() sends local files to the node, and augments the driver, so Chromium nodes answer to HasDevTools. Credentials in the URL are sent as basic auth and masked in logs. Remote timeouts are Configuration.remoteConnectionTimeout and remoteReadTimeout. FOLDER and CDP downloads need the selenide-grid plugin.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#remote',
      code: `import com.codeborne.selenide.Configuration;
import org.openqa.selenium.chrome.ChromeOptions;

// or -Dselenide.remote=http://grid.example.com:4444/wd/hub
Configuration.remote = "http://user:secret@grid.example.com:4444/wd/hub";
Configuration.browser = "chrome";
Configuration.browserCapabilities = new ChromeOptions().setPlatformName("linux");

open("/login"); // the browser starts on a Grid node`,
    },
    {
      name: 'selenide-grid',
      level: 'intermediate',
      platform: 'web',
      desc: 'Plugin that makes the FOLDER and CDP download modes work on Selenium Grid: after the click it copies the file from the node through the Grid managed downloads API.',
      tip: 'There is nothing to call: Selenide finds it with ServiceLoader and keeps the normal behaviour for a local browser. The node must have managed downloads on (Selenide tests start Grid with --enable-managed-downloads true) and the session must request ENABLE_DOWNLOADS. Each download first deletes the files already downloaded in that session. Clipboard is not supported. Add only one of selenide-grid, selenide-moon and selenide-selenoid: Selenide uses the first plugin it finds.',
      docs: 'https://github.com/selenide/selenide/blob/main/modules/grid/README.md',
      code: `// build.gradle.kts: testImplementation("com.codeborne:selenide-grid:7.19.0")
import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.FileDownloadMode;
import java.io.File;
import static org.openqa.selenium.remote.CapabilityType.ENABLE_DOWNLOADS;

Configuration.remote = "http://grid.example.com:4444/wd/hub";
Configuration.browserCapabilities.setCapability(ENABLE_DOWNLOADS, true);
Configuration.fileDownload = FileDownloadMode.FOLDER; // or CDP

File report = $("#export").download(); // copied from the node to Configuration.downloadsFolder`,
    },
    {
      name: 'selenide-selenoid',
      level: 'intermediate',
      platform: 'web',
      desc: 'Plugin for Selenoid: FOLDER and CDP downloads fetch the file from the browser container, and clipboard() reads and writes the container clipboard.',
      tip: 'Its README marks it deprecated because Selenoid is no longer maintained; prefer selenide-moon or selenide-grid (the 7.19.0 classes carry no @Deprecated). It strips "/wd/hub" from Configuration.remote to reach the Selenoid file API and passes URL credentials as basic auth. Selenoid reports no file modification times, so withIncrementTimeout cannot fail fast and a missing file waits the full timeout.',
      docs: 'https://github.com/selenide/selenide/blob/main/modules/selenoid/README.md',
      code: `// build.gradle.kts: testImplementation("com.codeborne:selenide-selenoid:7.19.0")
import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.FileDownloadMode;
import java.util.Map;
import org.openqa.selenium.chrome.ChromeOptions;

ChromeOptions options = new ChromeOptions();
options.setCapability("selenoid:options", Map.of("enableVNC", true, "enableVideo", true));

Configuration.remote = "http://selenoid.example.com:4444/wd/hub";
Configuration.browser = "chrome";
Configuration.browserCapabilities = options;
Configuration.fileDownload = FileDownloadMode.FOLDER;`,
    },
    {
      name: 'selenide-moon',
      level: 'intermediate',
      platform: 'web',
      desc: 'Plugin for Aerokube Moon: FOLDER and CDP downloads fetch the file from the browser pod, and clipboard() works on the remote browser.',
      tip: 'Without a plugin, clipboard() on a remote browser without DevTools throws IllegalStateException ("Please use remote clipboard"), and FOLDER downloads fail because the files stay in the pod. Moon settings go under "moon:options", not "selenoid:options". Moon reports no file modification times, so withIncrementTimeout cannot fail fast. URL credentials are passed as basic auth.',
      docs: 'https://github.com/selenide/selenide/blob/main/modules/moon/README.md',
      code: `// build.gradle.kts: testImplementation("com.codeborne:selenide-moon:7.19.0")
import com.codeborne.selenide.Configuration;
import java.util.Map;
import org.openqa.selenium.chrome.ChromeOptions;
import static com.codeborne.selenide.ClipboardConditions.content;

ChromeOptions options = new ChromeOptions();
options.setCapability("moon:options", Map.of("enableVNC", true, "enableVideo", true));
Configuration.remote = "http://moon.example.com/wd/hub";
Configuration.browserCapabilities = options;

open("/editor");
clipboard().setText("Moonlight Shadow");
clipboard().shouldHave(content("Moonlight Shadow"));`,
    },
    {
      name: 'DevTools and BiDi',
      level: 'advanced',
      platform: 'web',
      desc: 'Reaches Chrome DevTools Protocol or WebDriver BiDi through the WebDriver that webdriver().object() returns, for browser features Selenide has no method for.',
      tip: 'Selenide augments every remote driver it creates, so a Chromium node on Grid answers to HasDevTools, and it calls enableBiDi() for Firefox, local or remote. instanceof HasBiDi does not prove the connection works: Selenide opens a LogInspector to check and falls back when that fails, for example on a Selenoid without BiDi. A driver passed to setWebDriver() is used as is, so augment it yourself. Selenide already uses these channels for CDP downloads, screenshots, clock() and browser logs.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/BrowserSession.html#object()',
      code: `import org.openqa.selenium.WebDriver;
import org.openqa.selenium.bidi.HasBiDi;
import org.openqa.selenium.bidi.module.Script;
import org.openqa.selenium.devtools.DevTools;
import org.openqa.selenium.devtools.HasDevTools;

WebDriver driver = webdriver().object(); // same as WebDriverRunner.getWebDriver()

if (driver instanceof HasDevTools cdp) { // Chrome, Edge: local or Grid
  DevTools devTools = cdp.getDevTools();
  devTools.createSessionIfThereIsNotOne(driver.getWindowHandle());
  // devTools.send(...), devTools.addListener(...)
} else if (driver instanceof HasBiDi) { // Firefox
  try (Script script = new Script(driver.getWindowHandle(), driver)) {
    script.addPreloadScript("() => { window.e2e = true; }");
  }
}`,
    },
    {
      name: 'setWebDriver()',
      level: 'advanced',
      platform: 'web',
      desc: 'WebDriverRunner.setWebDriver() makes Selenide use a WebDriver you built yourself in the current thread, for example a RemoteWebDriver with settings Selenide cannot express.',
      tip: 'Call it before open(). Selenide skips its own setup for this driver: no LocalFileDetector, no Augmenter, no browser size, no listeners, and no auto-close when the thread dies. closeWebDriver() does quit it, and so does the JVM shutdown hook. Calling setWebDriver() again does not quit the previous driver. Keep Configuration.remote set for a remote driver: download plugins decide local or remote from it. For a factory Selenide calls itself, see WebDriverProvider in Patterns.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/WebDriverRunner.html#setWebDriver(org.openqa.selenium.WebDriver)',
      code: `import com.codeborne.selenide.WebDriverRunner;
import java.net.URI;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.Augmenter;
import org.openqa.selenium.remote.LocalFileDetector;
import org.openqa.selenium.remote.RemoteWebDriver;

RemoteWebDriver remote = new RemoteWebDriver(
    URI.create("http://grid.example.com:4444/wd/hub").toURL(), new ChromeOptions());
remote.setFileDetector(new LocalFileDetector()); // Selenide does this only for its own drivers
WebDriver driver = new Augmenter().augment(remote); // and this

WebDriverRunner.setWebDriver(driver); // before open()
open("/dashboard");
closeWebDriver(); // quits this driver too`,
    },
    {
      name: 'sessionId()',
      level: 'intermediate',
      platform: 'web',
      desc: 'Returns the WebDriver session id of the current browser. On Grid, Selenoid or Moon it names the session on the server, so you can match a test with its session in the server UI or logs.',
      tip: 'It does not start a browser: before open() it throws IllegalStateException ("No webdriver is bound to current thread"). It casts the driver to RemoteWebDriver after unwrapping one wrapper, so it works for Chrome, Firefox, Edge and remote drivers, but throws ClassCastException for a driver that does not extend RemoteWebDriver.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#sessionId()',
      code: `import org.openqa.selenium.remote.SessionId;

open("/");
SessionId id = sessionId();
System.out.println("Remote session: " + id);`,
    },
  ],
};
