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

/* ── 首付比例：同一套房、不同首付的实际代价 ───────────────────── */

export type DownPaymentInput = {
  homePrice: number;
  /** 首付金额 */
  downPayment: number;
  annualRate: number;
  years: number;
  /**
   * PMI 年率，占**原始贷款额**的 %。传 0 表示不建模。
   * 真实费率随 LTV / 信用分 / 承保方浮动，因此这里只按调用方给的率算，
   * 不内置任何「标准费率」。
   */
  annualPmiRatePct: number;
  /** PMI 掉线的 LTV 门槛 %，默认 80 */
  pmiDropLtvPct?: number;
};

export type DownPaymentPlan = {
  downPayment: number;
  downPaymentPct: number;
  loanAmount: number;
  monthlyPrincipalInterest: number;
  monthlyPmi: number;
  /** 本息 + PMI（不含房产税与保险） */
  monthlyTotal: number;
  totalInterest: number;
  /** 实付总额 = 各期实付之和 = 贷款额 + 利息 */
  totalPaid: number;
  hasPmi: boolean;
  /** 余额首次跌到门槛那个月；不收 PMI 时为 0 */
  pmiDropMonth: number;
  /** PMI 实际收取的月数 */
  pmiMonthsCharged: number;
  totalPmi: number;
  /**
   * 这档首付下的终身成本 = **房价 + 利息 + PMI**。
   *
   * 为什么是这个形式：首付与已还本金在两档之间自动抵消
   * （首付 + 贷款额 = 房价，贷款额 + 利息 = 实付），所以终身成本里
   * 只剩「房价 + 利息 + PMI」这一项会随首付变化。它直接可比，
   * 不需要再对首付做时间价值折算 —— 折算留给 `downPaymentTradeoff`。
   */
  lifetimeCost: number;
};

export function downPaymentPlan(input: DownPaymentInput): DownPaymentPlan {
  const { homePrice, downPayment, annualRate, years, annualPmiRatePct } = input;
  const dropLtvPct = input.pmiDropLtvPct ?? 80;

  const loanAmount = Math.max(0, homePrice - downPayment);
  const months = Math.max(1, Math.round(years * 12));
  const run = runAmortization(loanAmount, annualRate, months);

  // PMI 只在 LTV 高于门槛时收。用「贷款额 > 门槛金额」判定而不是
  // 让调用方自己传一个布尔值 —— 后者会在两档首付之间产生口径漂移。
  const threshold = (homePrice * dropLtvPct) / 100;
  const hasPmi = annualPmiRatePct > 0 && loanAmount > threshold;
  const monthlyPmi = hasPmi
    ? monthlyMortgageInsurance(loanAmount, annualPmiRatePct)
    : 0;
  const pmiDropMonth = hasPmi
    ? monthsToBalance(loanAmount, annualRate, years, threshold)
    : 0;
  const pmiMonthsCharged = hasPmi ? pmiDropMonth : 0;
  const totalPmi = monthlyPmi * pmiMonthsCharged;

  return {
    downPayment,
    downPaymentPct: homePrice > 0 ? (downPayment / homePrice) * 100 : 0,
    loanAmount,
    monthlyPrincipalInterest: run.monthlyPayment,
    monthlyPmi,
    monthlyTotal: run.monthlyPayment + monthlyPmi,
    totalInterest: run.totalInterest,
    totalPaid: run.totalPaid,
    hasPmi,
    pmiDropMonth,
    pmiMonthsCharged,
    totalPmi,
    lifetimeCost: homePrice + run.totalInterest + totalPmi,
  };
}

export type DownPaymentTradeoffInput = {
  /** 首付较少的那一档（贷款更多） */
  lower: DownPaymentInput;
  /** 首付较多的那一档 */
  higher: DownPaymentInput;
  /** 持有年数 —— 差额只在这段时间里累积，不是拿 30 年去比 */
  holdYears: number;
};

export type DownPaymentTradeoff = {
  /** 首付少的那一档留在手里的现金 */
  cashKept: number;
  /** 月供差（首付少的一方更贵） */
  monthlyDifference: number;
  /** 持有期内多付的利息 */
  extraInterest: number;
  /** 持有期内多付的 PMI */
  extraPmi: number;
  /** 上面两项之和 —— 这就是「不付那笔首付」的代价 */
  extraCost: number;
  /**
   * 隐含年成本 %（简单口径）：把 extraCost 当作「少付的那笔首付」
   * 在这段时间里的租金。它可以直接和「这笔钱拿去投资的收益率」比。
   */
  simpleAnnualCostPct: number;
  /** 同上，复利口径 */
  compoundAnnualCostPct: number;
  lowerPaid: number;
  higherPaid: number;
  holdYears: number;
};

/**
 * 「少付首付」这笔交易的隐含利率。
 *
 * 这是首付决策真正该问的问题，而不是「月供差多少」：少付 $40,000 首付
 * 让你多背一笔贷款，这笔贷款在这段时间里向你收取的利息 + PMI，
 * 就是那 $40,000 的代价。把它年化，才能与「这笔钱能赚多少」相比。
 *
 * 口径刻意只算到持有期结束，不算满 30 年 —— 拿 30 年的利息去否定
 * 一笔只打算持有 7 年的差额，是把结论定死。
 */
