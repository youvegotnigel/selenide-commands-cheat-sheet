// Category selection for check-docs-links.mjs --only. Category names may contain
// commas ("Windows, Frames, Alerts"), so the whole value is first tried as one
// name; otherwise it is a comma-separated list of names or cls values.
export function categoryFilter(only) {
  if (!only) return () => true;
  const parts = only
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return ({ cat, cls }) => cat === only || parts.includes(cat) || parts.includes(cls);
}
