/**
 * 贷款计算核心。
 *
 * 所有页面（通用 / 房贷 / 车贷 / 学贷 / 个人贷 / 摊销表）都调用这里的函数，
 * 保证站内任何数字都出自同一套实现。禁止在页面里另写一份算术。
 */

export type PaymentRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
};

export type LoanResult = {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: PaymentRow[];
};

/** 标准等额本息公式：M = P·r(1+r)ⁿ / ((1+r)ⁿ − 1) */
function scheduledPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  const r = annualRate / 100 / 12;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  const growth = Math.pow(1 + r, months);
  return (principal * r * growth) / (growth - 1);
}

/**
 * 通用等额本息摊销（保持原有行为，供首页与旧调用方使用）。
 */
export function calculateLoan(
  principal: number,
  annualRate: number,
  years: number
): LoanResult {
  const r = annualRate / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));

  const monthlyPayment = scheduledPayment(principal, annualRate, n);

  let balance = principal;
  let totalInterest = 0;
  const schedule: PaymentRow[] = [];

  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPart = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPart);
    totalInterest += interest;
    schedule.push({
      month: i,
      payment: monthlyPayment,
      principal: principalPart,
      interest,
      balance,
    });
  }

  return {
    monthlyPayment,
    totalPayment: monthlyPayment * n,
    totalInterest,
    schedule,
  };
}

export type AmortizationRun = {
  /** 计划月供（不含额外还款） */
  monthlyPayment: number;
  /** 实际还清的期数 */
  months: number;
  totalInterest: number;
  /** 实付总额 = 各期实付之和 */
  totalPaid: number;
  rows: PaymentRow[];
};

/**
 * 按「月数」驱动的摊销，支持每期额外还款。
 * 提前还款场景专用：额外还款会缩短期数、提前结清，而不是减少月供。
 * （这不是假设 —— 固定利率分期贷款提前还款时，多付的部分默认直接冲减本金。）
 */
export function runAmortization(
  principal: number,
  annualRate: number,
  months: number,
  extraMonthly = 0
): AmortizationRun {
  const r = annualRate / 100 / 12;
  const n = Math.max(1, Math.round(months));
  const monthlyPayment = scheduledPayment(principal, annualRate, n);

  let balance = principal;
  let totalInterest = 0;
  let totalPaid = 0;
  const rows: PaymentRow[] = [];

  // 安全上限：额外还款不可能让它比原期限更慢
  const cap = n + 1;
  for (let i = 1; i <= cap && balance > 0.005; i++) {
    const interest = balance * r;
    let principalPart = monthlyPayment + extraMonthly - interest;
    if (principalPart <= 0) break; // 还款额连利息都不够，永远还不清
    if (principalPart > balance) principalPart = balance;
    balance -= principalPart;
    const payment = principalPart + interest;
    totalInterest += interest;
    totalPaid += payment;
    rows.push({ month: i, payment, principal: principalPart, interest, balance });
  }

  return {
    monthlyPayment,
    months: rows.length,
    totalInterest,
    totalPaid,
    rows,
  };
}

export type PayoffComparison = {
  /** 不额外还款时的期数与利息 */
  baseMonths: number;
  baseInterest: number;
  /** 每期额外还款后的期数与利息 */
  months: number;
  totalInterest: number;
  totalPaid: number;
  interestSaved: number;
  monthsSaved: number;
  monthlyPayment: number;
  rows: PaymentRow[];
};

/**
 * 对比「照常还」与「每期多还 X」。
 * 提前还款计算器与摊销表页面的结论段都从这里取数。
 */
export function compareExtraPayment(
  principal: number,
  annualRate: number,
  years: number,
  extraMonthly: number
): PayoffComparison {
  const n = Math.max(1, Math.round(years * 12));
  const base = runAmortization(principal, annualRate, n);
  const faster = runAmortization(principal, annualRate, n, extraMonthly);

  return {
    baseMonths: base.months,
    baseInterest: base.totalInterest,
    months: faster.months,
    totalInterest: faster.totalInterest,
    totalPaid: faster.totalPaid,
    interestSaved: base.totalInterest - faster.totalInterest,
    monthsSaved: base.months - faster.months,
    monthlyPayment: faster.monthlyPayment,
    rows: faster.rows,
  };
}

