// Looks up one entry by category and name through the page global. Content
// tests compare the result against values copied from the sources jar.
export const itemIn = (page, cat, name) =>
  page.evaluate(
    ([c, n]) => window.categories.find((x) => x.cat === c)?.items.find((i) => i.name === n) ?? null,
    [cat, name]
  );
