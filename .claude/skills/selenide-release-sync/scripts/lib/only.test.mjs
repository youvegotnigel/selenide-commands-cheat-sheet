import { test } from 'node:test';
import assert from 'node:assert/strict';
import { categoryFilter } from './only.mjs';

const windows = { cat: 'Windows, Frames, Alerts', cls: 'window' };
const conditions = { cat: 'Conditions', cls: 'condition' };

test('no --only selects every category', () => {
  const keep = categoryFilter(undefined);
  assert.equal(keep(windows), true);
  assert.equal(keep(conditions), true);
});

test('a category name containing commas is matched whole', () => {
  const keep = categoryFilter('Windows, Frames, Alerts');
  assert.equal(keep(windows), true);
  assert.equal(keep(conditions), false);
});

test('a comma-separated list of names or cls values selects each of them', () => {
  const keep = categoryFilter('window,Conditions');
  assert.equal(keep(windows), true);
  assert.equal(keep(conditions), true);
  assert.equal(keep({ cat: 'Files', cls: 'file' }), false);
});