export type LumpSumResult = {
  /** 那笔一次性还款所在的期数（在该期**期初**入账） */
  atMonth: number;
  amount: number;
  /** 计划月供，不含那笔一次性还款 */
  monthlyPayment: number;
  /** 实际还清的期数 */
  months: number;
  totalInterest: number;
  /** 相对「完全不提前还」省下的利息 */
  interestSaved: number;
  /** 相对基准提前的期数 */
  monthsSaved: number;
  /** 不提前还款时的基准利息，便于正文引用 */
  baseInterest: number;
};

/**
 * 在指定期一次性额外还一笔（期初入账），其余各期仍按原计划月供还。
 *
 * 与 `compareExtraPayment` 是**两种不同机制**：那个是「每期多还 X」的
 * 持续性，这个是「某一期额外还一笔」的时点效应。提前还款指南要说明的正是
 * 「同样一笔钱，付得越早越有效」—— 只有这个函数能表达，用持续性函数硬套
 * 会把时点效应说成持续效应，两者对读者是相反的结论。
 *
 * `atMonth` 为 0 或负数表示那笔钱不投入，结果即基准情形。
 */
export function lumpSumPayoff(
  principal: number,
  annualRate: number,
  years: number,
  atMonth: number,
  amount: number
): LumpSumResult {
  const r = annualRate / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));
  const payment = scheduledPayment(principal, annualRate, n);
  const base = runAmortization(principal, annualRate, n);

  const applyAt = Math.max(0, Math.round(atMonth));
  let balance = principal;
  let totalInterest = 0;
  let months = 0;

  for (let i = 1; i <= n + 1 && balance > 0.005; i++) {
    if (applyAt > 0 && i === applyAt) {
      balance = Math.max(0, balance - amount);
      if (balance <= 0.005) break;
    }
    const interest = balance * r;
    let principalPart = payment - interest;
    if (principalPart <= 0) break;
    if (principalPart > balance) principalPart = balance;
    balance -= principalPart;
    totalInterest += interest;
    months = i;
  }

  return {
    atMonth: applyAt,
    amount,
    monthlyPayment: payment,
    months,
    totalInterest,
    interestSaved: base.totalInterest - totalInterest,
    monthsSaved: base.months - months,
    baseInterest: base.totalInterest,
  };
}

export type YearRow = {
  year: number;
  principal: number;
  interest: number;
  balance: number;
};

/** 把逐月摊销折成逐年汇总（摊销表页面用，30 年 360 行压成 30 行）。 */
export function yearlySummary(rows: PaymentRow[]): YearRow[] {
  const out: YearRow[] = [];
  for (let i = 0; i < rows.length; i += 12) {
    const slice = rows.slice(i, i + 12);
    out.push({
      year: out.length + 1,
      principal: slice.reduce((s, r) => s + r.principal, 0),
      interest: slice.reduce((s, r) => s + r.interest, 0),
      balance: slice[slice.length - 1].balance,
    });
  }
  return out;
}

/* ── 房贷专用：把「月供」拆成业主实际掏的四五笔钱 ────────────── */

/** 房产税：按房价的年税率折算成月供。 */
export function monthlyPropertyTax(
  homePrice: number,
  annualTaxRatePct: number
): number {
  return (homePrice * annualTaxRatePct) / 100 / 12;
}

/**
 * 按揭保险（PMI）：首付不足 20% 时按月收取。
 * 真实费率随 LTV / 信用分 / 保险公司浮动，因此这里只按用户填的费率算，
 * 不内置任何"标准费率"，避免给出看起来权威其实过期的数字。
 */
export function monthlyMortgageInsurance(
  loanAmount: number,
  annualPmiRatePct: number
): number {
  return (loanAmount * annualPmiRatePct) / 100 / 12;
}

/** 首付比例（0–1 之间的小数） */
export function downPaymentRatio(
  homePrice: number,
  downPayment: number
): number {
  if (homePrice <= 0) return 0;
  return Math.min(1, Math.max(0, downPayment / homePrice));
}

