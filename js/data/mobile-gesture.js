/** @type {import('./index.js').Category} */
export default {
  cat: 'Mobile Gestures',
  cls: 'mobile-gesture',
  color: '#e9aff2',
  items: [
    {
      name: 'tap()',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Taps the centre of the element with a native touch gesture: finger down, a 200 ms hold, finger up.',
      tip: 'tap() lives on SelenideAppiumElement, so get the element from SelenideAppium.$ (Selenide.$ returns a plain SelenideElement without it). Every AppiumClickOptions gesture is forced: it waits for the element to exist, not to be visible, and taps its screen coordinates. Call scrollTo() or shouldBe(visible) first when the element may be off screen.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumElement.html#tap()',
      code: `import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.accessibilityId("Views")).tap();
$(AppiumBy.accessibilityId("Animation")).shouldBe(visible);`,
    },
    {
      name: 'tap(AppiumClickOptions)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Taps with an AppiumClickOptions gesture, for example tapWithOffset(x, y) to tap a point relative to the centre of the element.',
      tip: 'Offsets are pixels from the centre: positive x goes right, positive y goes down. AppiumClickOptions extends ClickOptions, so click(tapWithOffset(...)) does the same on a plain SelenideElement. On a mobile driver, click(usingJavaScript()) and click(withTimeout(...)) throw UnsupportedOperationException.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumClickOptions.html#tapWithOffset(int,int)',
      code: `import com.codeborne.selenide.appium.AppiumClickOptions;
import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

var views = $(AppiumBy.accessibilityId("Views")).shouldBe(visible);
int rowHeight = views.getSize().getHeight();
views.tap(AppiumClickOptions.tapWithOffset(0, -rowHeight)); // taps the row above "Views"`,
    },
    {
      name: 'doubleTap()',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Double-taps the centre of the element: two 200 ms taps separated by a 40 ms pause.',
      tip: 'Prefer doubleTap() over doubleClick() on a native app: in 7.19.0 the mobile doubleClick() builds a Selenium Actions double click but never calls perform(), so no gesture is sent. To double-tap away from the centre, use tap(AppiumClickOptions.doubleTapWithOffset(x, y)).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumElement.html#doubleTap()',
      code: `import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.className("android.widget.Button")).doubleTap();
$(AppiumBy.id("counter")).shouldHave(text("2"));`,
    },
    {
      name: 'longPress (AppiumClickOptions)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Presses and holds the centre of the element. longPress() holds for 3 seconds and longPressFor(Duration) for the given time.',
      tip: 'There is no longPress() method on the element: pass the option to tap() or click(). The 3 second default adds 3 seconds to every call, so use longPressFor() with a shorter Duration when the app reacts sooner.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumClickOptions.html#longPressFor(java.time.Duration)',
      code: `import com.codeborne.selenide.appium.AppiumClickOptions;
import io.appium.java_client.AppiumBy;
import java.time.Duration;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.accessibilityId("People Names")).tap(AppiumClickOptions.longPress()); // holds 3 s
$(AppiumBy.accessibilityId("People Names")).tap(AppiumClickOptions.longPressFor(Duration.ofSeconds(1)));
$(AppiumBy.accessibilityId("Sample menu")).shouldBe(visible);`,
    },
    {
      name: 'longPressWithOffsetFor (AppiumClickOptions)',
      level: 'advanced',
      platform: 'mobile',
      desc: 'Long-presses a point offset from the centre of the element, for the given time.',
      tip: 'There is no offset variant without a Duration: pass Duration.ofSeconds(3) to match the longPress() default. Useful on large elements such as a map or a text block, where the centre is not the point you need.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumClickOptions.html#longPressWithOffsetFor(java.time.Duration,int,int)',
      code: `import com.codeborne.selenide.appium.AppiumClickOptions;
import io.appium.java_client.AppiumBy;
import java.time.Duration;
import static com.codeborne.selenide.appium.SelenideAppium.$;

var row = $(AppiumBy.accessibilityId("People Names")).shouldBe(visible);
int nearLeftEdge = -(row.getSize().getWidth() / 2 - 10);
row.tap(AppiumClickOptions.longPressWithOffsetFor(Duration.ofSeconds(2), nearLeftEdge, 0));`,
    },
    {
      name: 'scrollTo() (Appium)',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Scrolls the screen down until this element is displayed, swiping at most 30 times. Works on Android and iOS.',
      tip: 'It stops silently after 30 swipes and does not fail, so chain shouldBe(visible) to get a clear error. Each swipe drags from 50% to 25% of the screen height, about a quarter screen. On a web driver it falls back to the normal web scrollTo().',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumElement.html#scrollTo()',
      code: `import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.accessibilityId("Tabs")).scrollTo().shouldBe(visible).tap();`,
    },
    {
      name: 'scroll(AppiumScrollOptions)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Scrolls in the given direction until this element is displayed: AppiumScrollOptions.down() or up(), at most 30 swipes, or down(n) and up(n) for a different limit.',
      tip: 'It is a scroll until visible, not a fixed distance: if the element is already displayed, no swipe happens. To go back to the top, call it with up() on an element near the top. Passing the web ScrollOptions on a mobile driver throws IllegalArgumentException.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumElement.html#scroll(com.codeborne.selenide.appium.AppiumScrollOptions)',
      code: `import com.codeborne.selenide.appium.AppiumScrollOptions;
import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.accessibilityId("Tabs")).scroll(AppiumScrollOptions.down(10)).shouldBe(visible);
$(AppiumBy.accessibilityId("Animation")).scroll(AppiumScrollOptions.up()).shouldBe(visible);`,
    },
    {
      name: 'AppiumScrollOptions.with()',
      level: 'advanced',
      platform: 'mobile',
      desc: 'Tunes a scroll: with(ScrollDirection, maxSwipeCount) sets the direction and swipe limit, and with(ScrollDirection, top, bottom), up(top, bottom) and down(top, bottom) set where each swipe starts and ends as fractions of the screen height.',
      tip: 'Both fractions must be strictly between 0 and 1 and top must not exceed bottom, or the constructor throws IllegalArgumentException. Each swipe covers bottom minus top of the height (default 0.25 to 0.5). The fraction overloads always keep the 30 swipe limit: no factory takes both.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumScrollOptions.html#with(com.codeborne.selenide.appium.ScrollDirection,float,float)',
      code: `import com.codeborne.selenide.appium.AppiumScrollOptions;
import com.codeborne.selenide.appium.ScrollDirection;
import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.accessibilityId("Tabs")).scroll(AppiumScrollOptions.with(ScrollDirection.DOWN, 5));
// longer swipes: the finger travels from 80% up to 20% of the screen height
$(AppiumBy.accessibilityId("Footer")).scroll(AppiumScrollOptions.with(ScrollDirection.DOWN, 0.2f, 0.8f));
$(AppiumBy.accessibilityId("Header")).scroll(AppiumScrollOptions.up(0.2f, 0.8f));`,
    },
    {
      name: 'scroll() and swipe() inside()',
      level: 'advanced',
      platform: 'mobile',
      desc: 'inside(element) on AppiumScrollOptions or AppiumSwipeOptions performs the swipes within that element, such as a list or a carousel, instead of across the whole screen. Added in Selenide 7.19.0.',
      tip: 'The scroll fractions and the 25% and 75% swipe points are then measured on the part of the container that is on screen. A container entirely off screen throws IllegalArgumentException. The container is any WebElement, so a SelenideAppiumElement works, and its position is read again before every swipe.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/AppiumScrollOptions.html#inside(org.openqa.selenium.WebElement)',
      code: `import com.codeborne.selenide.appium.AppiumScrollOptions;
import com.codeborne.selenide.appium.AppiumSwipeOptions;
import com.codeborne.selenide.appium.SelenideAppiumElement;
import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

SelenideAppiumElement list = $(AppiumBy.id("android:id/list"));
$(AppiumBy.accessibilityId("Tabs")).scroll(AppiumScrollOptions.down().inside(list)).shouldBe(visible);

SelenideAppiumElement tabs = $(AppiumBy.id("android:id/tabs"));
$(AppiumBy.accessibilityId("TAB 12")).swipe(AppiumSwipeOptions.right(10).inside(tabs)).shouldBe(visible);`,
    },
    {
      name: 'swipeTo()',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Swipes horizontally to the right until this element is displayed, swiping at most 30 times.',
      tip: 'Right names where the content goes: the finger moves from 75% to 25% of the screen width, revealing what is to the right. Swipes run across the vertical middle of the screen, so for a carousel elsewhere use swipe(AppiumSwipeOptions.right().inside(carousel)). Like scrollTo(), it does not fail after the last swipe.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumElement.html#swipeTo()',
      code: `import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.accessibilityId("Page 4")).swipeTo().shouldBe(visible).tap();`,
    },
    {
      name: 'swipe(AppiumSwipeOptions)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Swipes in the given direction until this element is displayed: AppiumSwipeOptions.right() or left(), at most 30 swipes, right(n) and left(n) for a different limit, or with(AppiumSwipeDirection, n).',
      tip: 'left() moves the finger from 25% to 75% of the width, so it reveals content on the left: use it to go back. Swipe works only on a mobile driver; on a web driver it throws IllegalArgumentException.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumElement.html#swipe(com.codeborne.selenide.appium.AppiumSwipeOptions)',
      code: `import com.codeborne.selenide.appium.AppiumSwipeDirection;
import com.codeborne.selenide.appium.AppiumSwipeOptions;
import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.accessibilityId("Page 5")).swipe(AppiumSwipeOptions.right()).shouldBe(visible);
$(AppiumBy.accessibilityId("Page 1")).swipe(AppiumSwipeOptions.left(10)).shouldBe(visible);
$(AppiumBy.accessibilityId("Page 3")).swipe(AppiumSwipeOptions.with(AppiumSwipeDirection.RIGHT, 5));`,
    },
    {
      name: 'hideKeyboard()',
      level: 'beginner',
      platform: 'mobile',
      desc: 'Closes the on-screen keyboard if it is shown, and does nothing if it is not.',
      tip: 'On Android it calls the driver keyboard hide. On iOS it types a newline (the Return key) into this element, which can submit a form or move focus, so call it on the field you just typed into. Any other driver throws UnsupportedOperationException.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumElement.html#hideKeyboard()',
      code: `import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.accessibilityId("username")).setValue("standard_user").hideKeyboard();
$(AppiumBy.accessibilityId("Login")).tap();`,
    },
    {
      name: 'setValue() (Appium)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'In a native session, setValue(text) clears the field and sends the whole text at once.',
      tip: 'On a mobile driver, setValue() accepts only plain text. setValue(SetValueOptions), such as withText(...).sensitive(), fails with ClassCastException because the Appium command casts its argument to CharSequence. To keep a password out of the report, use type(TypeOptions.text(...).sensitive()).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/SelenideElement.html#setValue(java.lang.String)',
      code: `import static com.codeborne.selenide.appium.SelenideAppium.$;
import io.appium.java_client.AppiumBy;

$(AppiumBy.accessibilityId("username")).setValue("standard_user");`,
    },
    {
      name: 'type() (Appium)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'In a native session, type(text) clears the field and types one character at a time, with a 200 ms pause between characters.',
      tip: 'Use type(TypeOptions.text(...).sensitive()) to keep a password out of the report, and withDelay() for a slow autocomplete. clearFirst(false) keeps the existing text. On Android, type() taps the field before every character, so each keystroke goes to that field.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumElement.html#type(com.codeborne.selenide.TypeOptions)',
      code: `import com.codeborne.selenide.TypeOptions;
import io.appium.java_client.AppiumBy;
import java.time.Duration;
import static com.codeborne.selenide.appium.SelenideAppium.$;

$(AppiumBy.accessibilityId("password")).type(TypeOptions.text("secret_sauce").sensitive());

// slow autocomplete: longer pauses, keep what is already typed
$(AppiumBy.accessibilityId("search"))
  .type(TypeOptions.text("Back").withDelay(Duration.ofMillis(400)).clearFirst(false));
$(AppiumBy.accessibilityId("Sauce Labs Backpack")).shouldBe(visible);`,
    },
    {
      name: 'dragAndDrop() (Appium)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'Drags this element onto the target with a touch gesture: press the centre, hold 600 ms, move to the centre of the target over 600 ms, release.',
      tip: 'It waits for the target to be visible but not the source, so check the source with shouldBe(visible) first. Pass the target as an element, DragAndDropOptions.to(WebElement). usingJS() is ignored on a mobile driver (it only logs at debug level).',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumElement.html#dragAndDrop(com.codeborne.selenide.DragAndDropOptions)',
      code: `import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.DragAndDropOptions.to;
import static com.codeborne.selenide.appium.SelenideAppium.$;

var dot = $(AppiumBy.id("io.appium.android.apis:id/drag_dot_1")).shouldBe(visible);
var target = $(AppiumBy.id("io.appium.android.apis:id/drag_dot_2"));
dot.dragAndDrop(to(target));
$(AppiumBy.id("io.appium.android.apis:id/drag_result_text")).shouldHave(exactText("Dropped!"));`,
    },
    {
      name: 'unfocus() (Appium)',
      level: 'intermediate',
      platform: 'mobile',
      desc: 'On a native app session unfocus() is not supported: it throws UnsupportedOperationException. In a browser it falls back to the normal web unfocus().',
      tip: 'Web tests often call unfocus() to fire blur handlers or close the keyboard. In a mobile app, close the keyboard with hideKeyboard() or tap the next field instead.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/appium/SelenideAppiumElement.html#unfocus()',
      code: `import io.appium.java_client.AppiumBy;
import static com.codeborne.selenide.appium.SelenideAppium.$;

// $(AppiumBy.accessibilityId("username")).unfocus(); throws UnsupportedOperationException
$(AppiumBy.accessibilityId("username")).setValue("standard_user").hideKeyboard();`,
    },
  ],
};
