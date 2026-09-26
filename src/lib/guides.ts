/**
 * 指南注册表——单一来源。
 * /guides 索引页、sitemap、各页底部的「Related guides」区块都从这里读取，
 * 新增指南只需在数组里加一条。
 *
 * ⚠️ 相关性靠 `related` **显式声明**，不靠数组顺序。
 * 旧实现是 `GUIDES.filter(...).slice(0, limit)` —— 按注册表顺序取，
 * 2026-09-26 实测后果：每个页面推荐的都是同一批页面，数组靠后的新指南
 * 拿不到任何内链。扩到 20+ 页时这会直接把新页面变成孤岛。
 * 拓扑结构不能从数组位置里长出来，必须是人写下来的事实。
 *
 * ⚠️ 声明顺序有语义：`related` 里属于同一类型的项会**按声明顺序**取前 N 条
 * （指南页取 4 条相关指南 + 3 个相关计算器，计算器页取 3 条相关指南 + 4 个
 * 相关计算器）。想让某个页面被推荐出来，就要把它排在该类型的前 N 位。
 */
export type GuideCluster = "borrowing-basics" | "mortgage";

export type Guide = {
  slug: string;
  title: string;
  /** 一句话摘要，用于索引页与内链卡片 */
  summary: string;
  /** 目标关键词，便于日后核对覆盖 */
  keyword: string;
  /** 主题簇。`related` 声明不足时用它补齐，也便于核对内容覆盖度 */
  cluster: GuideCluster;
  /**
   * 显式声明的相关页面，**可跨「指南 / 计算器」两类**（用 slug 引用）。
   * 排列顺序即展示优先级；`<ArticleFooter>` / `<CalculatorFooter>` 会
   * 从中按类型筛选后展示。引用一个不存在的 slug 会被静默忽略。
   */
  related: string[];
  /** 内容最后一次实质变更日（YYYY-MM-DD）。sitemap 的 lastModified 取此值。 */
  updated: string;
};

export const GUIDES: Guide[] = [
  {
    slug: "how-loan-amortization-works",
    title: "How loan amortization works",
    summary:
      "The formula term by term, a worked month-by-month example, when principal finally overtakes interest, and why extra early payments save so much.",
    keyword: "how does loan amortization work",
    cluster: "borrowing-basics",
    related: [
      "amortization-schedule",
      "how-to-pay-off-a-loan-early",
      "mortgage-calculator",
      "15-vs-30-year-mortgage",
      "biweekly-payments-guide",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "how-to-compare-loan-offers",
    title: "How to compare loan offers",
    summary:
      "Why the headline rate is not the comparison, the three numbers that are, and how to work out whether discount points are worth paying.",
    keyword: "how to compare loan offers",
    cluster: "borrowing-basics",
    related: [
      "apr-vs-interest-rate",
      "closing-costs-explained",
      "mortgage-calculator",
      "personal-loan-calculator",
      "how-loan-amortization-works",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "apr-vs-interest-rate",
    title: "APR vs interest rate",
    summary:
      "What each number actually measures, what APR leaves out, and the cases where comparing APR will lead you to the wrong lender.",
    keyword: "apr vs interest rate",
    cluster: "borrowing-basics",
    related: [
      "how-to-compare-loan-offers",
      "closing-costs-explained",
      "personal-loan-calculator",
      "auto-loan-calculator",
      "how-loan-amortization-works",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "biweekly-payments-guide",
    title: "Biweekly payments: what they really save",
    summary:
      "How paying half your mortgage every two weeks works, the exact saving on a worked loan, and the fees and pitfalls to avoid first.",
    keyword: "biweekly mortgage payments",
    cluster: "mortgage",
    related: [
      "how-to-pay-off-a-loan-early",
      "mortgage-calculator",
      "amortization-schedule",
      "15-vs-30-year-mortgage",
      "refinance-break-even-point",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "refinance-break-even-point",
    title: "Refinance break-even point",
    summary:
      "How to work out the month a refinance pays for itself, why a shorter term can raise your payment and still save six figures, and when not to refinance.",
    keyword: "refinance break even point",
    cluster: "mortgage",
    related: [
      "closing-costs-explained",
      "mortgage-calculator",
      "15-vs-30-year-mortgage",
      "how-to-compare-loan-offers",
      "apr-vs-interest-rate",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "15-vs-30-year-mortgage",
    title: "15-year vs 30-year mortgage",
    summary:
      "The same loan on both terms, side by side: what the shorter term saves, what it costs each month, and the affordability test that decides it.",
    keyword: "15 vs 30 year mortgage",
    cluster: "mortgage",
    related: [
      "mortgage-calculator",
      "home-affordability-calculator",
      "how-to-remove-pmi",
      "debt-to-income-ratio",
      "how-much-house-can-i-afford",
      "refinance-break-even-point",
      "biweekly-payments-guide",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "how-much-house-can-i-afford",
    title: "How much house can I afford?",
    summary:
      "Why the price a lender approves is not the price you should pay, how the debt-to-income rules work, and what the monthly figure has to cover beyond principal and interest.",
    keyword: "how much house can i afford",
    cluster: "mortgage",
    related: [
      "home-affordability-calculator",
      "debt-to-income-ratio",
      "mortgage-calculator",
      "15-vs-30-year-mortgage",
      "how-to-compare-loan-offers",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "how-to-remove-pmi",
    title: "How to remove PMI from your mortgage",
    summary:
      "Why mortgage insurance ends when the balance crosses a threshold rather than after a fixed number of years, what it costs on a worked loan, and how a larger down payment or extra payments bring the date forward.",
    keyword: "how to remove pmi",
    cluster: "mortgage",
    related: [
      "mortgage-calculator",
      "how-much-house-can-i-afford",
      "home-affordability-calculator",
      "15-vs-30-year-mortgage",
      "amortization-schedule",
      "how-to-pay-off-a-loan-early",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "debt-to-income-ratio",
    title: "Debt-to-income ratio",
    summary:
      "How front-end and back-end ratios are built, what counts towards them, where the commonly quoted ceilings come from, and what each ceiling buys in house price.",
    keyword: "debt to income ratio",
    cluster: "mortgage",
    related: [
      "how-much-house-can-i-afford",
      "home-affordability-calculator",
      "mortgage-calculator",
      "how-to-remove-pmi",
      "personal-loan-calculator",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "closing-costs-explained",
    title: "Closing costs explained",
    summary:
      "The three groups on a closing bill, what can be negotiated and what cannot, and the arithmetic of discount points — including why buying twice as many points barely changes the break-even month.",
    keyword: "closing costs explained",
    cluster: "mortgage",
    related: [
      "how-to-compare-loan-offers",
      "refinance-break-even-point",
      "apr-vs-interest-rate",
      "mortgage-calculator",
      "15-vs-30-year-mortgage",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "how-to-pay-off-a-loan-early",
    title: "How to pay off a loan early",
    summary:
      "Why the same extra payment saves several times more interest early in the loan than late, worked through a mortgage and a car loan, and the cases where paying ahead is the wrong choice.",
    keyword: "how to pay off a loan early",
    cluster: "borrowing-basics",
    related: [
      "amortization-schedule",
      "how-loan-amortization-works",
      "student-loan-calculator",
      "mortgage-calculator",
      "biweekly-payments-guide",
    ],
    updated: "2026-09-26",
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