/**
 * 余额降到目标值所需的期数。
 * 房贷场景里用来回答「按揭保险还要交多久」：余额跌到房价的 80% 那天为止。
 *
 * `extraMonthly` 用于回答「多还一点能不能让按揭保险提前掉线」——
 * 额外还款不改变 PMI 的月额（PMI 按原始贷款额计），但会改变余额到达门槛的
 * 时点，所以这个参数只能影响期数，不能影响金额。
 */
export function monthsToBalance(
  principal: number,
  annualRate: number,
  years: number,
  targetBalance: number,
  extraMonthly = 0
): number {
  if (principal <= targetBalance) return 0;
  const months = Math.max(1, Math.round(years * 12));
  const payment = scheduledPayment(principal, annualRate, months) + extraMonthly;
  const r = annualRate / 100 / 12;
  let balance = principal;
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const principalPart = payment - interest;
    if (principalPart <= 0) return months; // 连利息都不够，永远到不了目标
    balance = Math.max(0, balance - principalPart);
    if (balance <= targetBalance) return i;
  }
  return months;
}

/** 车贷专用：销售税与融资额。 */
export function autoAmountFinanced({
  price,
  downPayment,
  tradeIn,
  salesTaxRatePct,
  taxOnTradeInDifferential,
}: {
  price: number;
  downPayment: number;
  tradeIn: number;
  salesTaxRatePct: number;
  /** true：仅对「车价 − 置换价」征税；false：对整车价征税 */
  taxOnTradeInDifferential: boolean;
}): { taxableBase: number; salesTax: number; amountFinanced: number } {
  const taxableBase = taxOnTradeInDifferential
    ? Math.max(0, price - tradeIn)
    : Math.max(0, price);
  const salesTax = (taxableBase * salesTaxRatePct) / 100;
  const amountFinanced = Math.max(
    0,
    price - downPayment - tradeIn + salesTax
  );
  return { taxableBase, salesTax, amountFinanced };
}

/* ── 可负担性：从收入反推房价（房贷计算器的反方向） ────────────── */

export type AffordabilityInput = {
  /** 家庭税前年收入 */
  annualIncome: number;
  /** 每月的其他债务还款：车贷、学贷、信用卡最低还款额 */
  monthlyDebts: number;
  /** 可用于首付的现金 */
  downPayment: number;
  /** 年利率 % */
  annualRate: number;
  /** 贷款年限 */
  years: number;
  /** 房产税年税率，占房价的 % */
  annualTaxRatePct: number;
  /** 房屋保险，年额 */
  annualInsurance: number;
  /** HOA 物业费，月额 */
  monthlyHoa: number;
  /** 按揭保险费率，年率占贷款额的 %。传 0 表示不建模 PMI */
  annualPmiRatePct: number;
  /** 后端 DTI 上限 %：「住房支出 + 其他债务」占月收入的比重上限 */
  maxBackEndDtiPct: number;
  /** 前端 DTI 上限 %：「住房支出」占月收入的比重上限 */
  maxFrontEndDtiPct: number;
};

export type AffordabilityResult = {
  maxHomePrice: number;
  loanAmount: number;
  monthlyPrincipalInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyPmi: number;
  /** 住房支出合计 = P&I + 税 + 保险 + HOA + PMI */
  monthlyHousing: number;
  /** 实际前端比率 %（住房支出 ÷ 月收入） */
  frontEndRatioPct: number;
  /** 实际后端比率 %（(住房支出 + 其他债务) ÷ 月收入） */
  backEndRatioPct: number;
  /** 哪个上限先触发 */
  bindingConstraint: "front" | "back" | "none";
  /** 受 20% 首付门槛限制（LTV 卡在 80%）时为 true */
  cappedByLtv: boolean;
  downPaymentPct: number;
  hasPmi: boolean;
};

