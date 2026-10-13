/** @type {import('./index.js').Category} */
export default {
  cat: 'Setup & Config',
  cls: 'config',
  color: '#06b6d4',
  items: [
    {
      name: 'Static imports',
      level: 'beginner',
      platform: 'both',
      desc: 'The three static imports every snippet on this cheat sheet assumes: Selenide, Condition and CollectionCondition.',
      tip: 'Other imports, such as AppiumBy or CombinedBy, are written inside the snippets that need them.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html',
      code: `import static com.codeborne.selenide.Selenide.*;
import static com.codeborne.selenide.Condition.*;
import static com.codeborne.selenide.CollectionCondition.*;`,
    },
    {
      name: 'Configuration.timeout',
      level: 'intermediate',
      platform: 'both',
      desc: 'How long, in milliseconds, should* methods keep retrying before they fail. The default is 4000.',
      tip: 'Set it once for the suite, or pass -Dselenide.timeout=10000. For one slow element, pass a Duration to should() instead of raising the global value.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Configuration.html#timeout',
      code: `Configuration.timeout = 10_000; // milliseconds`,
    },
  ],
};
