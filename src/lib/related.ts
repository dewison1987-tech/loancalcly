/**
 * 内链解析器 —— 全站「相关页面」的唯一出口。
 *
 * 存在的理由：2026-09-26 审查扩页计划时发现三处真实缺陷
 *   1. `CalculatorFooter` 把**计算器 slug** 传给只认指南 slug 的
 *      `relatedGuides()`，排除自身的过滤条件永远命中 0 条 → 5 个计算器页
 *      推荐的是同一组指南（实测确认）。
 *   2. 相关项用 `.slice(0, limit)` 按注册表顺序取 → 数组靠后的页面
 *      永远拿不到内链，扩到 20+ 页时新页面即成孤岛。
 *   3. 指南页没有「相关计算器」区块，白丢一跳。
 *
 * 现在两端共用这一个解析器，且相关性来自注册表里的 `related` 显式声明
 * （可跨指南 / 计算器），所以「传错 slug」不再可能静默降级成「取前 N 条」——
 * 认不出来就补同簇，再认不出来就按注册顺序兜底，行为是确定性的。
 */
import { GUIDES, type Guide } from "./guides";
import { CALCULATORS, type Calculator } from "./calculators";

const GUIDE_BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));
const CALC_BY_SLUG = new Map(CALCULATORS.map((c) => [c.slug, c]));

/** 当前页显式声明的相关 slug（不论它是指南还是计算器） */
function declaredSlugs(currentSlug: string): string[] {
  return (
    GUIDE_BY_SLUG.get(currentSlug)?.related ??
    CALC_BY_SLUG.get(currentSlug)?.related ??
    []
  );
}

/** 当前页所属的簇（用于声明不足时补齐） */
function ownCluster(currentSlug: string): string | undefined {
  return (
    GUIDE_BY_SLUG.get(currentSlug)?.cluster ??
    CALC_BY_SLUG.get(currentSlug)?.cluster
  );
}

/**
 * 取 `limit` 条相关页面。
 * 顺序：显式声明的（按声明顺序）→ 同簇未选中的 → 其余（按注册顺序）。
 * 全程排除当前页自身，绝不返回重复项。
 */
function pick<T extends { slug: string; cluster: string }>(
  currentSlug: string,
  pool: T[],
  limit: number
): T[] {
  const bySlug = new Map(pool.map((x) => [x.slug, x]));

  const declared = declaredSlugs(currentSlug)
    .map((s) => bySlug.get(s))
    .filter((x): x is T => Boolean(x))
    .slice(0, limit);

  if (declared.length >= limit) return declared;

  const taken = new Set(declared.map((x) => x.slug));
  taken.add(currentSlug);
  const cluster = ownCluster(currentSlug);

  const sameCluster = pool.filter(
    (x) => !taken.has(x.slug) && x.cluster === cluster
  );
  const rest = pool.filter((x) => !taken.has(x.slug) && x.cluster !== cluster);

  return [...declared, ...sameCluster, ...rest].slice(0, limit);
}

/** 与 `currentSlug` 相关的指南（`currentSlug` 本身可以是计算器） */
export function relatedGuides(currentSlug: string, limit = 3): Guide[] {
  return pick(currentSlug, GUIDES, limit);
}

/** 与 `currentSlug` 相关的计算器（`currentSlug` 本身可以是指南） */
export function relatedCalculators(
  currentSlug: string,
  limit = 4
): Calculator[] {
  return pick(currentSlug, CALCULATORS, limit);
}
