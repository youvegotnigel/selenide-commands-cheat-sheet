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
import report from './report.js';
import framework from './framework.js';
import remote from './remote.js';
import pattern from './pattern.js';
import cli from './cli.js';
import appiumSetup from './appium-setup.js';
import mobileSelector from './mobile-selector.js';
import mobileGesture from './mobile-gesture.js';
import mobileContext from './mobile-context.js';

/** @type {Category[]} */
export const categories = [
  // Setup
  config,
  navigation,
  remote,
  cli,
  // Finding
  selector,
  collection,
  // Acting
  action,
  windowCat,
  file,
  javascript,
  // Debugging
  report,
  network,
  // Checking
  condition,
  wait,
  // Structure
  pageObject,
  pattern,
  framework,
  // Mobile
  appiumSetup,
  mobileSelector,
  mobileGesture,
  mobileContext,
];
