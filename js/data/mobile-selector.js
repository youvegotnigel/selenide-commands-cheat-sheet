/** @type {import('./index.js').Category} */
export default {
  cat: 'Mobile Selectors',
  cls: 'mobile-selector',
  color: '#c79ff4',
  items: [
    {
      name: 'SelenideAppium.$()',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Finds the first native element matching a By and returns a SelenideAppiumElement, which adds mobile actions such as tap(), scrollTo() and hideKeyboard().',
      tip: 'Selenide.$() returns a plain SelenideElement without those methods. A single static import of SelenideAppium.$ shadows the Selenide.* wildcard, so $ resolves to the mobile version. The index in $(By, index) is zero-based, and SelenideAppium.$x(xpath) is the XPath shortcut.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppium.html#$(org.openqa.selenium.By)',
      code: `import com.codeborne.selenide.appium.SelenideAppiumElement;
import org.openqa.selenium.By;
import static com.codeborne.selenide.appium.AppiumSelectors.byText;
import static com.codeborne.selenide.appium.SelenideAppium.$;

SelenideAppiumElement views = $(byText("Views"));
views.scrollTo().tap();
$(By.className("android.widget.EditText"), 1).setValue("secret"); // second match`,
    },
    {
      name: 'SelenideAppium.$$()',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Finds every native element matching a By and returns a lazy SelenideAppiumCollection.',
      tip: 'get(), first(), last() and findBy() on a SelenideAppiumCollection return SelenideAppiumElement, so gestures work on single items. The ElementsCollection from Selenide.$$() hands back plain SelenideElements instead.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppium.html#$$(org.openqa.selenium.By)',
      code: `import com.codeborne.selenide.appium.SelenideAppiumCollection;
import org.openqa.selenium.By;
import static com.codeborne.selenide.appium.SelenideAppium.$$;

SelenideAppiumCollection fields = $$(By.className("android.widget.EditText"));
fields.shouldHave(size(2));
fields.get(0).setValue("bob@example.com");
fields.last().tap();`,
    },
    {
      name: 'SelenideAppium.element() and elements()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Named aliases for SelenideAppium.$() and $$(), returning SelenideAppiumElement and SelenideAppiumCollection.',
      tip: 'They exist for Kotlin, where $ must be written in backticks, and work the same from Java. Selenide.element() and Selenide.elements() also exist but return the web types, so import these two explicitly from SelenideAppium.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppium.html#element(org.openqa.selenium.By)',
      code: `import com.codeborne.selenide.appium.SelenideAppiumCollection;
import com.codeborne.selenide.appium.SelenideAppiumElement;
import io.appium.java_client.AppiumBy;
import org.openqa.selenium.By;
import static com.codeborne.selenide.appium.SelenideAppium.element;
import static com.codeborne.selenide.appium.SelenideAppium.elements;

SelenideAppiumElement login = element(AppiumBy.accessibilityId("Login button"));
SelenideAppiumCollection fields = elements(By.className("android.widget.EditText"));
fields.shouldHave(size(2));
login.tap();`,
    },
    {
      name: '$(AppiumBy.accessibilityId())',
      level: 'beginner',
      platform: 'mobile',
      desc: "Passes Appium's accessibility id locator to Selenide's $, so the lookup gets Selenide's waits, retries and readable errors.",
      tip: 'One value can serve both platforms: the selenide-appium tests find the same "Login button" through accessibility on Android (the content-desc attribute) and through name on iOS. It is not XPath, so no CombinedBy is needed when the app sets the same id on both.',
      docs: 'https://github.com/selenide/selenide/blob/v7.19.0/modules/appium/src/test/java/it/mobile/android/Login.java',
      code: `import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.accessibilityId("Username input field")).setValue("bob@example.com");
$(AppiumBy.accessibilityId("Login button")).shouldBe(visible).tap();`,
    },
    {
      name: '$(AppiumBy.iOSNsPredicateString())',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Finds iOS elements with an NSPredicate over their attributes, evaluated natively by the XCUITest driver.',
      tip: 'It works only with the XCUITest driver.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/selector/CombinedBy.html#ios(org.openqa.selenium.By)',
      code: `import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.iOSNsPredicateString("label == 'Log in'")).tap();
$(AppiumBy.iOSNsPredicateString("label CONTAINS 'Welcome'")).shouldBe(visible);`,
    },
    {
      name: 'Fluent chain with smart waits',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Chains a check and actions on one SelenideAppiumElement. Each should* call waits up to Configuration.timeout, and each action retries until the element is ready.',
      tip: 'No explicit waits or sleeps are needed: pass a Duration for one slow screen instead of raising the global timeout. Since 7.19.0, chainable actions such as setValue() also return SelenideAppiumElement, so hideKeyboard() or tap() can follow them.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumElement.html#shouldBe(com.codeborne.selenide.WebElementCondition...)',
      code: `import io.appium.java_client.AppiumBy;
import java.time.Duration;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.accessibilityId("Username input field"))
  .shouldBe(visible)
  .setValue("bob@example.com").hideKeyboard();
$(AppiumBy.accessibilityId("Login button")).shouldBe(enabled).tap();
$(AppiumBy.accessibilityId("checkout address screen")).shouldBe(visible, Duration.ofSeconds(15));`,
    },
    {
      name: 'AppiumSelectors.byText()',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Finds a native element whose text attribute equals the given value. withText() matches a substring instead.',
      tip: 'They build the XPath .//*[@text=...] and .//*[contains(@text, ...)], both case-sensitive. That is the Android text attribute; iOS elements have no @text, so use byName() or a CombinedBy there. Do not mix them up with the web Selectors.byText(), which matches text nodes.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumSelectors.html#byText(java.lang.String)',
      code: `import static com.codeborne.selenide.appium.AppiumSelectors.byText;
import static com.codeborne.selenide.appium.AppiumSelectors.withText;

$(byText("Views")).click();     // text is exactly "Views"
$(withText("Graphi")).click();  // text contains "Graphi"`,
    },
    {
      name: 'AppiumSelectors.byContentDescription()',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Finds a native element by its exact content description. withContentDescription() matches a substring.',
      tip: 'They build the XPath .//*[@content-desc=...] and .//*[contains(@content-desc, ...)]. content-desc is an Android attribute, so on iOS use byName() or a CombinedBy. For an exact match, $(AppiumBy.accessibilityId(...)) finds the same element without XPath.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumSelectors.html#byContentDescription(java.lang.String)',
      code: `import static com.codeborne.selenide.appium.AppiumSelectors.byContentDescription;
import static com.codeborne.selenide.appium.AppiumSelectors.withContentDescription;

$(byContentDescription("Login button")).click();
$(withContentDescription("error-message")).shouldBe(visible);`,
    },
    {
      name: 'AppiumSelectors.byName()',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Finds a native element whose name attribute equals the given value. withName() matches a substring.',
      tip: "They build the XPath .//*[@name=...] and .//*[contains(@name, ...)]. This is the iOS counterpart to byContentDescription(): XCUITest puts the element's accessibility identifier in @name, and selenide-appium's own iOS tests locate elements this way.",
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumSelectors.html#byName(java.lang.String)',
      code: `import static com.codeborne.selenide.appium.AppiumSelectors.byName;
import static com.codeborne.selenide.appium.AppiumSelectors.withName;

$(byName("Username input field")).setValue("bob@example.com");
$(withName("Login")).click(); // name contains "Login"`,
    },
    {
      name: 'AppiumSelectors.byTagAndText()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Finds an element of a given native class whose text equals the value. withTagAndText() matches a substring.',
      tip: 'The tag is the element class from the page source, such as android.widget.TextView. byText() is this selector with the tag "*", so add a tag when the same text appears in a label and a button.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumSelectors.html#byTagAndText(java.lang.String,java.lang.String)',
      code: `import static com.codeborne.selenide.appium.AppiumSelectors.byTagAndText;
import static com.codeborne.selenide.appium.AppiumSelectors.withTagAndText;

$(byTagAndText("android.widget.TextView", "Views")).click();
$(withTagAndText("android.widget.TextView", "Graphi")).click();`,
    },
    {
      name: 'AppiumSelectors.withTagAndContentDescription()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Finds an element of a given native class whose content description contains the value. byTagAndContentDescription() requires an exact match.',
      tip: 'The shipped name spells out ContentDescription in full; a shorter "TagAndDescription" variant quoted in some talk notes does not exist. It builds .//tag[contains(@content-desc, ...)], a readable replacement for a hand-written XPath on Android.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumSelectors.html#withTagAndContentDescription(java.lang.String,java.lang.String)',
      code: `import static com.codeborne.selenide.appium.AppiumSelectors.byTagAndContentDescription;
import static com.codeborne.selenide.appium.AppiumSelectors.withTagAndContentDescription;

$(byTagAndContentDescription("android.view.ViewGroup", "Login button")).click();
$(withTagAndContentDescription("android.view.ViewGroup", "generic-error"))
  .shouldBe(visible);`,
    },
    {
      name: 'AppiumSelectors.byTagAndName()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Finds an element of a given native class whose name attribute equals the value. withTagAndName() matches a substring.',
      tip: 'Mostly useful on iOS, where the tag is an XCUIElementType class and @name holds the accessibility identifier. Pass "*" as the tag to match any class, which is exactly what byName() does.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumSelectors.html#byTagAndName(java.lang.String,java.lang.String)',
      code: `import static com.codeborne.selenide.appium.AppiumSelectors.byTagAndName;
import static com.codeborne.selenide.appium.AppiumSelectors.withTagAndName;

$(byTagAndName("XCUIElementTypeOther", "generic-error-message"))
  .shouldHave(text("Provided credentials do not match"));
$(withTagAndName("XCUIElementTypeOther", "generic-error")).shouldBe(visible);`,
    },
    {
      name: 'AppiumSelectors.byAttribute()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Finds an element by any page-source attribute. withAttribute() matches a substring, and byTagAndAttribute() / withTagAndAttribute() also fix the element class.',
      tip: 'Every AppiumSelectors method is built on these. by* compiles to [@attr=value] (exact) and with* to [contains(@attr, value)] (substring), both case-sensitive. Values are quoted with Selenium Quotes.escape(), so apostrophes are safe.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumSelectors.html#byAttribute(java.lang.String,java.lang.String)',
      code: `import static com.codeborne.selenide.appium.AppiumSelectors.*;

$(byAttribute("resource-id", "com.example:id/username")).setValue("bob");
$(withAttribute("resource-id", ":id/password")).setValue("secret");
$(byTagAndAttribute("android.widget.CheckBox", "checked", "false")).click();
$(withTagAndAttribute("XCUIElementTypeStaticText", "label", "Welcome")).shouldBe(visible);`,
    },
    {
      name: 'AppiumSelectors.byClassNameAndIndex()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Finds the Nth element of a native class, for screens where repeated fields have no id or label.',
      tip: 'It builds the XPath (.//className)[index], so the index is a 1-based XPath position: 1 is the first match and 0 matches nothing. That differs from $(By, index) and collection get(index), which are 0-based.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumSelectors.html#byClassNameAndIndex(java.lang.String,int)',
      code: `import static com.codeborne.selenide.appium.AppiumSelectors.byClassNameAndIndex;

$(byClassNameAndIndex("android.widget.EditText", 1)).setValue("bob@example.com");
$(byClassNameAndIndex("android.widget.EditText", 2)).setValue("secret");`,
    },
    {
      name: 'CombinedBy.android().ios()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'One locator holding an Android and an iOS selector. Selenide picks the right one at lookup time, so tests need no if/else on the platform.',
      tip: 'Start with the static android(), then call ios(); there is no static ios(). The platform is read from the driver on every lookup. If the selector for the running platform is missing, the lookup fails with "iOS selector not given" (or the Android one), and in a web browser it throws UnsupportedOperationException.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/selector/CombinedBy.html#android(org.openqa.selenium.By)',
      code: `import com.codeborne.selenide.appium.selector.CombinedBy;
import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.AppiumSelectors.*;
import static com.codeborne.selenide.appium.SelenideAppium.$;

CombinedBy loginButton = CombinedBy.android(byContentDescription("Login button"))
  .ios(byName("Login button"));
$(loginButton).shouldBe(visible).tap();

int index = 1;
CombinedBy username = CombinedBy
  .android(AppiumBy.xpath("(//android.widget.EditText)[" + index + "]"))
  .ios(AppiumBy.xpath("(//XCUIElementTypeTextField)[" + index + "]"));
$(username).setValue("selenide-rocks");`,
    },
    {
      name: '@AndroidFindBy and @iOSXCUITFindBy fields',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Page object fields annotated for each platform. page() fills them with lazy SelenideAppiumElement and SelenideAppiumCollection proxies using the annotation for the running platform.',
      tip: 'SelenideAppiumPageFactory is registered as a service in the selenide-appium jar, so page() uses it with no setup. Start the app before calling page(): with platform annotations present it throws a WebDriverException if no driver is open. A field with no platform annotation falls back to @FindBy.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumPageFactory.html',
      code: `import com.codeborne.selenide.appium.SelenideAppiumCollection;
import com.codeborne.selenide.appium.SelenideAppiumElement;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;

public class LoginScreen {
  @AndroidFindBy(accessibility = "Username input field")
  @iOSXCUITFindBy(accessibility = "Username input field")
  public SelenideAppiumElement username;

  @AndroidFindBy(className = "android.widget.EditText")
  @iOSXCUITFindBy(className = "XCUIElementTypeTextField")
  public SelenideAppiumCollection inputs;

  @AndroidFindBy(id = "com.example:id/login")
  @iOSXCUITFindBy(iOSNsPredicate = "name == 'Login button'")
  public SelenideAppiumElement loginButton;
}

// in a test, after SelenideAppium.launchApp():
LoginScreen login = page(LoginScreen.class);
login.inputs.shouldHave(size(2));
login.username.setValue("bob@example.com");
login.loginButton.tap();`,
    },
    {
      name: 'ScreenObject.screen()',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Creates a screen object with the same field decoration as page(), under a name that reads better in mobile tests.',
      tip: 'It is a plain alias: screen(Class) calls page(Class) and screen(object) calls page(object), so both go through SelenideAppiumPageFactory. Its Javadoc still mentions @iOSFindBy, which java-client 11 no longer has; annotate fields with @iOSXCUITFindBy.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/ScreenObject.html#screen(java.lang.Class)',
      code: `import static com.codeborne.selenide.appium.ScreenObject.screen;
import static com.codeborne.selenide.appium.SelenideAppium.launchApp;

launchApp();
LoginScreen login = screen(LoginScreen.class); // same as page(LoginScreen.class)
login.username.setValue("bob@example.com");
login.loginButton.tap();`,
    },
  ],
};
