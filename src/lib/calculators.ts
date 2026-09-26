/**
 * 计算器矩阵注册表——单一来源。
 * /calculators 中心页、sitemap、各计算器页底部的「Related calculators」
 * 都从这里读取，新增一个计算器只需在数组里加一条 + 建一个页面。
 *
 * ⚠️ 与 guides.ts 同一约定：相关性靠 `related` 显式声明，不靠数组顺序。
 * 声明顺序有语义：计算器页取 3 条相关指南 + 4 个相关计算器，指南页取
 * 4 条相关指南 + 3 个相关计算器，同一类型内按声明顺序取前 N 条。
 */
export type CalculatorCluster =
  | "property"
  | "vehicle"
  | "unsecured"
  | "education"
  | "breakdown";

export type Calculator = {
  slug: string;
  /** 导航 / 卡片上的短标题 */
  title: string;
  /** 页面 H1 */
  h1: string;
  /** 一句话摘要，用于中心页卡片与内链 */
  summary: string;
  /** 目标关键词，便于日后核对覆盖 */
  keyword: string;
  /** 中心页上的分类标签 */
  tag: string;
  /** 主题簇。`related` 声明不足时用它补齐 */
  cluster: CalculatorCluster;
  /**
   * 显式声明的相关页面，**可跨「计算器 / 指南」两类**（用 slug 引用）。
   * ⚠️ 旧实现的一个真实 bug：`CalculatorFooter` 把**计算器 slug** 传给了
   * 只认指南 slug 的 `relatedGuides()`，过滤条件永远命中 0 条，
   * 于是 5 个计算器页推荐的是同一组指南（2026-09-26 实测确认）。
   * 现在两端共用一个解析器，不会再出现这种「传错 slug 静默降级」。
   */
  related: string[];
  /** 内容最后一次实质变更日（YYYY-MM-DD）。sitemap 的 lastModified 取此值。 */
  updated: string;
};

export const CALCULATORS: Calculator[] = [
  {
    slug: "mortgage-calculator",
    title: "Mortgage calculator",
    h1: "Mortgage Calculator",
    summary:
      "Monthly payment with property tax, home insurance, HOA and PMI folded in — the number that actually leaves your account, not just principal and interest.",
    keyword: "mortgage calculator",
    tag: "Property",
    cluster: "property",
    related: [
      "15-vs-30-year-mortgage",
      "how-to-remove-pmi",
      "how-much-house-can-i-afford",
      "debt-to-income-ratio",
      "home-affordability-calculator",
      "amortization-schedule",
      "biweekly-payments-guide",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "home-affordability-calculator",
    title: "Home affordability calculator",
    h1: "Home Affordability Calculator",
    summary:
      "Works the mortgage question backwards: start from your income, debts and down payment, and find the price you can actually carry rather than the price a lender will approve.",
    keyword: "how much house can i afford calculator",
    tag: "Property",
    cluster: "property",
    related: [
      "how-much-house-can-i-afford",
      "debt-to-income-ratio",
      "how-to-remove-pmi",
      "mortgage-calculator",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "auto-loan-calculator",
    title: "Auto loan calculator",
    h1: "Auto Loan Calculator",
    summary:
      "Work out the amount financed from price, down payment, trade-in and sales tax, then see what the monthly payment really costs over 48, 60 or 72 months.",
    keyword: "auto loan calculator",
    tag: "Vehicle",
    cluster: "vehicle",
    related: [
      "apr-vs-interest-rate",
      "how-to-pay-off-a-loan-early",
      "personal-loan-calculator",
      "how-to-compare-loan-offers",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "personal-loan-calculator",
    title: "Personal loan calculator",
    h1: "Personal Loan Calculator",
    summary:
      "Unsecured borrowing at the rates lenders actually quote, with the origination fee maths that decides whether the money is worth taking.",
    keyword: "personal loan calculator",
    tag: "Unsecured",
    cluster: "unsecured",
    related: [
      "apr-vs-interest-rate",
      "how-to-compare-loan-offers",
      "how-to-pay-off-a-loan-early",
      "auto-loan-calculator",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "student-loan-calculator",
    title: "Student loan calculator",
    h1: "Student Loan Calculator",
    summary:
      "Payment and total interest on a student loan, plus what a modest extra monthly payment does to the payoff date — the cheapest interest saving there is.",
    keyword: "student loan calculator",
    tag: "Education",
    cluster: "education",
    related: [
      "amortization-schedule",
      "how-to-pay-off-a-loan-early",
      "personal-loan-calculator",
      "how-loan-amortization-works",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "amortization-schedule",
    title: "Amortization schedule",
    h1: "Amortization Schedule Calculator",
    summary:
      "The full month-by-month and year-by-year breakdown of a fixed-rate loan, and how much interest an extra payment removes from the end of it.",
    keyword: "amortization schedule calculator",
    tag: "Breakdown",
    cluster: "breakdown",
    related: [
      "how-loan-amortization-works",
      "how-to-pay-off-a-loan-early",
      "mortgage-calculator",
      "biweekly-payments-guide",
    ],
    updated: "2026-09-26",
  },
];

export function calculatorBySlug(slug: string): Calculator | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}