export function downPaymentTradeoff(
  input: DownPaymentTradeoffInput
): DownPaymentTradeoff {
  const { lower, higher } = input;
  const holdYears = Math.max(1, Math.round(input.holdYears));
  const holdMonths = holdYears * 12;

  const lowerPlan = downPaymentPlan(lower);
  const higherPlan = downPaymentPlan(higher);

  const lowerRows = runAmortization(
    lowerPlan.loanAmount,
    lower.annualRate,
    Math.max(1, Math.round(lower.years * 12))
  ).rows.slice(0, holdMonths);
  const higherRows = runAmortization(
    higherPlan.loanAmount,
    higher.annualRate,
    Math.max(1, Math.round(higher.years * 12))
  ).rows.slice(0, holdMonths);

  const sum = (rows: PaymentRow[], key: "interest" | "payment") =>
    rows.reduce((s, r) => s + r[key], 0);

  const lowerInterest = sum(lowerRows, "interest");
  const higherInterest = sum(higherRows, "interest");
  const lowerPaid = sum(lowerRows, "payment");
  const higherPaid = sum(higherRows, "payment");

  const pmiWithin = (p: DownPaymentPlan) =>
    p.monthlyPmi * Math.min(holdMonths, p.pmiMonthsCharged);

  const extraInterest = lowerInterest - higherInterest;
  const extraPmi = pmiWithin(lowerPlan) - pmiWithin(higherPlan);
  const extraCost = extraInterest + extraPmi;

  const cashKept = higherPlan.downPayment - lowerPlan.downPayment;
  const ratio = cashKept > 0 ? extraCost / cashKept : 0;

  return {
    cashKept,
    monthlyDifference:
      lowerPlan.monthlyPrincipalInterest - higherPlan.monthlyPrincipalInterest,
    extraInterest,
    extraPmi,
    extraCost,
    simpleAnnualCostPct: cashKept > 0 ? (ratio / holdYears) * 100 : 0,
    compoundAnnualCostPct:
      cashKept > 0 && 1 + ratio > 0
        ? (Math.pow(1 + ratio, 1 / holdYears) - 1) * 100
        : 0,
    lowerPaid,
    higherPaid,
    holdYears,
  };
}

/* ── 托管账户：月供里不还债的那一部分 ──────────────────────────── */

export type EscrowInput = {
  homePrice: number;
  loanAmount: number;
  annualRate: number;
  years: number;
  /** 房产税年率，占**房价**的 % */
  annualTaxRatePct: number;
  /** 房屋保险年额 */
  annualInsurance: number;
  /**
   * 托管缓冲月数。美国服务规则允许服务商最多保留相当于年度支出 1/6
   * （即 2 个月）的缓冲 —— 这里不内置默认值以外的东西，具体以 CFPB 的
   * 服务规则与你的贷款文件为准。
   */
  cushionMonths?: number;
};

export type EscrowBreakdown = {
  monthlyPrincipalInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  /** 托管账户每月收取的部分 = 房产税 + 保险 */
  monthlyEscrow: number;
  monthlyTotal: number;
  /** 每年从托管账户一次性付出的总额（税单 + 保费） */
  annualDisbursement: number;
  /** 托管占月供的比重 % */
  escrowSharePct: number;
  cushionMonths: number;
  cushionAmount: number;
  /** 一年里从你账上收进托管的总数（等于年支出，缓冲只在开户时收一次） */
  annualCollection: number;
};

export function escrowBreakdown(input: EscrowInput): EscrowBreakdown {
  const {
    homePrice,
    loanAmount,
    annualRate,
    years,
    annualTaxRatePct,
    annualInsurance,
  } = input;
  const cushionMonths = input.cushionMonths ?? 2;

  const monthlyPrincipalInterest = scheduledPayment(
    loanAmount,
    annualRate,
    Math.max(1, Math.round(years * 12))
  );
  const monthlyTax = monthlyPropertyTax(homePrice, annualTaxRatePct);
  const monthlyInsurance = annualInsurance / 12;
  const monthlyEscrow = monthlyTax + monthlyInsurance;
  const monthlyTotal = monthlyPrincipalInterest + monthlyEscrow;
  const annualDisbursement = monthlyEscrow * 12;

  return {
    monthlyPrincipalInterest,
    monthlyTax,
    monthlyInsurance,
    monthlyEscrow,
    monthlyTotal,
    annualDisbursement,
    escrowSharePct: monthlyTotal > 0 ? (monthlyEscrow / monthlyTotal) * 100 : 0,
    cushionMonths,
    cushionAmount: (annualDisbursement / 12) * cushionMonths,
    annualCollection: annualDisbursement,
  };
}

export type EscrowShortfallInput = {
  monthlyTax: number;
  monthlyInsurance: number;
  /** 税单（或保费）上涨幅度 % */
  taxIncreasePct: number;
  /** 缺口允许分摊的月数，服务规则要求不少于 12 个月 */
  spreadMonths?: number;
};

export type EscrowShortfall = {
  monthlyEscrowBefore: number;
  monthlyEscrowAfter: number;
  /** 上涨后每月稳定多掏的钱 */
  monthlyIncrease: number;
  annualDisbursementIncrease: number;
  /** 服务商替你垫出去、但你还没缴进托管的那部分 */
  shortageAmount: number;
  /** 缺口按月分摊后每月再加的钱 */
  shortageSpreadMonthly: number;
  /** 上涨后第一年的实际月供增量 = 新税摊入 + 缺口分摊 */
  firstYearIncrease: number;
  /** 缺口摊完之后剩下的月供增量 */
  steadyIncrease: number;
};

/**
 * 税单或保费上涨之后，月供会发生什么。
 *
 * 值得单独建模的原因：上涨当年月供是**涨两次**的。服务商已经按新税单
 * 足额付出去，但你的月缴额还是旧数 —— 这笔垫款是缺口，规则允许它摊到
 * 至少 12 个月上加收。于是第一年的增量约为稳定增量的两倍，
 * 而绝大多数人只预期到后者。
 */
