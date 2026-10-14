/** @type {import('./index.js').Category} */
export default {
  cat: 'Page Objects',
  cls: 'page-object',
  color: '#f43f5e',
  items: [
    {
      name: 'Page object (plain $ fields)',
      level: 'beginner',
      platform: 'web',
      desc: 'The simplest page object: a class whose fields are initialised with $() and $$(). Create it with new, no page factory needed.',
      tip: '$() is lazy and looks the element up again on every call, so the fields can be built before the page is opened and never go stale. Composing widgets works the same way: build child fields with root.$(...).',
      docs: 'https://selenide.org/documentation/page-objects.html',
      code: `public class LoginPage {
  private final SelenideElement username = $("#username");
  private final SelenideElement password = $("#password");
  private final ElementsCollection errors = $$(".error");

  public void login(String user, String pass) {
    username.setValue(user);
    password.setValue(pass).pressEnter();
  }
}

new LoginPage().login("alice", "secret");`,
    },
    {
      name: 'page(Class) and page(object)',
      level: 'beginner',
      platform: 'web',
      desc: 'Creates a page object and runs the Selenide page factory on it, filling its @FindBy, Container and collection fields. page(object) does the same for an instance you constructed yourself.',
      tip: 'page(Class) needs a no-arg constructor (private is fine). Use page(new X(args)) when the constructor takes arguments. Only fields that are still null are decorated, so fields you already assigned with $() keep their value.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#page(java.lang.Class)',
      code: `LoginPage login = page(LoginPage.class);
SearchPage search = page(new SearchPage("shoes"));
CartPage cart = page(); // class inferred from the variable type`,
    },
    {
      name: 'open(url, PageObject.class)',
      level: 'beginner',
      platform: 'web',
      desc: 'Opens the URL and returns a new page object of the given class in one call. Equivalent to open(url) followed by page(Class).',
      tip: 'The URL can be relative to Configuration.baseUrl. Basic auth overloads also take a page object class: open(url, domain, login, password, LoginPage.class).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#open(java.lang.String,java.lang.Class)',
      code: `LoginPage login = open("/login", LoginPage.class);
login.login("alice", "secret");`,
    },
    {
      name: '@FindBy fields',
      level: 'beginner',
      platform: 'web',
      desc: 'Declares page object fields with Selenium @FindBy and types SelenideElement, ElementsCollection or List of SelenideElement. page() or open(url, Class) fills them in.',
      tip: 'Fields stay null if you create the object with new, which ends in a NullPointerException. Each field is a lazy proxy looked up on every call. Adding @CacheLookup keeps the first element found, which can go stale after a re-render.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/impl/SelenidePageFactory.html',
      code: `import org.openqa.selenium.support.FindBy;

public class SearchPage {
  @FindBy(name = "q")
  private SelenideElement query;

  @FindBy(css = "#results .item")
  private ElementsCollection results;

  public void search(String text) {
    query.setValue(text).pressEnter();
    results.shouldHave(sizeGreaterThan(0));
  }
}`,
    },
    {
      name: 'Container (reusable widget)',
      level: 'intermediate',
      platform: 'web',
      desc: 'A class that implements the Container marker interface is a reusable widget. Used as a @FindBy field, its own @FindBy fields are searched inside the element the field points to.',
      tip: 'Container replaced the abstract class ElementsContainer, removed in Selenide 7.0.0. Only @FindBy fields are scoped to the widget: a field set with $() still searches the whole page. container(css, Class) (since 7.10.0) builds one without a page object.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Container.html',
      code: `import com.codeborne.selenide.Container;
import org.openqa.selenium.support.FindBy;

public class Header implements Container {
  @FindBy(css = ".user-name")
  public SelenideElement userName;
}

public class HomePage {
  @FindBy(css = "header")
  public Header header;
}

page(HomePage.class).header.userName.shouldHave(text("alice"));
Header header = container("header", Header.class);`,
    },
    {
      name: '@Self (container root)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Annotating a SelenideElement field with @Self inside a Container injects the root element of that container, for checks and actions on the widget itself.',
      tip: '@Self is nested in Container, so import Container.Self. It only works in a container reached through a field, container() or a List of Containers. In a top-level page object, page() throws IllegalArgumentException.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Container.Self.html',
      code: `import com.codeborne.selenide.Container;
import com.codeborne.selenide.Container.Self;
import org.openqa.selenium.support.FindBy;

public class Dialog implements Container {
  @Self
  public SelenideElement self;

  @FindBy(css = ".close")
  public SelenideElement close;

  public void dismiss() {
    close.click();
    self.shouldBe(hidden);
  }
}`,
    },
    {
      name: 'List of Containers',
      level: 'intermediate',
      platform: 'web',
      desc: 'A @FindBy field of type List of a Container class gives one widget per matching element, for table rows, cards or search results.',
      tip: 'It is a plain java.util.List: size() and get(i) query the DOM once and never wait. Assert the count first with $$(...).shouldHave(size(n)). containers(css, Class) (since 7.10.0) returns the same list without a page object.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#containers(java.lang.String,java.lang.Class)',
      code: `import com.codeborne.selenide.Container;
import java.util.List;
import org.openqa.selenium.support.FindBy;

public class Row implements Container {
  @FindBy(css = ".name")
  public SelenideElement name;
}

public class UsersPage {
  @FindBy(css = "#users tr")
  public List<Row> rows;
}

$$("#users tr").shouldHave(size(3));
page(UsersPage.class).rows.get(0).name.shouldHave(text("alice"));
List<Row> rows = containers("#users tr", Row.class);`,
    },
    {
      name: '@As (field alias)',
      level: 'intermediate',
      platform: 'web',
      desc: 'Gives a page object field a human-readable name that replaces the selector in error messages and reports.',
      tip: 'Applied by the page factory, so it needs page() or open(url, Class). It also works on fields already set with $(), but only when the object goes through page(). Outside page objects, call $(...).as("name").',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/As.html',
      code: `import com.codeborne.selenide.As;
import org.openqa.selenium.support.FindBy;

public class CheckoutPage {
  @As("Pay button")
  @FindBy(css = "#checkout > button.primary")
  public SelenideElement pay;
}`,
    },
  ],
};
