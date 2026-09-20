"use client";

import { useMemo, useState } from "react";
import {
  calculateLoan,
  compareExtraPayment,
  formatMoney,
  formatMonths,
} from "@/lib/loan";
import {
  InputWarning,
  NumberField,
  Panel,
  ResultHero,
  ScheduleTable,
  SelectField,
  StackedBar,
  StatGrid,
} from "@/components/CalculatorUI";

const DEFAULT_TERMS = Array.from({ length: 30 }, (_, i) => i + 1);

export type LoanCalculatorProps = {
  /** 金额字段的标签，比如 "Loan amount" / "Tuition balance" */
  amountLabel?: string;
  amountHint?: string;
  defaultPrincipal?: number;
  defaultRate?: number;
  defaultYears?: number;
  /** 期限下拉提供的年份选项 */
  termOptions?: number[];
  /** 是否显示「每期额外还款」输入与提前还清结论 */
  showExtraPayment?: boolean;
  extraLabel?: string;
  /** 利率上限，个人贷等产品可以放宽 */
  maxRate?: number;
  rateLabel?: string;
};

export default function LoanCalculator({
  amountLabel = "Loan amount",
  amountHint,
  defaultPrincipal = 250000,
  defaultRate = 6.5,
  defaultYears = 30,
  termOptions = DEFAULT_TERMS,
  showExtraPayment = false,
  extraLabel = "Extra monthly payment",
  maxRate = 30,
  rateLabel = "Annual interest rate (APR)",
}: LoanCalculatorProps) {
  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [rate, setRate] = useState(defaultRate);
  const [years, setYears] = useState(defaultYears);
  const [extra, setExtra] = useState(0);

  const result = useMemo(
    () => calculateLoan(principal || 0, rate, years),
    [principal, rate, years]
  );

  const faster = useMemo(
    () =>
      showExtraPayment && extra > 0
        ? compareExtraPayment(principal || 0, rate, years, extra)
        : null,
    [showExtraPayment, principal, rate, years, extra]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <Panel title="Loan details">
        <NumberField
          label={amountLabel}
          value={principal}
          onChange={setPrincipal}
          prefix="$"
          placeholder={String(defaultPrincipal)}
          hint={amountHint}
        />
        <NumberField
          label={rateLabel}
          value={rate}
          onChange={setRate}
          suffix="%"
          max={maxRate}
          step={0.01}
          placeholder={String(defaultRate)}
        />
        <SelectField
          label="Loan term"
          value={years}
          onChange={(v) => setYears(Number(v))}
          options={termOptions.map((y) => ({
            value: y,
            label: `${y} year${y > 1 ? "s" : ""} (${y * 12} months)`,
          }))}
        />
        {showExtraPayment && (
          <NumberField
            label={extraLabel}
            value={extra}
            onChange={setExtra}
            prefix="$"
            placeholder="0"
            hint="Applied to principal every month. Fixed-rate loans normally allow this without penalty — check yours first."
          />
        )}
      </Panel>

      <div className="min-w-0 space-y-4">
        <ResultHero
          label="Estimated monthly payment"
          value={formatMoney(result.monthlyPayment)}
          note={
            faster && extra > 0
              ? `With ${formatMoney(extra)} extra each month you would pay it off in ${formatMonths(
                  faster.months
                )} instead of ${formatMonths(faster.baseMonths)}.`
              : undefined
          }
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <StatGrid
            items={[
              { label: "Total interest", value: formatMoney(result.totalInterest) },
              { label: "Total payment", value: formatMoney(result.totalPayment) },
            ]}
          />
          <StackedBar
            segments={[
              { label: "Principal", value: principal, color: "#059669" },
              { label: "Interest", value: result.totalInterest, color: "#fb923c" },
            ]}
          />
        </div>

        {faster && extra > 0 && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
            <h3 className="font-medium text-gray-900">
              Effect of {formatMoney(extra)} a month extra
            </h3>
            <div className="mt-3">
              <StatGrid
                cols={3}
                items={[
                  { label: "Paid off in", value: formatMonths(faster.months), strong: true },
                  {
                    label: "Time saved",
                    value: formatMonths(faster.monthsSaved),
                    strong: true,
                  },
                  {
                    label: "Interest saved",
                    value: formatMoney(faster.interestSaved),
                    strong: true,
                  },
                ]}
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Total interest falls from {formatMoney(faster.baseInterest)} to{" "}
              {formatMoney(faster.totalInterest)}. The extra money is not a fee —
              every dollar of it reduces the balance, which is why the saving is
              so much larger than the amount paid in.
            </p>
          </div>
        )}

        {showExtraPayment && extra > 0 && fastCheck(faster) && (
          <InputWarning>
            At {formatMoney(extra)} extra per month the additional payments are
            barely ahead of the interest being charged, so the payoff date
            barely moves. Try a larger extra payment or a lower rate.
          </InputWarning>
        )}

        <ScheduleTable
          rows={result.schedule}
          caption="Each row shows how the same payment splits differently as the balance falls — the interest column shrinks and the principal column grows."
        />
      </div>
    </div>
  );
}

/** 额外还款效果过弱时给出提醒（避免用户以为计算器坏了） */
function fastCheck(f: { monthsSaved: number } | null): boolean {
  return !!f && f.monthsSaved < 1;
}
