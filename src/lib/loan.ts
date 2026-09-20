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