export function escrowShortfall(
  input: EscrowShortfallInput
): EscrowShortfall {
  const { monthlyTax, monthlyInsurance, taxIncreasePct } = input;
  const spreadMonths = Math.max(1, Math.round(input.spreadMonths ?? 12));

  const monthlyEscrowBefore = monthlyTax + monthlyInsurance;
  const monthlyEscrowAfter =
    monthlyTax * (1 + taxIncreasePct / 100) + monthlyInsurance;
  const monthlyIncrease = monthlyEscrowAfter - monthlyEscrowBefore;
  const annualDisbursementIncrease = monthlyIncrease * 12;
  const shortageSpreadMonthly = annualDisbursementIncrease / spreadMonths;

  return {
    monthlyEscrowBefore,
    monthlyEscrowAfter,
    monthlyIncrease,
    annualDisbursementIncrease,
    shortageAmount: annualDisbursementIncrease,
    shortageSpreadMonthly,
    firstYearIncrease: monthlyIncrease + shortageSpreadMonthly,
    steadyIncrease: monthlyIncrease,
  };
}

/* ── 取现金的两条路：cash-out 再融资 vs HELOC ──────────────────── */

export type CashOutVsHelocInput = {
  /** 现在的房价 */
  homeValue: number;
  /** 现有第一顺位贷款的余额 */
  existingBalance: number;
  /** 现有贷款利率 % */
  existingRatePct: number;
  /** 现有贷款的剩余月数 */
  existingRemainingMonths: number;
  /** 想拿出来的现金 */
  cashOut: number;
  /** cash-out 再融资的新利率 % */
  cashOutRatePct: number;
  /** cash-out 再融资的新期限（月） */
  cashOutMonths: number;
  /** HELOC 利率 % */
  helocRatePct: number;
  /** HELOC 只付息的提取期（月） */
  helocDrawMonths: number;
  /** HELOC 的摊还还款期（月） */
  helocRepayMonths: number;
};

export type CashOutVsHelocResult = {
  /* cash-out 路径 */
  cashOutLoanAmount: number;
  cashOutLtvPct: number;
  cashOutMonthlyPayment: number;
  cashOutTotalInterest: number;
  cashOutTotalPaid: number;
  /**
   * 按「新钱占新贷款额的比例」把总利息线性拆成两部分。
   *
   * 这个拆分是**精确**的而不是近似：同一笔贷款、同一利率、同一摊销表，
   * 各笔本金按比例同步摊还，所以利息也严格按本金比例分配。
   * 它回答的正是那个关键问题 —— 你为「多借的那 $60,000」付了多少，
   * 又为「本来就有、但被重新定价的那部分」付了多少。
   */
  cashOutInterestOnNewMoney: number;
  cashOutInterestOnExisting: number;

  /* HELOC 路径 */
  firstLienMonthlyPayment: number;
  firstLienInterest: number;
  helocDrawPayment: number;
  helocRepayPayment: number;
  /** 提取期结束、进入摊还后月供的涨幅 % */
  helocPaymentIncreasePct: number;
  helocInterestDuringDraw: number;
  helocInterestDuringRepay: number;
  helocTotalInterest: number;

  /* 现金流 */
  cashOutMonthlyOutlay: number;
  helocMonthlyOutlay: number;
  monthlyDifference: number;

  /* 结论 */
  totalInterestDifference: number;
  cheaperOverall: "cashOut" | "heloc";
  /** 只看「新借的那笔钱」，哪条路更便宜 */
  cheaperOnNewMoney: "cashOut" | "heloc";
};

/**
 * 从房子里取一笔现金，两条路的总代价。
 *
 * 这个对比的陷阱在于：cash-out 再融资看起来只是「多借 $60,000」，
 * 实际上它把**整笔余额**按新利率、新期限重新定价了一遍。所以必须
 * 把利息拆成「新钱」与「原有余额」两块，否则会得出
 * 「cash-out 更便宜」这个在总额上完全站不住的结论。
 *
 * 两条路径在同一观察期（= HELOC 提取期 + 还款期）内都归零，
 * 因此总利息可以直接比。
 */
