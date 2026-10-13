/** @type {import('./index.js').Category} */
export default {
  cat: 'Conditions',
  cls: 'condition',
  color: '#f97316',
  items: [
    {
      name: 'shouldHave(text())',
      level: 'beginner',
      platform: 'both',
      desc: 'Asserts the element contains the given text, retrying until Configuration.timeout runs out.',
      tip: 'text() is a case-insensitive substring match that ignores repeated whitespace. Use exactText() for an exact match. An empty string is rejected.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Condition.html#text(java.lang.String)',
      code: `$("#greeting").shouldHave(text("Hello"));`,
    },
  ],
};
