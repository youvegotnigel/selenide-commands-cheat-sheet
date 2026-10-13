/** @type {import('./index.js').Category} */
export default {
  cat: 'Files',
  cls: 'file',
  color: '#84cc16',
  items: [
    {
      name: 'uploadFile()',
      level: 'beginner',
      platform: 'web',
      desc: 'Puts one or more local files into an <input type="file"> field. Returns the first file as a canonical File.',
      tip: 'Call it on the input element itself, not on the styled button or label: any other tag throws IllegalArgumentException. A missing file fails before the upload starts. With Configuration.remote, Selenide installs a LocalFileDetector, so local files reach a Grid browser too.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#uploadFile(java.io.File...)',
      code: `import java.io.File;

$("input[type=file]").uploadFile(new File("src/test/data/cv.pdf"));
$("#attachments").uploadFile(new File("a.png"), new File("b.png"));`,
    },
    {
      name: 'uploadFromClasspath()',
      level: 'beginner',
      platform: 'web',
      desc: 'Uploads files found on the test classpath, such as src/test/resources, so the test does not depend on the working directory.',
      tip: 'The name is resolved with ClassLoader.getResource, so it is relative to the classpath root: no leading slash and no "src/test/resources/" prefix. Files packed inside a JAR are copied to a temporary folder first. A name that is not found throws IllegalArgumentException.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#uploadFromClasspath(java.lang.String...)',
      code: `// file lives in src/test/resources/files/cv.pdf
$("input[type=file]").uploadFromClasspath("files/cv.pdf");
$("#photos").uploadFromClasspath("img/front.png", "img/back.png");`,
    },
    {
      name: 'download()',
      level: 'beginner',
      platform: 'web',
      desc: 'Downloads the file behind a link and returns it as a File, saved under Configuration.downloadsFolder (build/downloads by default) in a unique subfolder.',
      tip: 'The default mode, HTTPGET, does not click: it sends a GET to the href with the browser cookies. A button or a JavaScript download has no href and fails, so switch to FOLDER or CDP. It waits up to Configuration.timeout (4 s by default). A 4xx reply throws FileNotDownloadedError.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#download()',
      code: `import java.io.File;
import java.nio.file.Files;

File invoice = $("a#invoice").download();
// build/downloads/<unique folder>/invoice.pdf
long size = Files.size(invoice.toPath());`,
    },
    {
      name: 'FileDownloadMode',
      level: 'intermediate',
      platform: 'web',
      desc: 'Chooses how download() gets the file. Set it once for the suite with Configuration.fileDownload; the default is HTTPGET.',
      tip: 'Override one call with DownloadOptions.using(mode). HTTPGET and PROXY work with Selenium Grid as they are; FOLDER and CDP on a remote browser need the selenide-grid plugin (or selenide-selenoid, selenide-moon), because the files stay on the node. HTTPGET cannot download several files at once.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/FileDownloadMode.html',
      code: `import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.FileDownloadMode;

// HTTPGET (default): GET the href with the browser cookies, no click
// FOLDER: click, then wait for the file in the browser downloads folder
// CDP:    click, then follow the download over Chrome DevTools (Chromium only)
// PROXY:  click, then capture the response in the Selenide proxy
Configuration.fileDownload = FileDownloadMode.FOLDER;
// or -Dselenide.fileDownload=FOLDER`,
    },
    {
      name: 'download() (FOLDER)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Clicks the element and waits for a new file in the browser downloads folder. Works for any trigger: buttons, form posts, files built in JavaScript.',
      tip: 'A Chromium download counts as finished when no new .crdownload or .tmp file is left, Firefox when no .part file is left; for other browsers Selenide waits until the files stop changing for 1 s. Since 7.19.0 (#2675), temporary files left by an earlier failed download no longer hold up the next one. A remote browser without selenide-grid fails with "Downloads folder is not configured".',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/FileDownloadMode.html#FOLDER',
      code: `import com.codeborne.selenide.DownloadOptions;
import java.io.File;
import static com.codeborne.selenide.FileDownloadMode.FOLDER;

// a button has no href, so HTTPGET cannot fetch it
File export = $("button#export").download(DownloadOptions.using(FOLDER));`,
    },
    {
      name: 'download() (CDP)',
      level: 'advanced',
      platform: 'web',
      desc: 'Clicks the element and follows the download through Chrome DevTools Protocol events instead of polling the folder. Chromium-based browsers only.',
      tip: 'Firefox and Safari throw IllegalArgumentException ("is not Chromium browser"). Completion comes from the downloadProgress event, so there are no temporary-file heuristics. For a Grid browser add selenide-grid, which supplies a CDP downloader that fetches the file from the node.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/FileDownloadMode.html#CDP',
      code: `import com.codeborne.selenide.DownloadOptions;
import java.io.File;
import static com.codeborne.selenide.FileDownloadMode.CDP;

File report = $("#download-report").download(DownloadOptions.using(CDP));`,
    },
    {
      name: 'download() (PROXY)',
      level: 'advanced',
      platform: 'web',
      desc: 'Routes the browser through the Selenide embedded proxy and captures the file from the HTTP response that follows the click, so it also handles form submissions.',
      tip: 'Set proxyEnabled before the browser opens; without it download() throws IllegalStateException ("proxy server is not enabled"). It only works for a browser Selenide started with its proxy, not a custom WebDriver created without it. On Grid the node must be able to reach the proxy on the test machine.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/FileDownloadMode.html#PROXY',
      code: `import com.codeborne.selenide.Configuration;
import java.io.File;
import static com.codeborne.selenide.FileDownloadMode.PROXY;

Configuration.proxyEnabled = true; // before open()
Configuration.fileDownload = PROXY;

open("/statements");
File statement = $("form#statement button[type=submit]").download();`,
    },
    {
      name: 'FileFilters',
      level: 'intermediate',
      platform: 'web',
      desc: 'Tells download() which file you expect when one click produces several, and fails with FileNotDownloadedError if no downloaded file matches.',
      tip: 'withExtension takes "pdf" without the dot; ".pdf" throws IllegalArgumentException. withName is an exact, case-sensitive match. withNameMatching must match the whole file name, so "report" alone does not match "report.csv". DownloadOptions has the same three as shortcuts.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/files/FileFilters.html',
      code: `import java.io.File;
import static com.codeborne.selenide.files.FileFilters.*;

File pdf = $("#export").download(withExtension("pdf"));
File csv = $("#export").download(withName("orders-2026.csv"));
File log = $("#export").download(withNameMatching("build-\\\\d+\\\\.log"));`,
    },
    {
      name: 'download(DownloadOptions)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Sets the mode, timeouts, file filter and trigger action for one download. Start from DownloadOptions.using(mode), or DownloadOptions.file() to keep Configuration.fileDownload.',
      tip: 'The default timeout is Configuration.timeout (4 s), too short for large files. withIncrementTimeout fails fast when the files stop changing, for example after a missed click; it must not exceed the timeout or the call throws IllegalArgumentException. withAction replaces the default click. download(long) is deprecated.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/DownloadOptions.html',
      code: `import com.codeborne.selenide.DownloadOptions;
import java.io.File;
import java.time.Duration;
import static com.codeborne.selenide.FileDownloadMode.FOLDER;
import static com.codeborne.selenide.files.DownloadActions.clickAndConfirm;

File archive = $("#export-all").download(DownloadOptions.using(FOLDER)
    .withTimeout(Duration.ofSeconds(90))
    .withIncrementTimeout(Duration.ofSeconds(10))
    .withExtension("zip")
    .withAction(clickAndConfirm("Export all data?")));`,
    },
    {
      name: 'download(url)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Selenide.download() fetches a URL directly with the current browser cookies and User-Agent, without clicking anything on the page.',
      tip: 'A URL starting with "/" is prefixed with Configuration.baseUrl. It must already be percent-encoded. The String overload throws the checked URISyntaxException; the URI overload does not. The file is saved under Configuration.downloadsFolder, not reportsFolder as the Javadoc says.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#download(java.lang.String)',
      code: `import java.io.File;
import java.net.URI;

File csv = download("/export/orders.csv");
File big = download(URI.create("https://example.com/dump.zip"), 60_000);`,
    },
  ],
};