export function cashOutVsHeloc(
  input: CashOutVsHelocInput
): CashOutVsHelocResult {
  const {
    homeValue,
    existingBalance,
    existingRatePct,
    existingRemainingMonths,
    cashOut,
    cashOutRatePct,
    cashOutMonths,
    helocRatePct,
    helocDrawMonths,
    helocRepayMonths,
  } = input;

  const cashOutLoanAmount = existingBalance + cashOut;
  const co = runAmortization(cashOutLoanAmount, cashOutRatePct, cashOutMonths);

  const first = runAmortization(
    existingBalance,
    existingRatePct,
    existingRemainingMonths
  );

  // HELOC：提取期只付息，余额原地不动；还款期才把它摊平
  const helocDrawPayment = (cashOut * helocRatePct) / 100 / 12;
  const helocInterestDuringDraw = helocDrawPayment * helocDrawMonths;
  const repay = runAmortization(cashOut, helocRatePct, helocRepayMonths);

  const newShare = cashOutLoanAmount > 0 ? cashOut / cashOutLoanAmount : 0;
  const cashOutInterestOnNewMoney = co.totalInterest * newShare;

  const helocTotalInterest = helocInterestDuringDraw + repay.totalInterest;
  const helocPathInterest = first.totalInterest + helocTotalInterest;

  const cashOutMonthlyOutlay = co.monthlyPayment;
  const helocMonthlyOutlay = first.monthlyPayment + helocDrawPayment;

  return {
    cashOutLoanAmount,
    cashOutLtvPct: homeValue > 0 ? (cashOutLoanAmount / homeValue) * 100 : 0,
    cashOutMonthlyPayment: co.monthlyPayment,
    cashOutTotalInterest: co.totalInterest,
    cashOutTotalPaid: co.totalPaid,
    cashOutInterestOnNewMoney,
    cashOutInterestOnExisting: co.totalInterest - cashOutInterestOnNewMoney,

    firstLienMonthlyPayment: first.monthlyPayment,
    firstLienInterest: first.totalInterest,
    helocDrawPayment,
    helocRepayPayment: repay.monthlyPayment,
    helocPaymentIncreasePct:
      helocDrawPayment > 0
        ? ((repay.monthlyPayment - helocDrawPayment) / helocDrawPayment) * 100
        : 0,
    helocInterestDuringDraw,
    helocInterestDuringRepay: repay.totalInterest,
    helocTotalInterest,

    cashOutMonthlyOutlay,
    helocMonthlyOutlay,
    monthlyDifference: helocMonthlyOutlay - cashOutMonthlyOutlay,

    totalInterestDifference: helocPathInterest - co.totalInterest,
    cheaperOverall: co.totalInterest <= helocPathInterest ? "cashOut" : "heloc",
    cheaperOnNewMoney:
      cashOutInterestOnNewMoney <= helocTotalInterest ? "cashOut" : "heloc",
  };
}

/* ── 固定利率 vs 可调利率 ─────────────────────────────────────── */

export type ArmInput = {
  loanAmount: number;
  /** 固定期内的初始利率 % */
  introRatePct: number;
  /** 固定期月数 */
  introMonths: number;
  /** 重设后的利率 % */
  adjustedRatePct: number;
  /** 总期限（月） */
  totalMonths: number;
  /** 对照用的同额固定利率 % */
  compareFixedRatePct: number;
};

export type ArmResult = {
  introPayment: number;
  balanceAtReset: number;
  paymentAfterReset: number;
  paymentChange: number;
  paymentChangePct: number;
  interestDuringIntro: number;
  interestAfterReset: number;
  totalInterest: number;
  totalPaid: number;

  /* 同额固定利率对照 */
  fixedPayment: number;
  fixedBalanceAtReset: number;
  fixedTotalInterest: number;
  fixedTotalPaid: number;

  /** ARM 相对同额固定：正数 = ARM 更贵 */
  interestDifference: number;
  cheaper: "arm" | "fixed";
  /** 固定期内靠低利率省下的现金 */
  savingDuringIntro: number;
  /** 重设后每月比固定多付的金额（可为负） */
  monthlyIncreaseAfterReset: number;
  /**
   * 固定期攒下的月供优势被重设后的高月供吃光需要多少个月。
   * 重设后月供不高于固定月供时为 null（那就吃不光）。
   */
  monthsToEraseSaving: number | null;
  /** 重设时 ARM 的余额比固定少多少（正数 = ARM 领先） */
  balanceAdvantageAtReset: number;
};

/**
 * 可调利率贷款的确定性模型：固定期按 intro 利率摊销，
 * 重设日把**当时余额**按 adjusted 利率在剩余期限内重新摊销。
 *
 * 刻意不做「利率上限」「后续每年再调整」这类叠加假设：多一个假设就
 * 多一处三套实现可能分歧的地方，而结论的方向由第一次重设幅度决定，
 * 不会因为第二次重设而反转。不确定性用「同一套算例扫一遍重设利率」
 * 来表达（见页面上的敏感度表），而不是往模型里塞更多参数。
 */
export function armMortgage(input: ArmInput): ArmResult {
  const {
    loanAmount,
    introRatePct,
    adjustedRatePct,
    compareFixedRatePct,
  } = input;
  const introMonths = Math.max(0, Math.round(input.introMonths));
  const totalMonths = Math.max(1, Math.round(input.totalMonths));

  const introRun = runAmortization(loanAmount, introRatePct, totalMonths);
  const introRows = introRun.rows.slice(0, introMonths);
  const interestDuringIntro = introRows.reduce((s, r) => s + r.interest, 0);
  const balanceAtReset =
    introRows.length > 0
      ? introRows[introRows.length - 1].balance
      : loanAmount;

  const remaining = Math.max(1, totalMonths - introMonths);
  const afterRun = runAmortization(balanceAtReset, adjustedRatePct, remaining);

  const fixedRun = runAmortization(loanAmount, compareFixedRatePct, totalMonths);
  const fixedRows = fixedRun.rows.slice(0, introMonths);
  const fixedBalanceAtReset =
    fixedRows.length > 0 ? fixedRows[fixedRows.length - 1].balance : loanAmount;

  const totalInterest = interestDuringIntro + afterRun.totalInterest;
  const totalPaid = introRun.monthlyPayment * introMonths + afterRun.totalPaid;
  const monthlyIncreaseAfterReset =
    afterRun.monthlyPayment - fixedRun.monthlyPayment;
  const savingDuringIntro =
    (fixedRun.monthlyPayment - introRun.monthlyPayment) * introMonths;

  return {
    introPayment: introRun.monthlyPayment,
    balanceAtReset,
    paymentAfterReset: afterRun.monthlyPayment,
    paymentChange: afterRun.monthlyPayment - introRun.monthlyPayment,
    paymentChangePct:
      introRun.monthlyPayment > 0
        ? ((afterRun.monthlyPayment - introRun.monthlyPayment) /
            introRun.monthlyPayment) *
          100
        : 0,
    interestDuringIntro,
    interestAfterReset: afterRun.totalInterest,
    totalInterest,
    totalPaid,

    fixedPayment: fixedRun.monthlyPayment,
    fixedBalanceAtReset,
    fixedTotalInterest: fixedRun.totalInterest,
    fixedTotalPaid: fixedRun.totalPaid,

    interestDifference: totalInterest - fixedRun.totalInterest,
    cheaper: totalInterest <= fixedRun.totalInterest ? "arm" : "fixed",
    savingDuringIntro,
    monthlyIncreaseAfterReset,
    monthsToEraseSaving:
      monthlyIncreaseAfterReset > 0
        ? savingDuringIntro / monthlyIncreaseAfterReset
        : null,
    balanceAdvantageAtReset: fixedBalanceAtReset - balanceAtReset,
  };
}

