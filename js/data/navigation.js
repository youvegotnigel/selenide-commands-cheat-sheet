/** @type {import('./index.js').Category} */
export default {
  cat: 'Navigation & Browser',
  cls: 'navigation',
  color: '#0ea5e9',
  items: [
    {
      name: 'open()',
      level: 'beginner',
      platform: 'web',
      desc: 'Opens a URL in the browser, starting the browser on first use. A relative URL is prefixed with Configuration.baseUrl.',
      tip: 'A URL that does not start with http://, https:// or file:// is treated as relative. The browser is reused across calls and closed automatically when the tests finish.',
      docs: 'https://selenide.org/javadoc/current/com/codeborne/selenide/Selenide.html#open(java.lang.String)',
      code: `Configuration.baseUrl = "https://shop.example.com";
open("/login"); // opens https://shop.example.com/login`,
    },
  ],
};
