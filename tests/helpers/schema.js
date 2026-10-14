// Pure validators for the js/data categories. Each takes the categories array
// and returns a list of human-readable problems (empty when valid). They are
// tested against hand-written fixtures in schema-rules.spec.js and applied to
// the real data in data-integrity.spec.js. Rules: spec section 4.

export const ITEM_FIELDS = ['name', 'level', 'platform', 'desc', 'tip', 'docs', 'code'];
export const LEVELS = ['beginner', 'intermediate', 'advanced'];
export const PLATFORMS = ['web', 'mobile', 'both'];
export const QUICK_FILTERS = ['all', 'beginner', 'popular', 'mobile'];

const eachItem = (categories, fn) =>
  categories.flatMap((cat) => cat.items.flatMap((item) => fn(item, cat)));

export function categoryFieldProblems(categories) {
  return categories.flatMap((cat, i) => {
    const problems = [];
    if (!cat.cat) problems.push(`categories[${i}] missing "cat"`);
    if (!cat.cls) problems.push(`categories[${i}] missing "cls"`);
    if (!cat.color) problems.push(`categories[${i}] missing "color"`);
    if (!Array.isArray(cat.items) || cat.items.length === 0)
      problems.push(`categories[${i}] missing or empty "items"`);
    return problems;
  });
}

export function missingFieldProblems(categories) {
  return eachItem(categories, (item, cat) =>
    ITEM_FIELDS.flatMap((field) => {
      const value = item[field];
      if (value === undefined || value === null || value === '')
        return [`"${item.name || '?'}" in "${cat.cat}" is missing "${field}"`];
      if (typeof value === 'string' && value.trim() === '')
        return [`"${item.name || '?'}" in "${cat.cat}" has blank "${field}"`];
      return [];
    })
  );
}

export function levelProblems(categories) {
  return eachItem(categories, (item) =>
    LEVELS.includes(item.level) ? [] : [`"${item.name}" has invalid level: "${item.level}"`]
  );
}

export function platformProblems(categories) {
  return eachItem(categories, (item) =>
    PLATFORMS.includes(item.platform)
      ? []
      : [`"${item.name}" has invalid platform: "${item.platform}"`]
  );
}

const DOCS_GITHUB_PATH = /^\/(selenide|selenide-examples)\//;

export function docsProblems(categories) {
  return eachItem(categories, (item, cat) => {
    let url;
    try {
      url = new URL(item.docs);
    } catch {
      return [`"${item.name}" in "${cat.cat}" has an unparseable docs URL: "${item.docs}"`];
    }
    const allowed =
      url.protocol === 'https:' &&
      (url.hostname === 'selenide.org' ||
        (url.hostname === 'github.com' && DOCS_GITHUB_PATH.test(url.pathname)));
    return allowed
      ? []
      : [`"${item.name}" in "${cat.cat}" has a docs URL outside the allowlist: "${item.docs}"`];
  });
}

export function codeLengthProblems(categories) {
  return eachItem(categories, (item) =>
    String(item.code ?? '').trim().length >= 20
      ? []
      : [`"${item.name}" has a suspiciously short code snippet: "${String(item.code).trim()}"`]
  );
}

export function duplicateNameProblems(categories) {
  const problems = [];
  categories.forEach((cat) => {
    const seen = new Set();
    cat.items.forEach((item) => {
      if (seen.has(item.name)) problems.push(`Duplicate "${item.name}" in category "${cat.cat}"`);
      seen.add(item.name);
    });
  });
  const owner = new Map();
  categories.forEach((cat) =>
    new Set(cat.items.map((i) => i.name)).forEach((name) => {
      if (owner.has(name) && owner.get(name) !== cat.cat)
        problems.push(`"${name}" appears in more than one category`);
      else owner.set(name, cat.cat);
    })
  );
  return problems;
}

export function colorProblems(categories) {
  return categories.flatMap((cat) =>
    /^#[0-9a-fA-F]{6}$/.test(cat.color)
      ? []
      : [`Category "${cat.cat}" has invalid color: "${cat.color}"`]
  );
}

export function filterClashProblems(categories) {
  return categories.flatMap((cat) => {
    const clash = QUICK_FILTERS.find((f) => f === String(cat.cat).toLowerCase());
    return clash ? [`Category "${cat.cat}" clashes with the quick filter "${clash}"`] : [];
  });
}

export function nameCharProblems(categories) {
  return eachItem(categories, (item, cat) =>
    /[<>]/.test(item.name)
      ? [`"${item.name}" in "${cat.cat}" contains "<" or ">" (names are rendered as HTML)`]
      : []
  );
}

export function dashProblems(categories) {
  return eachItem(categories, (item, cat) =>
    ITEM_FIELDS.flatMap((field) => {
      const value = item[field];
      if (typeof value !== 'string') return [];
      const found = [];
      if (value.includes('—'))
        found.push(`"${item.name}" in "${cat.cat}" has an em-dash in "${field}"`);
      if (value.includes('–'))
        found.push(`"${item.name}" in "${cat.cat}" has an en-dash in "${field}"`);
      return found;
    })
  );
}