/* ── 预资格认定 vs 预批：同一份收入，两种口径 ──────────────────── */

export type ApprovalInput = {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  annualRate: number;
  years: number;
  annualTaxRatePct: number;
  annualInsurance: number;
  monthlyHoa: number;
  annualPmiRatePct: number;
  maxBackEndDtiPct: number;
  maxFrontEndDtiPct: number;
};

export type PreapprovalGapInput = ApprovalInput & {
  /** 申报收入里奖金 / 佣金 / 加班这类可变收入的比重 % */
  variableIncomeSharePct: number;
  /** 承保端最终认可的可变收入比重 % */
  variableIncomeAllowedPct: number;
};

export type PreapprovalGapResult = {
  statedAnnualIncome: number;
  variableIncome: number;
  recognizedVariableIncome: number;
  /** 承保端会用来算 DTI 的那份收入 */
  underwrittenAnnualIncome: number;
  incomeShortfall: number;
  incomeShortfallPct: number;
  /** 按申报收入算出的可承受房价 */
  priceAtStated: number;
  /** 按承保收入算出的可承受房价 */
  priceAtUnderwritten: number;
  priceGap: number;
  loanAtStated: number;
  loanAtUnderwritten: number;
  loanGap: number;
  housingAtStated: number;
  housingAtUnderwritten: number;
  monthlyGap: number;
  /** 承保口径下首付是否刚好卡在 LTV 80% 那条线上 */
  cappedByLtvAtUnderwritten: boolean;
};

/**
 * 预资格认定（prequalification）与预批（preapproval）之间的差额。
 *
 * 两者用的 DTI 规则是同一套，差别只在**「收入」这两个字指什么**：
 * 预资格认定按你自己报的数算，预批按承保端认可的数算。工资条上的
 * 奖金 / 佣金 / 加班不是自动全额计入的 —— 这一段差额会原样传到
 * 可承受房价上，而且是**放大**着传过去（借贷能力 = 收入 ÷ 月供系数）。
 *
 * 所以这个函数只是把 `affordableHomePrice` 用两份收入各跑一遍再相减，
 * 不引入任何新的算术。两份收入的口径差是显式入参，不内置任何
 * 「银行一般认多少」的经验值 —— 那个因贷款机构和收入类型而异。
 */
export function preapprovalGap(
  input: PreapprovalGapInput
): PreapprovalGapResult {
  const { variableIncomeSharePct, variableIncomeAllowedPct, ...base } = input;

  const statedAnnualIncome = base.annualIncome;
  const variableIncome = statedAnnualIncome * (variableIncomeSharePct / 100);
  const recognizedVariableIncome =
    variableIncome * (variableIncomeAllowedPct / 100);
  const underwrittenAnnualIncome =
    statedAnnualIncome - variableIncome + recognizedVariableIncome;

  const atStated = affordableHomePrice({
    ...base,
    annualIncome: statedAnnualIncome,
  });
  const atUnderwritten = affordableHomePrice({
    ...base,
    annualIncome: underwrittenAnnualIncome,
  });

  return {
    statedAnnualIncome,
    variableIncome,
    recognizedVariableIncome,
    underwrittenAnnualIncome,
    incomeShortfall: statedAnnualIncome - underwrittenAnnualIncome,
    incomeShortfallPct:
      statedAnnualIncome > 0
        ? ((statedAnnualIncome - underwrittenAnnualIncome) /
            statedAnnualIncome) *
          100
        : 0,
    priceAtStated: atStated.maxHomePrice,
    priceAtUnderwritten: atUnderwritten.maxHomePrice,
    priceGap: atStated.maxHomePrice - atUnderwritten.maxHomePrice,
    loanAtStated: atStated.loanAmount,
    loanAtUnderwritten: atUnderwritten.loanAmount,
    loanGap: atStated.loanAmount - atUnderwritten.loanAmount,
    housingAtStated: atStated.monthlyHousing,
    housingAtUnderwritten: atUnderwritten.monthlyHousing,
    monthlyGap: atStated.monthlyHousing - atUnderwritten.monthlyHousing,
    cappedByLtvAtUnderwritten: atUnderwritten.cappedByLtv,
  };
}

export type ApprovalRateRow = {
  ratePct: number;
  maxHomePrice: number;
  loanAmount: number;
  monthlyHousing: number;
  hasPmi: boolean;
};

/**
 * 同一份承保收入、一组利率下分别能买多贵的房。
 *
 * 预资格认定书上那个金额是**按当时的利率**算出来的，而利率不是
 * 锁定的 —— 从预资格认定到签约之间利率走高，额度会自己缩水。
 * 这个表就是用来回答「利率动多少、额度掉多少」。
 */
