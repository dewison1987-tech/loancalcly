"use client";

import { useMemo, useState } from "react";
import {
  autoAmountFinanced,
  formatMoney,
  runAmortization,
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

const TERMS = [36, 48, 60, 72, 84];

/**
 * 车贷计算器。
 * 与通用计算器的区别：它先算「实际要借多少」—— 车价减首付减置换价再加销售税，
 * 因为车贷的月供高低有一大半是被这个数字决定的，而不是利率。
 */
export default function AutoLoanCalculator() {
  const [price, setPrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeIn, setTradeIn] = useState(3000);
  const [taxRate, setTaxRate] = useState(6.5);
  const [taxMode, setTaxMode] = useState("differential");
  const [months, setMonths] = useState(60);
  const [rate, setRate] = useState(7.5);

  const taxOnTradeInDifferential = taxMode === "differential";

  const { taxableBase, salesTax, amountFinanced } = useMemo(
    () =>
      autoAmountFinanced({
        price: price || 0,
        downPayment: downPayment || 0,
        tradeIn: tradeIn || 0,
        salesTaxRatePct: taxRate,
        taxOnTradeInDifferential,
      }),
    [price, downPayment, tradeIn, taxRate, taxOnTradeInDifferential]
  );

  const result = useMemo(
    () => runAmortization(amountFinanced, rate, months),
    [amountFinanced, rate, months]
  );

  // 自掏现金：首付 + 全部还款（置换车抵掉的不是现金，是资产，所以不计入）
  const cashOutlay = (downPayment || 0) + result.totalPaid;

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <Panel title="Vehicle and deal">
        <NumberField
          label="Vehicle price"
          value={price}
          onChange={setPrice}
          prefix="$"
          step={500}
          placeholder="35000"
          hint="The negotiated price, before tax and fees."
        />
        <NumberField
          label="Down payment"
          value={downPayment}
          onChange={setDownPayment}
          prefix="$"
          step={500}
          placeholder="5000"
        />
        <NumberField
          label="Trade-in value"
          value={tradeIn}
          onChange={setTradeIn}
          prefix="$"
          step={500}
          placeholder="0"
          hint="What the dealer is giving you for your current car. Leave at 0 if you are not trading one in."
        />
        <NumberField
          label="Sales tax rate"
          value={taxRate}
          onChange={setTaxRate}
          suffix="%"
          max={15}
          step={0.1}
          placeholder="6.5"
          hint={`Charged on ${formatMoney(taxableBase, 0)} here — ${formatMoney(
            salesTax
          )}.`}
        />
        <SelectField
          label="Sales tax applies to"
          value={taxMode}
          onChange={setTaxMode}
          hint="Rules vary by state and by whether the dealer handles the title work."
          options={[
            {
              value: "differential",
              label: "Price minus trade-in (trade-in credit)",
            },
            { value: "full", label: "Full purchase price" },
          ]}
        />
        <SelectField
          label="Loan term"
          value={months}
          onChange={(v) => setMonths(Number(v))}
          options={TERMS.map((m) => ({
            value: m,
            label: `${m} months (${m / 12} years)`,
          }))}
        />
        <NumberField
          label="Interest rate"
          value={rate}
          onChange={setRate}
          suffix="%"
          max={30}
          step={0.01}
          placeholder="7.5"
        />
      </Panel>

      <div className="min-w-0 space-y-4">
        <ResultHero
          label="Estimated monthly payment"
          value={formatMoney(result.monthlyPayment)}
          note={`Based on ${formatMoney(amountFinanced)} financed over ${months} months.`}
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-medium text-gray-900">How the amount financed is built</h3>
          <div className="mt-3">
            <StatGrid
              items={[
                { label: "Vehicle price", value: formatMoney(price) },
                { label: "Less down payment", value: `− ${formatMoney(downPayment)}` },
                { label: "Less trade-in", value: `− ${formatMoney(tradeIn)}` },
                { label: "Plus sales tax", value: formatMoney(salesTax) },
              ]}
            />
          </div>
          <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm">
            <span className="text-gray-500">Amount financed — </span>
            <span className="font-semibold tabular-nums text-gray-900">
              {formatMoney(amountFinanced)}
            </span>
          </div>
          <StackedBar
            segments={[
              { label: "Principal", value: amountFinanced, color: "#059669" },
              { label: "Interest", value: result.totalInterest, color: "#fb923c" },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-medium text-gray-900">What the deal really costs</h3>
          <div className="mt-3">
            <StatGrid
              items={[
                { label: "Total interest", value: formatMoney(result.totalInterest) },
                { label: "Total of payments", value: formatMoney(result.totalPaid) },
                {
                  label: "Cash out of pocket",
                  value: formatMoney(cashOutlay),
                  strong: true,
                },
                {
                  label: "Interest as a share",
                  value:
                    amountFinanced > 0
                      ? `${((result.totalInterest / amountFinanced) * 100).toFixed(1)}%`
                      : "0%",
                },
              ]}
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            &ldquo;Cash out of pocket&rdquo; is your down payment plus every
            instalment. The trade-in is not counted as cash because it is value
            you already owned — but it is still money you are giving up, which is
            why the amount financed is a cleaner way to compare two deals than the
            monthly payment alone.
          </p>
        </div>

        <ScheduleTable
          rows={result.rows}
          initial={12}
          caption="Dealer fees, registration, extended warranties and gap insurance are excluded — fold them into the price if you want them reflected."
        />
      </div>
    </div>
  );
}
