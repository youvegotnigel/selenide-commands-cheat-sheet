// Anchor matching for check-docs-links.mjs. Plain string search, never a regex
// built from the anchor: Javadoc anchors such as
// shouldHave(com.codeborne.selenide.WebElementCondition...) are full of regex
// metacharacters. The closing quote is part of the needle, so an id that only
// starts with the anchor (textCaseSensitive vs text) never matches.

export function decodeAnchor(hash) {
  return decodeURIComponent(hash.replace(/^#/, ''));
}

// Javadoc pages use quoted ids. GitHub blob pages embed the rendered README in
// a JSON payload, so heading ids appear escaped (id=\"...\") and prefixed with
// "user-content-".
export function hasAnchor(html, anchor, { github = false } = {}) {
  const id = github ? `user-content-${anchor}` : anchor;
  return [`id="${id}"`, `id='${id}'`, `id=\\"${id}\\"`].some((needle) => html.includes(needle));
}
