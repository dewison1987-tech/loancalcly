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
 * ⚠️ **声明即渲染（2026-10-03 收紧）**：每条 `related` 必须恰好是
 * **4 个指南 slug + 3 个计算器 slug，共 7 条**，顺序即展示顺序。
 * 之所以要卡死数量：`related.ts` 的 `pick()` 在声明不足时会**兜底补齐**
 * （同簇优先，然后按注册表顺序）。兜底本身是安全网，但它会静默把内容
 * 塞进页面 —— 第四批实测发现 `auto-loan-calculator` 被兜底注入到
 * biweekly / closing-costs / rent-vs-buy 等毫不相关的指南页里，
 * 原因只是它在 `CALCULATORS` 数组里排得靠前。**这正是「拓扑从数组位置里
 * 长出来」的同一个病**，只不过这次是从另一个方向长。
 * 所以：想推荐什么就写下来，数量写满，不留兜底的口子。
 */
export type GuideCluster =
  | "borrowing-basics"
  | "mortgage"
  /** 买卖决策（rent-vs-buy）—— 刻意独立成簇，避免全站关键词困在房贷簇内循环 */
  | "buying"
  /** 房屋净值类产品（HELOC / home equity loan） */
  | "equity";

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
      "how-to-pay-off-a-loan-early",
      "15-vs-30-year-mortgage",
      "biweekly-payments-guide",
      "heloc-vs-home-equity-loan",
      "amortization-schedule",
      "mortgage-calculator",
      "personal-loan-calculator",
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
      "how-loan-amortization-works",
      "heloc-vs-home-equity-loan",
      "mortgage-calculator",
      "personal-loan-calculator",
      "auto-loan-calculator",
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
      "how-loan-amortization-works",
      "heloc-vs-home-equity-loan",
      "personal-loan-calculator",
      "auto-loan-calculator",
      "mortgage-calculator",
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
      "15-vs-30-year-mortgage",
      "refinance-break-even-point",
      "how-to-refinance-a-mortgage",
      "mortgage-calculator",
      "amortization-schedule",
      "personal-loan-calculator",
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
      "how-to-refinance-a-mortgage",
      "closing-costs-explained",
      "15-vs-30-year-mortgage",
      "how-to-compare-loan-offers",
      "mortgage-calculator",
      "amortization-schedule",
      "home-affordability-calculator",
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
      "how-to-remove-pmi",
      "debt-to-income-ratio",
      "how-much-house-can-i-afford",
      "rent-vs-buy",
      "mortgage-calculator",
      "home-affordability-calculator",
      "amortization-schedule",
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
      "debt-to-income-ratio",
      "15-vs-30-year-mortgage",
      "how-to-compare-loan-offers",
      "rent-vs-buy",
      "home-affordability-calculator",
      "mortgage-calculator",
      "amortization-schedule",
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
      "how-much-house-can-i-afford",
      "15-vs-30-year-mortgage",
      "how-to-pay-off-a-loan-early",
      "fha-vs-conventional-loan",
      "mortgage-calculator",
      "home-affordability-calculator",
      "amortization-schedule",
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
      "how-to-remove-pmi",
      "fha-vs-conventional-loan",
      "15-vs-30-year-mortgage",
      "home-affordability-calculator",
      "mortgage-calculator",
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
      "how-to-refinance-a-mortgage",
      "how-to-compare-loan-offers",
      "refinance-break-even-point",
      "apr-vs-interest-rate",
      "mortgage-calculator",
      "personal-loan-calculator",
      "amortization-schedule",
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
      "how-loan-amortization-works",
      "biweekly-payments-guide",
      "heloc-vs-home-equity-loan",
      "how-to-compare-loan-offers",
      "amortization-schedule",
      "student-loan-calculator",
      "mortgage-calculator",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "how-to-refinance-a-mortgage",
    title: "How to refinance a mortgage",
    summary:
      "Why a lower rate can still cost you more: a 6.50% to 6.00% refinance cuts the payment by $371.38 and adds $93,849 of interest, while the same rate on a 20-year term saves $17,788.",
    keyword: "how to refinance a mortgage",
    cluster: "mortgage",
    related: [
      "refinance-break-even-point",
      "closing-costs-explained",
      "15-vs-30-year-mortgage",
      "how-to-compare-loan-offers",
      "mortgage-calculator",
      "amortization-schedule",
      "home-affordability-calculator",
    ],
    updated: "2026-10-03",
  },
  {
    slug: "fha-vs-conventional-loan",
    title: "FHA vs conventional loan",
    summary:
      "The same 6.50% rate on both products, so only the structure differs: FHA's 3.5% down payment saves $5,250 at closing and costs $72.95 a month, and the down payment advantage is exhausted after 71.97 months.",
    keyword: "fha vs conventional loan",
    cluster: "mortgage",
    related: [
      "how-to-remove-pmi",
      "debt-to-income-ratio",
      "how-much-house-can-i-afford",
      "15-vs-30-year-mortgage",
      "mortgage-calculator",
      "home-affordability-calculator",
      "amortization-schedule",
    ],
    updated: "2026-10-03",
  },
  {
    slug: "rent-vs-buy",
    title: "Rent vs buy: the break-even year",
    summary:
      "Buying is $38,538 more expensive than renting in year one and does not catch up until year 11. The full model, and how the answer moves when appreciation changes.",
    keyword: "rent vs buy",
    cluster: "buying",
    related: [
      "how-much-house-can-i-afford",
      "15-vs-30-year-mortgage",
      "debt-to-income-ratio",
      "how-to-pay-off-a-loan-early",
      "home-affordability-calculator",
      "mortgage-calculator",
      "amortization-schedule",
    ],
    updated: "2026-10-03",
  },
  {
    slug: "heloc-vs-home-equity-loan",
    title: "HELOC vs home equity loan",
    summary:
      "The same $60,000 at the same 8.00% costs either $27,356 or $108,447 in interest. What the two products share, where they diverge, and why the draw period drives the whole bill.",
    keyword: "heloc vs home equity loan",
    cluster: "equity",
    related: [
      "apr-vs-interest-rate",
      "how-to-compare-loan-offers",
      "how-to-pay-off-a-loan-early",
      "how-loan-amortization-works",
      "personal-loan-calculator",
      "amortization-schedule",
      "mortgage-calculator",
    ],
    updated: "2026-10-03",
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
