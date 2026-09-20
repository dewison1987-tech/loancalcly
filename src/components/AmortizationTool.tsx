"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculateLoan,
  compareExtraPayment,
  formatMoney,
  formatMonths,
  yearlySummary,
} from "@/lib/loan";
import {
  NumberField,
  Panel,
  ResultHero,
  ScheduleTable,
  SelectField,
  StackedBar,
  StatGrid,
} from "@/components/CalculatorUI";

/**
 * 摊销表计算器。
 * 与通用贷款计算器的区别：重心在「明细」—— 逐年汇总 + 逐月明细，
 * 外加一个额外还款开关，把「多还的钱到底省在哪儿」直接摊开给人看。
 */
export default function AmortizationTool() {
  const [principal, setPrincipal] = useState(300000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [extra, setExtra] = useState(0);

  const base = useMemo(
    () => calculateLoan(principal || 0, rate, years),
    [principal, rate, years]
  );

  const faster = useMemo(
    () =>
      extra > 0 ? compareExtraPayment(principal || 0, rate, years, extra) : null,
    [principal, rate, years, extra]
  );

  const activeRows = faster ? faster.rows : base.schedule;
  const years_ = useMemo(() => yearlySummary(activeRows), [activeRows]);

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <Panel title="Loan and repayment">
        <NumberField
          label="Loan amount"
          value={principal}
          onChange={setPrincipal}
          prefix="$"
          step={5000}
          placeholder="300000"
        />
        <NumberField
          label="Annual interest rate"
          value={rate}
          onChange={setRate}
          suffix="%"
          max={30}
          step={0.01}
          placeholder="6.5"
        />
        <SelectField
          label="Loan term"
          value={years}
          onChange={(v) => setYears(Number(v))}
          options={[5, 10, 15, 20, 25, 30].map((y) => ({
            value: y,
            label: `${y} years (${y * 12} months)`,
          }))}
        />
        <NumberField
          label="Extra monthly payment"
          value={extra}
          onChange={setExtra}
          prefix="$"
          step={25}
          placeholder="0"
          hint="Optional. Everything above goes straight to principal, which is why it shortens the loan instead of lowering the payment."
        />
      </Panel>

      <div className="min-w-0 space-y-4">
        <ResultHero
          label="Scheduled monthly payment"
          value={formatMoney(base.monthlyPayment)}
          note={
            faster
              ? `You would actually pay ${formatMoney(
                  base.monthlyPayment + (extra || 0)
                )} a month and finish in ${formatMonths(faster.months)}.`
              : `Paid over ${formatMonths(base.schedule.length)}, with no extra payments.`
          }
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <StatGrid
            items={[
              { label: "Total interest", value: formatMoney(activeRowsTotalInterest(activeRows)) },
              {
                label: "Total payments",
                value: formatMoney(activeRows.reduce((s, r) => s + r.payment, 0)),
              },
              { label: "Months", value: String(activeRows.length) },
              {
                label: "Payoff date",
                value: <PayoffDate months={activeRows.length} />,
              },
            ]}
          />
          <StackedBar
            segments={[
              { label: "Principal", value: principal, color: "#059669" },
              {
                label: "Interest",
                value: activeRowsTotalInterest(activeRows),
                color: "#fb923c",
              },
            ]}
          />
        </div>

        {faster && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
            <h3 className="font-medium text-gray-900">
              {formatMoney(extra)} a month extra, compared with the schedule
            </h3>
            <div className="mt-3">
              <StatGrid
                cols={3}
                items={[
                  {
                    label: "Loan ends",
                    value: formatMonths(faster.months),
                    strong: true,
                  },
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
              {formatMoney(extra * faster.months)} of extra payments removes{" "}
              {formatMoney(faster.interestSaved)} of interest. Payments made in the
              first few years do far more work than the same amount paid near the
              end — at the start almost the whole instalment is interest, so
              anything above it hits the balance almost one for one. Our guide to{" "}
              <a
                href="/how-loan-amortization-works"
                className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
              >
                how loan amortization works
              </a>{" "}
              walks through the mechanism.
            </p>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 px-5 py-3">
            <h3 className="font-medium text-gray-900">Year by year</h3>
          </div>
          <div className="max-h-96 overflow-x-auto overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-5 py-2 font-medium">Year</th>
                  <th className="px-5 py-2 font-medium">Principal paid</th>
                  <th className="px-5 py-2 font-medium">Interest paid</th>
                  <th className="px-5 py-2 text-right font-medium">Balance left</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {years_.map((y) => (
                  <tr key={y.year} className="tabular-nums text-gray-600">
                    <td className="px-5 py-2">{y.year}</td>
                    <td className="px-5 py-2">{formatMoney(y.principal)}</td>
                    <td className="px-5 py-2">{formatMoney(y.interest)}</td>
                    <td className="px-5 py-2 text-right">{formatMoney(y.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ScheduleTable
          rows={activeRows}
          caption="The monthly detail behind the yearly totals above."
        />
      </div>
    </div>
  );
}

function activeRowsTotalInterest(rows: { interest: number }[]): number {
  return rows.reduce((s, r) => s + r.interest, 0);
}

/**
 * 结清月份。
 *
 * 为什么要放在 effect 里算：这是静态生成的页面，构建时就渲染过一遍 HTML。
 * 如果直接在渲染期调用 new Date()，构建月份与访问月份不一致时会产生 hydration 不匹配，
 * 而且构建时的日期会一直印在页面上直到重新构建。
 */
function PayoffDate({ months }: { months: number }) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    // 这里就是要"挂载后再 setState"：构建期的日期不该出现在静态 HTML 里。
    // 规则本身针对的是无意义的级联渲染，此处是刻意的客户端专属值，故显式豁免。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLabel(
      d.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    );
  }, [months]);
  return <>{label || "—"}</>;
}