export function approvalRateSweep(
  input: PreapprovalGapInput,
  ratesPct: number[]
): ApprovalRateRow[] {
  const { variableIncomeSharePct, variableIncomeAllowedPct, ...base } = input;
  const variableIncome = base.annualIncome * (variableIncomeSharePct / 100);
  const recognized = variableIncome * (variableIncomeAllowedPct / 100);
  const income = base.annualIncome - variableIncome + recognized;

  return ratesPct.map((ratePct) => {
    const r = affordableHomePrice({
      ...base,
      annualIncome: income,
      annualRate: ratePct,
    });
    return {
      ratePct,
      maxHomePrice: r.maxHomePrice,
      loanAmount: r.loanAmount,
      monthlyHousing: r.monthlyHousing,
      hasPmi: r.hasPmi,
    };
  });
}

/* ── 评估价低于合同价：缺口有多大、谁来补 ──────────────────────── */

export type LowAppraisalInput = {
  contractPrice: number;
  appraisedValue: number;
  /** 计划首付现金 */
  downPayment: number;
  annualRate: number;
  years: number;
  annualPmiRatePct: number;
  /** 定金 */
  earnestMoney: number;
  /** 已经花掉的检查 / 评估等沉没成本 */
  sunkCosts: number;
};

export type AppraisalPath = {
  /** 这条路要拿出的现金 */
  cashRequired: number;
  loanAmount: number;
  /** 贷款额 ÷ 评估价（放款方真正看的 LTV，两条路都保持不变） */
  ltvPct: number;
  /** 贷款额 ÷ 合同价 */
  ltvVsContractPct: number;
  monthlyPrincipalInterest: number;
  monthlyPmi: number;
  monthlyTotal: number;
  /** 相对最初计划多掏的现金（正数 = 要多掏） */
  extraCashVsPlan: number;
};

export type LowAppraisalResult = {
  appraisalGap: number;
  appraisalGapPct: number;
  plannedLoanAmount: number;
  plannedLtvPct: number;
  maxLoanByAppraisal: number;
  /** A：按合同价成交，缺口自己用现金补 */
  payGap: AppraisalPath;
  /** B：卖方把价格降到评估价 */
  renegotiate: AppraisalPath;
  /** 缺口全自己补时要多掏的现金 = LTV × 评估缺口 */
  cashGap: number;
  gapVsDownPaymentPct: number;
  /** 走人：有评估条款则只损失已花费用 */
  walkAwayCost: number;
  /** 走人：没有评估条款，定金也拿不回来 */
  walkAwayCostNoContingency: number;
  /** 贷款变小之后每月比原计划少付多少 */
  monthlyRelief: number;
};

/**
 * 评估价低于合同价时的三条路。
 *
 * 关键机制只有一句：**放款方按「合同价与评估价里较低的那个」计算 LTV**。
 * 于是 90% LTV 的贷款在评估价上算只值 90% × 评估价，合同价与评估价
 * 之间的那段缺口，贷款一分钱都不覆盖。把两式相减可以得到一个很好用的闭式：
 *
 *   **现金缺口 = LTV × 评估缺口**
 *
 * 也就是说，LTV 越高、缺口越全部落到你自己身上 —— 首付比例越高，
 * 这个缺口反而越小。这一点和「首付越多越安全」的直觉是一致的，
 * 但和「评估低了就是首付不够」的解释完全不是一回事。
 *
 * 三条路各自算，不做推荐：走不走取决于合同里有没有评估条款、
 * 你还剩多少现金储备、以及这套房对你值多少。这里只把每一条路的
 * 现金与月供摆出来。
 */
export function lowAppraisal(input: LowAppraisalInput): LowAppraisalResult {
  const {
    contractPrice,
    appraisedValue,
    downPayment,
    annualRate,
    years,
    annualPmiRatePct,
    earnestMoney,
    sunkCosts,
  } = input;

  const months = Math.max(1, Math.round(years * 12));
  const plannedLoanAmount = Math.max(0, contractPrice - downPayment);
  const plannedLtvPct =
    contractPrice > 0 ? (plannedLoanAmount / contractPrice) * 100 : 0;
  const maxLoanByAppraisal = (plannedLtvPct / 100) * appraisedValue;
  const appraisalGap = Math.max(0, contractPrice - appraisedValue);

  const mk = (price: number, loanAmount: number): AppraisalPath => {
    const run = runAmortization(loanAmount, annualRate, months);
    const monthlyPmi =
      annualPmiRatePct > 0
        ? monthlyMortgageInsurance(loanAmount, annualPmiRatePct)
        : 0;
    const cashRequired = Math.max(0, price - loanAmount);
    return {
      cashRequired,
      loanAmount,
      ltvPct:
        appraisedValue > 0 ? (loanAmount / appraisedValue) * 100 : 0,
      ltvVsContractPct:
        contractPrice > 0 ? (loanAmount / contractPrice) * 100 : 0,
      monthlyPrincipalInterest: run.monthlyPayment,
      monthlyPmi,
      monthlyTotal: run.monthlyPayment + monthlyPmi,
      extraCashVsPlan: cashRequired - downPayment,
    };
  };

  const payGap = mk(contractPrice, maxLoanByAppraisal);
  const renegotiate = mk(appraisedValue, maxLoanByAppraisal);

  const plannedRun = runAmortization(plannedLoanAmount, annualRate, months);
  const plannedPmi =
    annualPmiRatePct > 0
      ? monthlyMortgageInsurance(plannedLoanAmount, annualPmiRatePct)
      : 0;

  return {
    appraisalGap,
    appraisalGapPct:
      contractPrice > 0 ? (appraisalGap / contractPrice) * 100 : 0,
    plannedLoanAmount,
    plannedLtvPct,
    maxLoanByAppraisal,
    payGap,
    renegotiate,
    cashGap: payGap.extraCashVsPlan,
    gapVsDownPaymentPct:
      downPayment > 0 ? (payGap.extraCashVsPlan / downPayment) * 100 : 0,
    walkAwayCost: sunkCosts,
    walkAwayCostNoContingency: sunkCosts + earnestMoney,
    monthlyRelief:
      plannedRun.monthlyPayment + plannedPmi - payGap.monthlyTotal,
  };
}

