/**
 * 计算器矩阵注册表——单一来源。
 * /calculators 中心页、sitemap、各计算器页底部的「Related calculators」
 * 都从这里读取，新增一个计算器只需在数组里加一条 + 建一个页面。
 */
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
  },
  {
    slug: "auto-loan-calculator",
    title: "Auto loan calculator",
    h1: "Auto Loan Calculator",
    summary:
      "Work out the amount financed from price, down payment, trade-in and sales tax, then see what the monthly payment really costs over 48, 60 or 72 months.",
    keyword: "auto loan calculator",
    tag: "Vehicle",
  },
  {
    slug: "personal-loan-calculator",
    title: "Personal loan calculator",
    h1: "Personal Loan Calculator",
    summary:
      "Unsecured borrowing at the rates lenders actually quote, with the origination fee maths that decides whether the money is worth taking.",
    keyword: "personal loan calculator",
    tag: "Unsecured",
  },
  {
    slug: "student-loan-calculator",
    title: "Student loan calculator",
    h1: "Student Loan Calculator",
    summary:
      "Payment and total interest on a student loan, plus what a modest extra monthly payment does to the payoff date — the cheapest interest saving there is.",
    keyword: "student loan calculator",
    tag: "Education",
  },
  {
    slug: "amortization-schedule",
    title: "Amortization schedule",
    h1: "Amortization Schedule Calculator",
    summary:
      "The full month-by-month and year-by-year breakdown of a fixed-rate loan, and how much interest an extra payment removes from the end of it.",
    keyword: "amortization schedule calculator",
    tag: "Breakdown",
  },
];

export function calculatorBySlug(slug: string): Calculator | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

/** 除当前页之外的计算器，用于底部内链 */
export function relatedCalculators(
  currentSlug: string,
  limit = 4
): Calculator[] {
  return CALCULATORS.filter((c) => c.slug !== currentSlug).slice(0, limit);
}
