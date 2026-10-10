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
 *
 * ⚠️ **加完新页面必须回填既有页面的 `related`（2026-10-09 第五批）**：
 * 只往数组末尾追加一条新指南**不会让它自动出现在任何地方**。
 * `pick()` 只读被访问页面的 `related`，所以新页面要拿到内链，
 * 就必须有别的页面**写下来**指向它。
 * 回填时挤掉的是原本排在那条 `related` 里的页面 —— 判断依据是
 * 「这条关系是否比被挤掉的那条更近」，不是「把新页面塞进去就行」。
 *
 * ⚠️ **回填会消耗既有页面的入链预算（2026-10-11 第六批实测）**：
 * 把 `what-is-an-escrow-account` 从两处 `related` 里挤掉之后，
 * 它的指南间入链从 4 条降到 3 条（仍非孤儿）。第六批因此确立一条操作纪律：
 * **回填前先看清被挤掉的那条已经有多少入链** —— 入链多的页面可以挨刀，
 * 入链本来就少的页面（尤其同簇内的枢纽）应当尽量保留。
 * 拓扑脚本每次都要重新跑入链计数，不能沿用上一批的结论。
 */
export type GuideCluster =
  | "borrowing-basics"
  | "mortgage"
  /** 买卖决策与购房流程（rent-vs-buy / 首付 / 托管 / 预批 / 评估） */
  | "buying"
  /** 房屋净值类产品（HELOC / home equity loan / 净值口径） */
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
    // 第六批：预批 vs 预资格认定正是「拿哪份报价去比」的前置问题
    // → 挤掉最泛的 how-loan-amortization-works
    related: [
      "apr-vs-interest-rate",
      "fixed-vs-adjustable-rate-mortgage",
      "closing-costs-explained",
      "mortgage-preapproval-vs-prequalification",
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
    // 第六批：11.50% 无抵押 vs 8.00% 有抵押、期限还不同 ——
    // 这正是一个「利率低不等于便宜」的 APR 问题
    related: [
      "how-to-compare-loan-offers",
      "fixed-vs-adjustable-rate-mortgage",
      "closing-costs-explained",
      "debt-consolidation-vs-home-equity-loan",
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
      "cash-out-refinance-vs-heloc",
      "closing-costs-explained",
      "15-vs-30-year-mortgage",
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
      "fixed-vs-adjustable-rate-mortgage",
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
    // 第六批：「批多少」与「能承受多少」不是一个数 —— 这篇就是那个差额
    // → 挤掉 15-vs-30-year-mortgage（期限选择是另一件事）
    related: [
      "debt-to-income-ratio",
      "how-much-down-payment-do-i-need",
      "rent-vs-buy",
      "mortgage-preapproval-vs-prequalification",
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
    // 第六批：PMI 掉线的判据就是 LTV 跨过 80% ——
    // 与「净值三个口径」同一套算术 → 挤掉 how-much-house-can-i-afford
    related: [
      "how-much-down-payment-do-i-need",
      "how-to-pay-off-a-loan-early",
      "fha-vs-conventional-loan",
      "how-much-home-equity-do-i-have",
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
    // 第六批：承保端重新算的就是这个比率，所以预批与预资格认定的差额
    // 最终都落在 DTI 上 → 挤掉 what-is-an-escrow-account（与 DTI 无关）
    related: [
      "how-much-house-can-i-afford",
      "how-to-remove-pmi",
      "fha-vs-conventional-loan",
      "mortgage-preapproval-vs-prequalification",
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
    // 第六批：评估费本来就是结账单上的一笔，评估价低了还会改变整张单
    // → 挤掉 how-to-refinance-a-mortgage（那篇反向已经有链指过来）
    related: [
      "what-is-an-escrow-account",
      "how-to-compare-loan-offers",
      "refinance-break-even-point",
      "what-if-the-appraisal-is-low",
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
      "cash-out-refinance-vs-heloc",
      "biweekly-payments-guide",
      "heloc-vs-home-equity-loan",
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
    // 第六批：你能不能取现、能取多少，取决于净值口径
    // → 挤掉 fixed-vs-adjustable-rate-mortgage（那篇自己已有充足入链）
    related: [
      "refinance-break-even-point",
      "cash-out-refinance-vs-heloc",
      "closing-costs-explained",
      "how-much-home-equity-do-i-have",
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
      "how-much-down-payment-do-i-need",
      "debt-to-income-ratio",
      "how-much-house-can-i-afford",
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
      "how-much-down-payment-do-i-need",
      "what-is-an-escrow-account",
      "debt-to-income-ratio",
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
    // 第六批：equity 簇从 2 篇长到 4 篇，枢纽页优先指向同簇新页
    // → 挤掉 apr-vs-interest-rate 与 how-loan-amortization-works
    related: [
      "cash-out-refinance-vs-heloc",
      "how-much-home-equity-do-i-have",
      "debt-consolidation-vs-home-equity-loan",
      "how-to-compare-loan-offers",
      "personal-loan-calculator",
      "amortization-schedule",
      "mortgage-calculator",
    ],
    updated: "2026-10-03",
  },
  {
    slug: "how-much-down-payment-do-i-need",
    title: "How much down payment do I need?",
    summary:
      "What 3.5%, 10% and 20% down really cost: 20% down saves $105,249 over the life of the loan, while the $40,000 you keep back is worth an implied 10.72% a year over seven.",
    keyword: "how much down payment do i need",
    cluster: "buying",
    // 第六批：评估价低于合同价时，缺口的现金最先冲击的就是首付
    // → 挤掉 how-much-house-can-i-afford（那篇已从多处置入链）
    related: [
      "how-to-remove-pmi",
      "fha-vs-conventional-loan",
      "what-is-an-escrow-account",
      "what-if-the-appraisal-is-low",
      "home-affordability-calculator",
      "mortgage-calculator",
      "amortization-schedule",
    ],
    updated: "2026-10-09",
  },
  {
    slug: "what-is-an-escrow-account",
    title: "What is an escrow account?",
    summary:
      "What actually flows through it, how the cushion is set, and why a 10% tax rise costs $40 a month once the account settles but $80 a month in the first year.",
    keyword: "what is an escrow account",
    cluster: "buying",
    related: [
      "closing-costs-explained",
      "how-much-down-payment-do-i-need",
      "how-much-house-can-i-afford",
      "rent-vs-buy",
      "mortgage-calculator",
      "home-affordability-calculator",
      "amortization-schedule",
    ],
    updated: "2026-10-09",
  },
  {
    slug: "cash-out-refinance-vs-heloc",
    title: "Cash-out refinance vs HELOC",
    summary:
      "A cash-out refinance looks cheaper but reprices the loan you already had: $110,405 more interest in total, with a monthly payment $257.47 lower than the HELOC route.",
    keyword: "cash out refinance vs heloc",
    cluster: "equity",
    // 第六批：equity 簇枢纽，指向同簇两条新页
    // → 挤掉 refinance-break-even-point 与 closing-costs-explained
    related: [
      "heloc-vs-home-equity-loan",
      "how-much-home-equity-do-i-have",
      "debt-consolidation-vs-home-equity-loan",
      "how-to-refinance-a-mortgage",
      "mortgage-calculator",
      "amortization-schedule",
      "personal-loan-calculator",
    ],
    updated: "2026-10-09",
  },
  {
    slug: "fixed-vs-adjustable-rate-mortgage",
    title: "Fixed vs adjustable rate mortgage",
    summary:
      "An ARM saves $104.06 a month for five years and hands it back in 35 months if the rate resets to 7.50%. The whole sensitivity table, from 6.00% to 8.00%.",
    keyword: "fixed vs adjustable rate mortgage",
    cluster: "mortgage",
    related: [
      "how-to-refinance-a-mortgage",
      "15-vs-30-year-mortgage",
      "apr-vs-interest-rate",
      "how-to-compare-loan-offers",
      "mortgage-calculator",
      "amortization-schedule",
      "home-affordability-calculator",
    ],
    updated: "2026-10-09",
  },

  /* ── 第六批（2026-10-11）：往 buying / equity 两个偏薄的簇填页 ──
     第五批开了 buying / equity 但各只长到 3 / 2 篇；本批各加 2 篇，
     四簇变成 4 / 10 / 5 / 4。选题理由见各条注释。 */
  {
    slug: "mortgage-preapproval-vs-prequalification",
    title: "Mortgage preapproval vs prequalification",
    summary:
      "The same DTI rules, two different meanings of the word income: a $39,600 bonus only half recognised costs $60,361 of buying power, and a 0.75-point rate rise costs another $20,652.",
    keyword: "mortgage preapproval vs prequalification",
    cluster: "buying",
    related: [
      "how-much-house-can-i-afford",
      "debt-to-income-ratio",
      "what-if-the-appraisal-is-low",
      "how-to-compare-loan-offers",
      "home-affordability-calculator",
      "mortgage-calculator",
      "amortization-schedule",
    ],
    updated: "2026-10-11",
  },
  {
    slug: "what-if-the-appraisal-is-low",
    title: "What if the appraisal comes in low?",
    summary:
      "A $405,000 appraisal on a $420,000 contract leaves a $13,500 cash gap — and the gap is LTV × the shortfall, so a smaller down payment means a bigger bill. All three ways out, priced.",
    keyword: "what if the appraisal is low",
    cluster: "buying",
    related: [
      "how-much-down-payment-do-i-need",
      "mortgage-preapproval-vs-prequalification",
      "closing-costs-explained",
      "how-to-remove-pmi",
      "mortgage-calculator",
      "home-affordability-calculator",
      "amortization-schedule",
    ],
    updated: "2026-10-11",
  },
  {
    slug: "how-much-home-equity-do-i-have",
    title: "How much home equity do I have?",
    summary:
      "$180,000 of equity is only $80,000 you can borrow, and a 10% price fall halves it. The three different answers to one question, with a full price-shock table.",
    keyword: "how much home equity do i have",
    cluster: "equity",
    related: [
      "heloc-vs-home-equity-loan",
      "cash-out-refinance-vs-heloc",
      "debt-consolidation-vs-home-equity-loan",
      "how-to-refinance-a-mortgage",
      "mortgage-calculator",
      "amortization-schedule",
      "personal-loan-calculator",
    ],
    updated: "2026-10-11",
  },
  {
    slug: "debt-consolidation-vs-home-equity-loan",
    title: "Debt consolidation vs a home equity loan",
    summary:
      "The 8.00% loan costs $3,208 more than the 11.50% one, because ten years beats five. Why the lower rate loses, and what the house is actually being put up against.",
    keyword: "debt consolidation vs home equity loan",
    cluster: "equity",
    related: [
      "heloc-vs-home-equity-loan",
      "how-much-home-equity-do-i-have",
      "cash-out-refinance-vs-heloc",
      "apr-vs-interest-rate",
      "personal-loan-calculator",
      "mortgage-calculator",
      "amortization-schedule",
    ],
    updated: "2026-10-11",
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