/* ── 我到底有多少房屋净值：账面、可借、能拿到手的三个数 ────────── */

export type HomeEquityInput = {
  homeValue: number;
  mortgageBalance: number;
  /** 第二顺位置押的合并 LTV（CLTV）上限 % */
  maxCltvPct: number;
  /** 卖房交易成本，占成交价 % */
  sellingCostPct: number;
  /** 取现的开办成本，占新借款 % */
  borrowingCostPct: number;
};

export type HomeEquityResult = {
  /** 账面净值 = 房价 − 贷款余额 */
  equity: number;
  equityPct: number;
  /** 贷款余额 ÷ 房价 */
  ltvPct: number;
  /** CLTV 上限对应的总债务天花板 */
  debtCeiling: number;
  /** CLTV 上限之下还能再借多少 */
  borrowableByCltv: number;
  /** 可借额度占账面净值的比重 % */
  borrowableSharePct: number;
  borrowingCost: number;
  /** 借出来并扣掉开办成本后真正到手的钱 */
  netCashFromBorrowing: number;
  sellingCosts: number;
  /** 卖房并还清贷款后到手的现金 */
  netProceedsIfSold: number;
  /** 卖房到手占账面净值的比重 % */
  netProceedsSharePct: number;
  /** 账面净值里被 CLTV 上限锁住、借不出来的部分 */
  lockedByCltv: number;
  /** 账面净值里被卖房交易成本吃掉的部分 */
  eatenBySellingCosts: number;
};

/**
 * 三个「净值」口径。
 *
 * 「我有多少净值」这句话有三种完全不同的答案，而它们之间的差距
 * 不是误差，是结构性的：
 *   ① 账面净值 = 房价 − 余额                    ← 新闻里说的那个
 *   ② 能借出来的 = CLTV 上限 × 房价 − 余额      ← 净值类产品的上限
 *   ③ 卖房到手的 = 房价 ×（1 − 交易成本）− 余额  ← 实际能落袋的
 *
 * ② 与 ① 的差距来自「押在前面的余额不参与计算」：房价必须先把
 * 现有贷款还掉，剩下的部分才轮到 80% 上限。所以房价一跌，可借额度
 * 掉得比净值快得多 —— 见 `homeEquityStress`。这一条是整页的反直觉核心。
 */
export function homeEquity(input: HomeEquityInput): HomeEquityResult {
  const {
    homeValue,
    mortgageBalance,
    maxCltvPct,
    sellingCostPct,
    borrowingCostPct,
  } = input;

  const equity = homeValue - mortgageBalance;
  const debtCeiling = (homeValue * maxCltvPct) / 100;
  const borrowableByCltv = Math.max(0, debtCeiling - mortgageBalance);
  const borrowingCost = (borrowableByCltv * borrowingCostPct) / 100;
  const sellingCosts = (homeValue * sellingCostPct) / 100;
  const netProceedsIfSold = homeValue - sellingCosts - mortgageBalance;

  return {
    equity,
    equityPct: homeValue > 0 ? (equity / homeValue) * 100 : 0,
    ltvPct: homeValue > 0 ? (mortgageBalance / homeValue) * 100 : 0,
    debtCeiling,
    borrowableByCltv,
    borrowableSharePct:
      equity > 0 ? (borrowableByCltv / equity) * 100 : 0,
    borrowingCost,
    netCashFromBorrowing: borrowableByCltv - borrowingCost,
    sellingCosts,
    netProceedsIfSold,
    netProceedsSharePct:
      equity > 0 ? (netProceedsIfSold / equity) * 100 : 0,
    lockedByCltv: Math.max(0, equity - borrowableByCltv),
    eatenBySellingCosts: Math.max(0, equity - netProceedsIfSold),
  };
}

export type HomeEquityStressRow = {
  valueChangePct: number;
  homeValue: number;
  equity: number;
  /** 变化后的贷款余额 ÷ 房价 */
  ltvPct: number;
  borrowableByCltv: number;
  /** 可借额度相对基准值的变化 % */
  borrowableChangePct: number;
  /** 账面净值相对基准值的变化 % */
  equityChangePct: number;
};

/**
 * 房价变动对三个口径的传导。
 *
 * 余额不动、房价变，于是净值按 1:1 变动，而**可借额度按杠杆倍数变动**：
 * 房价跌掉的每一块钱，都要先从「80% 天花板」里扣掉，再和不变的余额相减。
 * 结果就是可借额度的跌幅远大于净值的跌幅 —— 跌到某个点会直接归零，
 * 而那时账面净值还是正的。这就是「房价跌了，净值贷额度先消失」的算术来源。
 */
