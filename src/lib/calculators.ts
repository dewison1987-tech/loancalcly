/**
 * 计算器矩阵注册表——单一来源。
 * /calculators 中心页、sitemap、各计算器页底部的「Related calculators」
 * 都从这里读取，新增一个计算器只需在数组里加一条 + 建一个页面。
 *
 * ⚠️ 与 guides.ts 同一约定：相关性靠 `related` 显式声明，不靠数组顺序。
 * **声明即渲染**：计算器页每条 `related` 恰好 **3 个指南 slug + 4 个计算器
 * slug，共 7 条**，顺序即展示顺序；指南页则是 4 指南 + 3 计算器。
 * 写满数量是为了不留兜底口子 —— `pick()` 在声明不足时会按注册表顺序补齐，
 * 会把不相干的页面静默塞进来（第四批实测过）。
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
    // 三条指南各自对应这台计算器的一类非本金输入：
    //   首付金额 / 房产税 + 保险（进托管）/ 月供里的 PMI 项
    related: [
      "how-much-down-payment-do-i-need",
      "what-is-an-escrow-account",
      "how-to-remove-pmi",
      "home-affordability-calculator",
      // 第七批：月供算完，下一个真实问题通常是租还是买
      "rent-vs-buy-calculator",
      "personal-loan-calculator",
      "auto-loan-calculator",
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
    // 首付是这台计算器最关键的一个输入，所以第一顺位给首付指南
    // 第六批：这台计算器回答的就是「能借多少」，而预批与预资格认定的
    // 差额正是它的主题 → 挤掉 rent-vs-buy（那篇自己已有充足入链）
    related: [
      "how-much-house-can-i-afford",
      "how-much-down-payment-do-i-need",
      "mortgage-preapproval-vs-prequalification",
      "mortgage-calculator",
      // 第七批：「买得起多少」之后紧接着就是「该不该买」。
      // 挤掉 amortization-schedule（26 条入链，全站最富余）。
      "rent-vs-buy-calculator",
      "personal-loan-calculator",
      "auto-loan-calculator",
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
      "how-to-compare-loan-offers",
      "personal-loan-calculator",
      "amortization-schedule",
      "student-loan-calculator",
      "mortgage-calculator",
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
    // 无抵押借款是「动用房产净值」的替代选项，所以第三条是
    // cash-out vs HELOC —— 那篇正在比较「为了拿到 $60,000 该走哪条路」
    // 第六批：债务合并是个人贷最典型的用途，与有抵押方案直接对照
    // → 挤掉 how-to-compare-loan-offers（比较方法已有别的入口）
    related: [
      "apr-vs-interest-rate",
      "debt-consolidation-vs-home-equity-loan",
      "cash-out-refinance-vs-heloc",
      "auto-loan-calculator",
      "student-loan-calculator",
      "mortgage-calculator",
      "amortization-schedule",
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
      "how-to-pay-off-a-loan-early",
      "how-loan-amortization-works",
      "apr-vs-interest-rate",
      "amortization-schedule",
      "personal-loan-calculator",
      "mortgage-calculator",
      "auto-loan-calculator",
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
      "biweekly-payments-guide",
      "mortgage-calculator",
      "personal-loan-calculator",
      "auto-loan-calculator",
      "student-loan-calculator",
    ],
    updated: "2026-09-26",
  },
  {
    slug: "rent-vs-buy-calculator",
    title: "Rent vs buy calculator",
    h1: "Rent vs Buy Calculator",
    summary:
      "The full cost of owning against renting and investing the difference, with the year owning overtakes — and a sensitivity check on the two assumptions the answer actually rests on.",
    keyword: "rent vs buy calculator",
    tag: "Property",
    cluster: "property",
    // 三篇指南各对应这台计算器的一类输入或一种读法：
    //   rent-vs-buy 是同主题的静态版本（同参数、同结论，第 11 年）
    //   how-much-house-can-i-afford 决定「买得起多少」，本页决定「该不该买」
    //   how-loan-amortization-works 解释临界年为什么那么晚（早期几乎全是利息）
    // 计算器四位：可负担性（前置问题）、房贷（月供本体）、摊销（余额怎么降）、
    // 个人贷（把差额投出去时常见的现金贷对照）
    related: [
      "rent-vs-buy",
      "how-much-house-can-i-afford",
      "how-loan-amortization-works",
      "home-affordability-calculator",
      "mortgage-calculator",
      "amortization-schedule",
      "personal-loan-calculator",
    ],
    updated: "2026-11-10",
  },
];

export function calculatorBySlug(slug: string): Calculator | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}
