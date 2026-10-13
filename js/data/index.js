/**
 * @typedef {{ name: string, level: 'beginner'|'intermediate'|'advanced', platform: 'web'|'mobile'|'both', desc: string, tip: string, docs: string, code: string }} Item
 * @typedef {{ cat: string, cls: string, color: string, items: Item[] }} Category
 */

import config from './config.js';
import navigation from './navigation.js';
import selector from './selector.js';
import action from './action.js';
import condition from './condition.js';

/** @type {Category[]} */
export const categories = [config, navigation, selector, action, condition];