export function homeEquityStress(
  input: HomeEquityInput,
  valueChangesPct: number[]
): HomeEquityStressRow[] {
  const base = homeEquity(input);
  return valueChangesPct.map((valueChangePct) => {
    const homeValue = input.homeValue * (1 + valueChangePct / 100);
    const r = homeEquity({ ...input, homeValue });
    return {
      valueChangePct,
      homeValue,
      equity: r.equity,
      ltvPct: r.ltvPct,
      borrowableByCltv: r.borrowableByCltv,
      borrowableChangePct:
        base.borrowableByCltv > 0
          ? ((r.borrowableByCltv - base.borrowableByCltv) /
              base.borrowableByCltv) *
            100
          : 0,
      equityChangePct:
        base.equity > 0 ? ((r.equity - base.equity) / base.equity) * 100 : 0,
    };
  });
}

/* ── 债务合并：低利率但更长期，到底哪个贵 ──────────────────────── */

export type DebtConsolidationInput = {
  /** 要合并掉的债务总额 */
  debtAmount: number;
  /** 无抵押方案（个人贷）利率 % */
  unsecuredRatePct: number;
  unsecuredMonths: number;
  /** 手续费，占贷款额 %，从放款额里扣 */
  unsecuredFeePct: number;
  /** 有抵押方案（房屋净值贷）利率 % */
  securedRatePct: number;
  /** 有抵押方案的一次性成本（评估、登记等） */
  securedClosingCost: number;
  /** 有抵押方案的候选期限（月） */
  securedTermMonths: number[];
  /** 月收入，用于看月供负担 */
  monthlyIncome: number;
};

export type ConsolidationRoute = {
  label: string;
  months: number;
  ratePct: number;
  /** 你实际背上的贷款本金 */
  principal: number;
  /** 到手、可用来还清旧债的现金 */
  cashReceived: number;
  /** 为了净到手这么多而多借出来的部分 = 本金 − 到手现金 */
  feeAmount: number;
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  /** 真正的代价 = 全部还款 − 到手现金 + 一次性成本 */
  totalCost: number;
  /** 月供占月收入 % */
  paymentSharePct: number;
};

export type DebtConsolidationResult = {
  debtAmount: number;
  unsecured: ConsolidationRoute;
  secured: ConsolidationRoute[];
  cheapestOverall: ConsolidationRoute;
  /** 有抵押路线里第一个「总代价超过无抵押」的期限；没有则为 null */
  securedCostlierFromMonths: number | null;
};

/**
 * 同一笔债务，两条路：无抵押的个人贷 vs 用房子做抵押的净值贷。
 *
 * 这里要防的错误结论是「利率低就等于便宜」。两条路的期限通常不一样 ——
 * 净值贷可以拉到 10 年甚至 15 年，月供能砍掉一半，而**总代价反而更高**。
 * 利率降 3.5 个点带来的好处，很容易被期限拉长一倍吃掉。
 *
 * 口径：`totalCost` 一律是「全部还款 − 到手现金 + 一次性成本」，两条路
 * 用同一个口径，所以可以直接比。无抵押那条的手续费是从放款额里扣的，
 * 于是本金大于债务额（要净到手 $30,000 就得借更多），这部分额外本金
 * 产生的利息也算进了总代价 —— 那正是「折扣式手续费」的真实成本。
 */
export function debtConsolidation(
  input: DebtConsolidationInput
): DebtConsolidationResult {
  const {
    debtAmount,
    unsecuredRatePct,
    unsecuredMonths,
    unsecuredFeePct,
    securedRatePct,
    securedClosingCost,
    securedTermMonths,
    monthlyIncome,
  } = input;

  const unsecuredPrincipal =
    unsecuredFeePct >= 100 ? debtAmount : debtAmount / (1 - unsecuredFeePct / 100);
  const unRun = runAmortization(
    unsecuredPrincipal,
    unsecuredRatePct,
    Math.max(1, Math.round(unsecuredMonths))
  );

  const share = (payment: number) =>
    monthlyIncome > 0 ? (payment / monthlyIncome) * 100 : 0;

  const unsecured: ConsolidationRoute = {
    label: "Unsecured personal loan",
    months: unRun.months,
    ratePct: unsecuredRatePct,
    principal: unsecuredPrincipal,
    cashReceived: debtAmount,
    feeAmount: unsecuredPrincipal - debtAmount,
    monthlyPayment: unRun.monthlyPayment,
    totalPaid: unRun.totalPaid,
    totalInterest: unRun.totalInterest,
    totalCost: unRun.totalPaid - debtAmount,
    paymentSharePct: share(unRun.monthlyPayment),
  };

  const secured: ConsolidationRoute[] = securedTermMonths.map((months) => {
    const m = Math.max(1, Math.round(months));
    const run = runAmortization(debtAmount, securedRatePct, m);
    return {
      label: `Home equity loan, ${m} months`,
      months: run.months,
      ratePct: securedRatePct,
      principal: debtAmount,
      cashReceived: debtAmount,
      feeAmount: 0,
      monthlyPayment: run.monthlyPayment,
      totalPaid: run.totalPaid,
      totalInterest: run.totalInterest,
      totalCost: run.totalPaid - debtAmount + securedClosingCost,
      paymentSharePct: share(run.monthlyPayment),
    };
  });

  const all = [unsecured, ...secured];
  const cheapestOverall = all.reduce((a, b) =>
    b.totalCost < a.totalCost ? b : a
  );
  const firstCostlier = secured.find((s) => s.totalCost > unsecured.totalCost);

  return {
    debtAmount,
    unsecured,
    secured,
    cheapestOverall,
    securedCostlierFromMonths: firstCostlier ? firstCostlier.months : null,
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
