import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeAnchor, hasAnchor } from './anchors.mjs';

const JAVADOC =
  '<section class="detail" id="shouldHave(com.codeborne.selenide.WebElementCondition...)">' +
  '<section class="detail" id="shouldHave(com.codeborne.selenide.WebElementCondition,java.time.Duration)">' +
  '<section class="detail" id="textCaseSensitive(java.lang.String)">';
const GITHUB_BLOB = '{"richText":"<h3 id=\\"user-content-features\\">Features</h3>"}';

test('decodeAnchor strips # and percent-decoding', () => {
  assert.equal(decodeAnchor('#open(java.lang.String)'), 'open(java.lang.String)');
  assert.equal(decodeAnchor('#open%28java.lang.String%29'), 'open(java.lang.String)');
  assert.equal(decodeAnchor(''), '');
});

test('finds an exact Javadoc id with parentheses and an ellipsis', () => {
  assert.equal(
    hasAnchor(JAVADOC, 'shouldHave(com.codeborne.selenide.WebElementCondition...)'),
    true
  );
});

test('does not match a different overload or a prefix of another id', () => {
  assert.equal(hasAnchor(JAVADOC, 'shouldHave(com.codeborne.selenide.WebElementCondition)'), false);
  assert.equal(hasAnchor(JAVADOC, 'text(java.lang.String)'), false);
  assert.equal(hasAnchor(JAVADOC, 'textCaseSensitive'), false);
});

test('finds a GitHub README heading through its escaped user-content id', () => {
  assert.equal(hasAnchor(GITHUB_BLOB, 'features', { github: true }), true);
  assert.equal(hasAnchor(GITHUB_BLOB, 'changelog', { github: true }), false);
  assert.equal(hasAnchor(GITHUB_BLOB, 'features'), false);
});

test('finds a Javadoc constructor id, which the page writes HTML-escaped', () => {
  // Observed on SelenideDriver.html: the link is #%3Cinit%3E(...) and the id is &lt;init&gt;(...)
  const html = '<section id="&lt;init&gt;(com.codeborne.selenide.Config)">';
  assert.equal(hasAnchor(html, decodeAnchor('#%3Cinit%3E(com.codeborne.selenide.Config)')), true);
  assert.equal(hasAnchor(html, '<init>(com.codeborne.selenide.Config,java.util.List)'), false);
});
