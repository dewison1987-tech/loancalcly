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
 */
export function monthsToBalance(
  principal: number,
  annualRate: number,
  years: number,
  targetBalance: number
): number {
  if (principal <= targetBalance) return 0;
  const months = Math.max(1, Math.round(years * 12));
  const payment = scheduledPayment(principal, annualRate, months);
  const r = annualRate / 100 / 12;
  let balance = principal;
  for (let i = 1; i <= months; i++) {
    const interest = balance * r;
    const principalPart = payment - interest;
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