/**
 * 从收入反推可负担房价。
 *
 * 与 mortgage-calculator 的方向相反：那个是「给价格算月供」，这个是
 * 「给收入算价格」。房贷场景真正的约束是 DTI 而不是房价本身，所以
 * 可负担金额的瓶颈在月供侧。
 *
 * ### 为什么是闭式解而不是迭代
 *
 * 表面上看这里有个循环依赖：PMI 取决于贷款额，贷款额取决于可承受月供，
 * 而可承受月供又要减掉 PMI。三种朴素解法（先假设收 / 先假设不收 / 循环
 * 迭代到收敛）要么会错、要么结果依赖迭代起点。
 *
 * 但 PMI 是贷款额的**线性**函数，而 LTV=80% 只是贷款额上的一条硬边界
 * （贷款额 ≤ 4 × 首付时首付即达 20%，不收 PMI）。于是解只有三种情形，
 * 各自有解析形式，按顺序判定即可 —— 结果与迭代无关，可被第二套实现
 * 逐位复算。这也是本站「算术只写一处、且必须能独立复核」的要求。
 *
 * 设 factor 为等额本息每借 1 元的月供系数，taxRate 为房产税的月系数，
 * cap 为 DTI 允许的最大住房月支出：
 *   无 PMI：L₀ = (cap − 固定支出 − 首付×taxRate) / (factor + taxRate)
 *   有 PMI：L₁ = (cap − 固定支出 − 首付×taxRate) / (factor + taxRate + pmiRate)
 * 因为分母更大，恒有 L₁ < L₀。
 */
