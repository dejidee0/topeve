// lib/utils/searchUtils.js
export function fuzzySearch(products, query) {
  if (!query || !query.trim()) return products;
  const q = query.trim().toLowerCase();
  const tokens = q.split(/\s+/);

  function scoreProduct(p) {
    let score = 0;
    const name = (p.name || "").toLowerCase();
    const desc = (p.description || "").toLowerCase();
    const tags = (p.tags || []).join(" ").toLowerCase();
    const material = (p.material || "").toLowerCase();
    const color = (p.color || "").toLowerCase();
    const category = (p.category || "").toLowerCase();
    const sub = (p.subcategory || "").toLowerCase();

    for (const t of tokens) {
      if (!t) continue;
      if (name.includes(t)) score += 40;
      if (tags.includes(t)) score += 20;
      if (desc.includes(t)) score += 10;
      if (material.includes(t)) score += 8;
      if (color.includes(t)) score += 8;
      if (category.includes(t) || sub.includes(t)) score += 12;
      if (name.startsWith(t)) score += 12;
      if (tags.startsWith(t)) score += 6;
    }

    if (p.tags && p.tags.includes("new")) score += 6;
    if (p.tags && p.tags.includes("best-seller")) score += 8;

    return score;
  }

  const scored = products
    .map((p) => ({ p, s: scoreProduct(p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.p);

  if (scored.length === 0) {
    return products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.tags || []).join(" ").toLowerCase().includes(q) ||
        false
    );
  }

  return scored;
}
