/**
 * @typedef {{ name: string, level: 'beginner'|'intermediate'|'advanced', platform: 'web'|'mobile'|'both', desc: string, tip: string, docs: string, code: string }} Item
 * @typedef {{ cat: string, cls: string, color: string, items: Item[] }} Category
 */

import config from './config.js';
import navigation from './navigation.js';
import selector from './selector.js';
import action from './action.js';
import condition from './condition.js';
import collection from './collection.js';
import wait from './wait.js';
import pageObject from './page-object.js';
import windowCat from './window.js';
import file from './file.js';
import network from './network.js';
import javascript from './javascript.js';
import framework from './framework.js';
import remote from './remote.js';

/** @type {Category[]} */
export const categories = [
  config,
  navigation,
  selector,
  action,
  condition,
  collection,
  wait,
  pageObject,
  windowCat,
  file,
  network,
  javascript,
  framework,
  remote,
];