export function affordableHomePrice(
  input: AffordabilityInput
): AffordabilityResult {
  const {
    annualIncome,
    monthlyDebts,
    downPayment,
    annualRate,
    years,
    annualTaxRatePct,
    annualInsurance,
    monthlyHoa,
    annualPmiRatePct,
    maxBackEndDtiPct,
    maxFrontEndDtiPct,
  } = input;

  const monthlyIncome = annualIncome / 12;
  const n = Math.max(1, Math.round(years * 12));
  const r = annualRate / 100 / 12;
  const factor = r === 0 ? 1 / n : (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const taxRate = annualTaxRatePct / 100 / 12; // 月房产税 ÷ 房价
  const pmiRate = annualPmiRatePct / 100 / 12; // 月 PMI ÷ 贷款额
  const fixed = annualInsurance / 12 + monthlyHoa;

  // DTI 允许的住房月支出上限：前端与后端取更紧的一个
  const capByFront = monthlyIncome * (maxFrontEndDtiPct / 100);
  const capByBack = monthlyIncome * (maxBackEndDtiPct / 100) - monthlyDebts;
  const cap = Math.min(capByFront, capByBack);
  const bindingConstraint: AffordabilityResult["bindingConstraint"] =
    monthlyIncome <= 0 ? "none" : capByFront <= capByBack ? "front" : "back";

  const numerator = cap - fixed - downPayment * taxRate;
  const loanNoPmi = numerator / (factor + taxRate);
  const loanWithPmi =
    pmiRate > 0 ? numerator / (factor + taxRate + pmiRate) : loanNoPmi;
  const ltvCap = 4 * downPayment; // 贷款额到达首付的 4 倍时 LTV=80%

  let loanAmount: number;
  let hasPmi: boolean;
  let cappedByLtv = false;

  if (cap <= 0 || numerator <= 0) {
    // 收入扛不住现有债务 + 固定支出，或首付为 0 且要收 PMI
    loanAmount = 0;
    hasPmi = false;
  } else if (pmiRate <= 0) {
    loanAmount = loanNoPmi;
    hasPmi = false;
  } else if (loanNoPmi <= ltvCap) {
    // 首付已达 20%，自洽：不收 PMI
    loanAmount = loanNoPmi;
    hasPmi = false;
  } else if (loanWithPmi > ltvCap) {
    // 收着 PMI 仍够不到 20% 门槛，自洽：收 PMI
    loanAmount = loanWithPmi;
    hasPmi = true;
  } else {
    // 中间地带：贷款额一旦超过 4×首付就会触发 PMI，而 PMI 又把它压回来。
    // 真实答案是 LTV 卡在 80%，此时恰好不收 PMI。
    loanAmount = ltvCap;
    hasPmi = false;
    cappedByLtv = true;
  }

  loanAmount = Math.max(0, loanAmount);
  const maxHomePrice = downPayment + loanAmount;

  const monthlyPrincipalInterest = loanAmount * factor;
  const monthlyTax = maxHomePrice * taxRate;
  const monthlyPmi = hasPmi ? loanAmount * pmiRate : 0;
  const monthlyHousing =
    monthlyPrincipalInterest + monthlyTax + annualInsurance / 12 + monthlyHoa + monthlyPmi;

  return {
    maxHomePrice,
    loanAmount,
    monthlyPrincipalInterest,
    monthlyTax,
    monthlyInsurance: annualInsurance / 12,
    monthlyHoa,
    monthlyPmi,
    monthlyHousing,
    frontEndRatioPct:
      monthlyIncome > 0 ? (monthlyHousing / monthlyIncome) * 100 : 0,
    backEndRatioPct:
      monthlyIncome > 0
        ? ((monthlyHousing + monthlyDebts) / monthlyIncome) * 100
        : 0,
    bindingConstraint,
    cappedByLtv,
    downPaymentPct: maxHomePrice > 0 ? (downPayment / maxHomePrice) * 100 : 0,
    hasPmi,
  };
}

/* ── 租 vs 买：两条路径的净成本对比 ────────────────────────────── */

export type RentVsBuyInput = {
  /** 房价 */
  homePrice: number;
  /** 首付现金 */
  downPayment: number;
  /** 房贷年利率 % */
  annualRate: number;
  /** 房贷年限 */
  years: number;
  /** 房产税年率，占**房价**的 % */
  annualTaxRatePct: number;
  /** 房屋保险年额 */
  annualInsurance: number;
  /** HOA 物业费月额 */
  monthlyHoa: number;
  /** 维护与修缮年率，占**房价**的 % */
  annualMaintenancePct: number;
  /** 买入一次性交易成本（含贷款手续费），占房价 % */
  buyingClosingCostPct: number;
  /** 卖出交易成本（中介佣金等），占成交价 % */
  sellingCostPct: number;
  /** 房价年增值率 % */
  annualAppreciationPct: number;
  /** 当前月租 */
  monthlyRent: number;
  /**
   * 年通胀率 %，**同时**用于租金与业主的经常性支出（税、保险、HOA、维护）。
   *
   * 刻意共用一个率：若只让租金上涨、业主支出原地不动，就等于偷偷把结论
   * 推向买房。真正该保留的不对称是「月供（本息）固定、租金上涨」——
   * 那是固定利率贷款真实存在的好处，不需要额外制造。
   */
  annualInflationPct: number;
  /**
   * 首付与买入费用若不买房、而是拿去投资的年化收益率 %。
   * 这是租买对比里唯一一个「不写出来就等于零、写出来又要解释」的项，
   * 所以显式入参，由调用方声明口径。
   */
  investmentReturnPct: number;
  /** 持有年数 */
  holdYears: number;
};

export type RentVsBuyYear = {
  year: number;
  buyNetCost: number;
  rentNetCost: number;
  /** rentNetCost − buyNetCost；正数 = 该时点买入更省 */
  advantage: number;
};

export type RentVsBuyResult = {
  holdYears: number;
  holdMonths: number;
  monthlyPrincipalInterest: number;
  /** 首付 + 买入交易成本 */
  upfrontCash: number;

  /* 买入路径 */
  paidInterest: number;
  paidPrincipal: number;
  paidTax: number;
  paidInsurance: number;
  paidHoa: number;
  paidMaintenance: number;
  /** 税 + 保险 + HOA + 维护 */
  paidCarrying: number;
  buyingClosingCosts: number;
  /** 首付 + 买入费用 + 持有期全部支出 */
  totalOwnerCashOut: number;
  homeValueAtExit: number;
  mortgageBalanceAtExit: number;
  sellingCosts: number;
  /** 成交价 − 剩余贷款 − 卖出费用 */
  netSaleProceeds: number;
  /** 买入净成本 = totalOwnerCashOut − netSaleProceeds */
  buyNetCost: number;

  /* 租路径 */
  rentPaid: number;
  /** 租客把「比买房省下的月度差额」也持续投入后，组合在期末的价值 */
  portfolioValue: number;
  /** 期末前投入组合的月度差额累计（可为负：某些月份租金反而高于持有成本） */
  contributionTotal: number;
  /** 组合相对本金产生的收益 = portfolioValue − upfrontCash − contributionTotal */
  investmentGain: number;
  /** 租净成本 = rentPaid − investmentGain */
  rentNetCost: number;

  /* 结论 */
  advantage: number;
  better: "buy" | "rent";
  /** 逐年扫描里第一个 advantage > 0 的年数；期间内未反转则为 null */
  breakEvenYears: number | null;
  byYear: RentVsBuyYear[];
};

/**
 * 某个持有期下的租买净成本（不含逐年扫描，供 `rentVsBuy` 内部复用）。
 *
 * ### 净成本的定义（两个口径必须对称，否则结论是假的）
 *
 * 两边都按「现金流出 − 现金收回」计：
 *   买入：流出 = 首付 + 买入费用 + 各月支出；收回 = 卖房净得
 *   租房：流出 = 房租 + 那笔首付投入的资金；收回 = 投资变现额
 *
 * 相减后可得一个很好用的闭式：租客的本金原样收回、只有收益计入差额，
 * 于是
 *   **买入净成本 = 买卖两端交易成本 + 已付利息 + 持有期税费维护 − 房价增值**
 * 首付与已还本金在两边自动抵消，不构成成本。这个等式是复算脚本的交叉校验点。
 *
 * ### 为什么必须给租客记「月度差额」的收益
 *
 * 第一版模型只把首付那笔钱算作投资本金，**不给租客记「月供高于房租」那部分
 * 差额的投资收益**。本组参数下这个差额约 $900/月，15 年复利下来是六位数 ——
 * 漏掉它不是精度问题，是**把结论定死推向买房**。两位数的金额可以忽略，
 * 六位数的不能。
 *
 * 修正后两边口径完全对称：**两条路径每月的现金流出相同**（都等于持有成本），
 * 区别只在这笔钱去了哪里 —— 买房进了房子，租房则房租之外的部分进了组合。
 * 于是「谁更省」就等于「谁的期末资产更多」，不再依赖任何主观加权。
 *
 * ### 明确不建模的一项
 * 租客保险（通常每月十几美元），量级小且两边都未计。
 */
function rentVsBuyCore(
  input: RentVsBuyInput,
  holdMonths: number
): Omit<RentVsBuyResult, "byYear" | "breakEvenYears" | "better"> {
  const {
    homePrice,
    downPayment,
    annualRate,
    years,
    annualTaxRatePct,
    annualInsurance,
    monthlyHoa,
    annualMaintenancePct,
    buyingClosingCostPct,
    sellingCostPct,
    annualAppreciationPct,
    monthlyRent,
    annualInflationPct,
    investmentReturnPct,
  } = input;

  const n = Math.max(1, Math.round(years * 12));
  const payment = scheduledPayment(homePrice - downPayment, annualRate, n);
  const run = runAmortization(homePrice - downPayment, annualRate, n);

  const infl = annualInflationPct / 100;
  // 通胀按「年」跳档（租约每年续一次、税单每年出一张），不按月复利
  const step = (m: number) => Math.pow(1 + infl, Math.floor((m - 1) / 12));

  const baseTax = (homePrice * annualTaxRatePct) / 100 / 12;
  const baseIns = annualInsurance / 12;
  const baseMaint = (homePrice * annualMaintenancePct) / 100 / 12;

  const buyingClosingCosts = (homePrice * buyingClosingCostPct) / 100;
  const upfrontCash = downPayment + buyingClosingCosts;

  let paidInterest = 0;
  let paidPrincipal = 0;
  let paidTax = 0;
  let paidInsurance = 0;
  let paidHoa = 0;
  let paidMaintenance = 0;
  let rentPaid = 0;

  // 租客组合：期初放入 upfrontCash，此后每月再投入「持有成本 − 当月租金」
  const im = Math.pow(1 + investmentReturnPct / 100, 1 / 12) - 1;
  let portfolio = upfrontCash;
  let contributionTotal = 0;

  for (let m = 1; m <= holdMonths; m++) {
    const f = step(m);
    let paymentThisMonth = 0;
    // 贷款还清之后本息停止，但税费维护继续
    if (m <= run.rows.length) {
      const row = run.rows[m - 1];
      // 用**计划月供**而非该期实际扣款：末期余额被清零时实际扣款会小几厘，
      // 用它会让三个复算引擎在分位边界上产生伪差异。计划月供是确定性的。
      paymentThisMonth = payment;
      paidInterest += row.interest;
      paidPrincipal += row.principal;
    }
    const taxM = baseTax * f;
    const insM = baseIns * f;
    const hoaM = monthlyHoa * f;
    const maintM = baseMaint * f;
    const rentM = monthlyRent * f;

    paidTax += taxM;
    paidInsurance += insM;
    paidHoa += hoaM;
    paidMaintenance += maintM;
    rentPaid += rentM;

    const ownerCashM = paymentThisMonth + taxM + insM + hoaM + maintM;
    const contribution = ownerCashM - rentM;
    portfolio = portfolio * (1 + im) + contribution;
    contributionTotal += contribution;
  }

  const paidCarrying = paidTax + paidInsurance + paidHoa + paidMaintenance;
  const totalOwnerCashOut =
    upfrontCash + paidInterest + paidPrincipal + paidCarrying;

  const appreciation = Math.pow(1 + annualAppreciationPct / 100, holdMonths / 12);
  const homeValueAtExit = homePrice * appreciation;
  const mortgageBalanceAtExit =
    holdMonths >= run.rows.length ? 0 : run.rows[holdMonths - 1].balance;
  const sellingCosts = (homeValueAtExit * sellingCostPct) / 100;
  const netSaleProceeds = homeValueAtExit - mortgageBalanceAtExit - sellingCosts;
  const buyNetCost = totalOwnerCashOut - netSaleProceeds;

  const portfolioValue = portfolio;
  const investmentGain = portfolioValue - upfrontCash - contributionTotal;
  const rentNetCost = rentPaid - investmentGain;
  const advantage = rentNetCost - buyNetCost;

  return {
    holdYears: holdMonths / 12,
    holdMonths,
    monthlyPrincipalInterest: payment,
    upfrontCash,
    paidInterest,
    paidPrincipal,
    paidTax,
    paidInsurance,
    paidHoa,
    paidMaintenance,
    paidCarrying,
    buyingClosingCosts,
    totalOwnerCashOut,
    homeValueAtExit,
    mortgageBalanceAtExit,
    sellingCosts,
    netSaleProceeds,
    buyNetCost,
    rentPaid,
    portfolioValue,
    contributionTotal,
    investmentGain,
    rentNetCost,
    advantage,
  };
}

/**
 * 租 vs 买。返回指定持有期的净成本，外加逐年扫描（用于回答
 * 「住多久才划算」—— 这是这个题目的真正问题，不是「哪个更便宜」）。
 *
 * 结论全部来自上面的现金流模型，没有一处是经验判断。
 */
export function rentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const maxYears = Math.max(1, Math.round(input.holdYears));
  const byYear: RentVsBuyYear[] = [];
  for (let y = 1; y <= maxYears; y++) {
    const c = rentVsBuyCore(input, y * 12);
    byYear.push({
      year: y,
      buyNetCost: c.buyNetCost,
      rentNetCost: c.rentNetCost,
      advantage: c.advantage,
    });
  }

  const core = rentVsBuyCore(input, maxYears * 12);
  const firstBuy = byYear.find((r) => r.advantage > 0);

  return {
    ...core,
    better: core.advantage > 0 ? "buy" : "rent",
    breakEvenYears: firstBuy ? firstBuy.year : null,
    byYear,
  };
}

export function formatMoney(v: number, fractionDigits = 2): string {
  if (!Number.isFinite(v)) return "$0";
  return v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/** 把月数说成人话：277 → "23 years 1 month" */
export function formatMonths(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} month${m === 1 ? "" : "s"}`;
  if (m === 0) return `${y} year${y === 1 ? "" : "s"}`;
  return `${y} year${y === 1 ? "" : "s"} ${m} month${m === 1 ? "" : "s"}`;
}

/** 百分比，保留一位小数并去掉多余的 .0 */
export function formatPercent(v: number, digits = 1): string {
  const s = v.toFixed(digits);
  return `${s.endsWith(".0") ? s.slice(0, -2) : s}%`;
}
