// =============================================================
// highlight.js — tiny dependency-free highlighter for code snippets.
// Returns HTML-escaped markup with <span class="tok-*"> wrappers.
// Single pass per language: text between matched tokens is escaped and
// emitted plain, so every character is escaped exactly once and the
// rendered textContent equals the source (Copy stays exact).
// highlight()      — Java snippets (also fine for Gradle Kotlin DSL)
// highlightShell() — mvn / gradle / shell snippets
// highlightXml()   — pom.xml snippets
// pickHighlighter() / highlightFor() — choose one for a cheat sheet item
// =============================================================

const KEYWORDS = new Set([
  'abstract',
  'assert',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'default',
  'do',
  'double',
  'else',
  'enum',
  'extends',
  'final',
  'finally',
  'float',
  'for',
  'goto',
  'if',
  'implements',
  'import',
  'instanceof',
  'int',
  'interface',
  'long',
  'native',
  'new',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'strictfp',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'try',
  'void',
  'volatile',
  'while',
  'var',
  'record',
  'sealed',
  'non-sealed',
  'permits',
  'yield',
  'true',
  'false',
  'null',
]);

// Selenide / selenide-appium identifiers worth colouring. Unknown names render
// plain, which is graceful: add names here as content needs them.
const APIS = new Set([
  '$',
  '$$',
  '$x',
  'open',
  'Configuration',
  'Condition',
  'CollectionCondition',
  'Selenide',
  'SelenideElement',
  'ElementsCollection',
  'WebDriverRunner',
  'SelenideConfig',
  'SelenideDriver',
  'Selectors',
  'ClickOptions',
  'DragAndDropOptions',
  'FileDownloadMode',
  'WebDriverProvider',
  'SelenideAppium',
  'SelenideAppiumElement',
  'SelenideAppiumCollection',
  'AppiumBy',
  'CombinedBy',
  'AppiumSelectors',
  'AppiumClickOptions',
  'AppiumScrollOptions',
  'AppiumSwipeOptions',
  'AppiumCondition',
  'AppiumCollectionCondition',
]);

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const span = (cls, text) => `<span class="${cls}">${escapeHtml(text)}</span>`;

// Ordered alternatives: comment | string (text block first) | annotation | number | identifier
const JAVA_TOKEN_RE =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("""[\s\S]*?"""|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])+')|(@[A-Za-z_]\w*)|(\b0[xX][0-9a-fA-F_]+[lL]?\b|\b\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?[lLfFdD]?\b)|(non-sealed(?![\w$])|[A-Za-z_$][\w$]*)/g;

export function highlight(code) {
  let out = '';
  let last = 0;
  let m;
  JAVA_TOKEN_RE.lastIndex = 0;
  while ((m = JAVA_TOKEN_RE.exec(code)) !== null) {
    out += escapeHtml(code.slice(last, m.index));
    const [, comment, string, annotation, number, ident] = m;
    if (comment !== undefined) out += span('tok-comment', comment);
    else if (string !== undefined) out += span('tok-string', string);
    else if (annotation !== undefined) out += span('tok-keyword', annotation);
    else if (number !== undefined) out += span('tok-number', number);
    else {
      let cls = null;
      if (KEYWORDS.has(ident)) cls = 'tok-keyword';
      else if (APIS.has(ident)) cls = 'tok-api';
      else if (code[JAVA_TOKEN_RE.lastIndex] === '(') cls = 'tok-fn';
      out += cls ? span(cls, ident) : escapeHtml(ident);
    }
    last = JAVA_TOKEN_RE.lastIndex;
  }
  return out + escapeHtml(code.slice(last));
}

// Programs that lead a CLI command — coloured like APIs.
const SHELL_PROGRAMS = new Set([
  'mvn',
  'gradle',
  'gradlew',
  'java',
  'emulator',
  'npm',
  'npx',
  'git',
]);

// '#' starts a comment only at line start or after whitespace, so
// -Dtest=LoginTest#login stays plain. '//' is never a comment (URLs).
// Flags may contain dots: -Dselenide.browser.
// Ordered alternatives: comment | string | flag | ./gradlew | number | identifier
const SHELL_TOKEN_RE =
  /((?<!\S)#[^\n]*)|('(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")|((?<![\w-])--?[A-Za-z][\w.-]*)|((?<![\w./])\.\/gradlew\b)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;

export function highlightShell(code) {
  let out = '';
  let last = 0;
  let m;
  SHELL_TOKEN_RE.lastIndex = 0;
  while ((m = SHELL_TOKEN_RE.exec(code)) !== null) {
    out += escapeHtml(code.slice(last, m.index));
    const [, comment, string, flag, gradlew, number, ident] = m;
    if (comment !== undefined) out += span('tok-comment', comment);
    else if (string !== undefined) out += span('tok-string', string);
    else if (flag !== undefined) out += span('tok-keyword', flag);
    else if (gradlew !== undefined) out += span('tok-api', gradlew);
    else if (number !== undefined) out += span('tok-number', number);
    else out += SHELL_PROGRAMS.has(ident) ? span('tok-api', ident) : escapeHtml(ident);
    last = SHELL_TOKEN_RE.lastIndex;
  }
  return out + escapeHtml(code.slice(last));
}

// Ordered alternatives: comment | tag open (< or </) + name | attribute name (before =)
// | attribute value (after =) | ${property}. Text content stays plain, so an
// apostrophe in text never pairs up into a string.
const XML_TOKEN_RE =
  /(<!--[\s\S]*?-->)|(<\/?)([A-Za-z_][\w:.-]*)|([A-Za-z_][\w:.-]*)(?==)|((?<==)(?:"[^"]*"|'[^']*'))|(\$\{[^}\n]*\})/g;

export function highlightXml(code) {
  let out = '';
  let last = 0;
  let m;
  XML_TOKEN_RE.lastIndex = 0;
  while ((m = XML_TOKEN_RE.exec(code)) !== null) {
    out += escapeHtml(code.slice(last, m.index));
    const [, comment, tagOpen, tagName, attr, value, prop] = m;
    if (comment !== undefined) out += span('tok-comment', comment);
    else if (tagOpen !== undefined) out += escapeHtml(tagOpen) + span('tok-keyword', tagName);
    else if (attr !== undefined) out += span('tok-fn', attr);
    else if (value !== undefined) out += span('tok-string', value);
    else out += span('tok-api', prop);
    last = XML_TOKEN_RE.lastIndex;
  }
  return out + escapeHtml(code.slice(last));
}

const SHELL_START = /^\s*(?:(?:mvn|gradle|\.\/gradlew|emulator|npm|npx)\s|#)/;

export function pickHighlighter(item) {
  if (item.cls === 'cli' || SHELL_START.test(item.code)) return 'shell';
  if (/^\s*</.test(item.code)) return 'xml';
  return 'java';
}

const BY_NAME = { shell: highlightShell, xml: highlightXml, java: highlight };

export function highlightFor(item) {
  return BY_NAME[pickHighlighter(item)](item.code);
}
