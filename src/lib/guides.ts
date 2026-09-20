/**
 * 指南注册表——单一来源。
 * /guides 索引页、sitemap、各指南底部的「Related guides」区块都从这里读取，
 * 新增指南只需在数组里加一条。
 */
export type Guide = {
  slug: string;
  title: string;
  /** 一句话摘要，用于索引页与内链卡片 */
  summary: string;
  /** 目标关键词，便于日后核对覆盖 */
  keyword: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "how-loan-amortization-works",
    title: "How loan amortization works",
    summary:
      "The formula term by term, a worked month-by-month example, when principal finally overtakes interest, and why extra early payments save so much.",
    keyword: "how does loan amortization work",
  },
  {
    slug: "how-to-compare-loan-offers",
    title: "How to compare loan offers",
    summary:
      "Why the headline rate is not the comparison, the three numbers that are, and how to work out whether discount points are worth paying.",
    keyword: "how to compare loan offers",
  },
  {
    slug: "apr-vs-interest-rate",
    title: "APR vs interest rate",
    summary:
      "What each number actually measures, what APR leaves out, and the cases where comparing APR will lead you to the wrong lender.",
    keyword: "apr vs interest rate",
  },
  {
    slug: "biweekly-payments-guide",
    title: "Biweekly payments: what they really save",
    summary:
      "How paying half your mortgage every two weeks works, the exact saving on a worked loan, and the fees and pitfalls to avoid first.",
    keyword: "biweekly mortgage payments",
  },
  {
    slug: "refinance-break-even-point",
    title: "Refinance break-even point",
    summary:
      "How to work out the month a refinance pays for itself, why a shorter term can raise your payment and still save six figures, and when not to refinance.",
    keyword: "refinance break even point",
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** 返回除当前页之外的指南，用于底部内链 */
export function relatedGuides(currentSlug: string, limit = 3): Guide[] {
  return GUIDES.filter((g) => g.slug !== currentSlug).slice(0, limit);
}
