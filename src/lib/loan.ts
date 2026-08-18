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

export function calculateLoan(
  principal: number,
  annualRate: number,
  years: number
): LoanResult {
  const r = annualRate / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));

  const monthlyPayment =
    r === 0
      ? principal / n
      : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

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

  return { monthlyPayment, totalPayment: monthlyPayment * n, totalInterest, schedule };
}

export function formatMoney(v: number): string {
  return v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}
