"use client";

import { useState } from "react";
import { affordableHomePrice, formatMoney, formatPercent, monthsToBalance } from "@/lib/loan";
import {
  InputWarning,
  NumberField,
  Panel,
  ResultHero,
  SelectField,
  StackedBar,
  StatGrid,
} from "@/components/CalculatorUI";

/**
 * 可负担性计算器 —— 房贷计算器的反方向。
 *
 * 那个页面回答「这个价位的房子，月供多少」；这个页面回答「我的收入能撑起
 * 多少钱的房子」。顺序反了，结论也常常反：能借到的最大金额和还得起的金额
 * 不是同一个数，而多数人是从挂牌价开始倒推的。
 *
 * 全部算术委托给 lib/loan.ts 的 `affordableHomePrice`，本组件只做取数与排版。
 */
const DTI_PRESETS = [
  {
    value: "28/36",
    label: "28% housing / 36% all debt",
    front: 28,
    back: 36,
  },
  {
    value: "36/43",
    label: "36% housing / 43% all debt",
    front: 36,
    back: 43,
  },
] as const;

export default function AffordabilityCalculator() {
  const [income, setIncome] = useState(100000);
  const [debts, setDebts] = useState(500);
  const [downPayment, setDownPayment] = useState(60000);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(6.5);
  const [taxRate, setTaxRate] = useState(1.2);
  const [insuranceYear, setInsuranceYear] = useState(1800);
  const [hoaMonthly, setHoaMonthly] = useState(0);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [dti, setDti] = useState<string>(DTI_PRESETS[0].value);

  const active = DTI_PRESETS.find((d) => d.value === dti) ?? DTI_PRESETS[0];
  const other = DTI_PRESETS.find((d) => d.value !== active.value) ?? DTI_PRESETS[1];

  // 闭式解，计算量极小，不需要 useMemo —— 也就不必为依赖数组写豁免注释
  const shared = {
    annualIncome: income || 0,
    monthlyDebts: debts || 0,
    downPayment: downPayment || 0,
    annualRate: rate || 0,
    years: years || 0,
    annualTaxRatePct: taxRate || 0,
    annualInsurance: insuranceYear || 0,
    monthlyHoa: hoaMonthly || 0,
    annualPmiRatePct: pmiRate || 0,
  };

  const result = affordableHomePrice({
    ...shared,
    maxBackEndDtiPct: active.back,
    maxFrontEndDtiPct: active.front,
  });

  const altResult = affordableHomePrice({
    ...shared,
    maxBackEndDtiPct: other.back,
    maxFrontEndDtiPct: other.front,
  });

  const noRoom = result.loanAmount <= 0;

  const pmiMonths =
    result.hasPmi && result.loanAmount > 0
      ? monthsToBalance(result.loanAmount, rate || 0, years || 1, result.maxHomePrice * 0.8)
      : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <div className="space-y-6">
        <Panel title="Your finances">
          <NumberField
            label="Household income"
            value={income}
            onChange={setIncome}
            prefix="$"
            step={1000}
            placeholder="100000"
            hint="Per year, before tax."
          />
          <NumberField
            label="Monthly debt payments"
            value={debts}
            onChange={setDebts}
            prefix="$"
            step={50}
            placeholder="500"
            hint="Car loans, student loans, minimum card payments. Not rent, food or utilities — lenders exclude ordinary living costs."
          />
          <NumberField
            label="Cash for a down payment"
            value={downPayment}
            onChange={setDownPayment}
            prefix="$"
            step={5000}
            placeholder="60000"
          />
          <SelectField
            label="Debt-to-income limit"
            value={dti}
            onChange={setDti}
            options={DTI_PRESETS.map((d) => ({ value: d.value, label: d.label }))}
            hint="How much of your income a lender is willing to see committed. The wider setting approves more house — it does not make it more affordable."
          />
        </Panel>

        <Panel title="The property and the loan">
          <SelectField
            label="Loan term"
            value={years}
            onChange={(v) => setYears(Number(v))}
            options={[10, 15, 20, 25, 30].map((y) => ({
              value: y,
              label: `${y} years (${y * 12} months)`,
            }))}
          />
          <NumberField
            label="Interest rate"
            value={rate}
            onChange={setRate}
            suffix="%"
            max={20}
            step={0.01}
            placeholder="6.5"
          />
          <NumberField
            label="Property tax rate"
            value={taxRate}
            onChange={setTaxRate}
            suffix="%"
            max={5}
            step={0.01}
            placeholder="1.2"
            hint="Per year, as a share of the purchase price. This is why a more expensive house costs more than the loan alone."
          />
          <NumberField
            label="Home insurance"
            value={insuranceYear}
            onChange={setInsuranceYear}
            prefix="$"
            step={50}
            placeholder="1800"
            hint="Per year."
          />
          <NumberField
            label="HOA fee"
            value={hoaMonthly}
            onChange={setHoaMonthly}
            prefix="$"
            step={10}
            placeholder="0"
            hint="Per month. Leave at 0 if there is no homeowners association."
          />
          <NumberField
            label="Mortgage insurance rate"
            value={pmiRate}
            onChange={setPmiRate}
            suffix="%"
            max={3}
            step={0.05}
            placeholder="0.5"
            hint="Per year, charged on the loan amount while the down payment is under 20%."
          />
        </Panel>
      </div>

      <div className="min-w-0 space-y-4">
        <ResultHero
          label="Home price these numbers support"
          value={noRoom ? "$0" : formatMoney(result.maxHomePrice, 0)}
          note={
            noRoom
              ? "At this income and debt level there is no room left for a mortgage payment."
              : `With ${formatMoney(downPayment || 0, 0)} down and a ${formatPercent(
                  active.back
                )} total-debt ceiling.`
          }
        />

        {noRoom && (
          <InputWarning>
            Your fixed monthly obligations already consume the whole debt-to-income
            allowance. Lowering the monthly debt figure, raising the income figure, or
            moving to the wider debt-to-income setting are the only things that change
            this — a bigger down payment alone will not.
          </InputWarning>
        )}

        {!noRoom && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="font-medium text-gray-900">
              What that monthly payment is made of
            </h3>
            <div className="mt-3">
              <StatGrid
                cols={3}
                items={[
                  { label: "Loan amount", value: formatMoney(result.loanAmount, 0) },
                  {
                    label: "Principal & interest",
                    value: formatMoney(result.monthlyPrincipalInterest),
                  },
                  { label: "Property tax", value: formatMoney(result.monthlyTax) },
                  { label: "Home insurance", value: formatMoney(result.monthlyInsurance) },
                  { label: "HOA", value: formatMoney(result.monthlyHoa) },
                  {
                    label: "Mortgage insurance",
                    value: result.hasPmi ? formatMoney(result.monthlyPmi) : "—",
                  },
                ]}
              />
            </div>
            <StackedBar
              segments={[
                {
                  label: "Principal & interest",
                  value: result.monthlyPrincipalInterest,
                  color: "#059669",
                },
                { label: "Property tax", value: result.monthlyTax, color: "#0d9488" },
                { label: "Insurance", value: result.monthlyInsurance, color: "#38bdf8" },
                { label: "HOA", value: result.monthlyHoa, color: "#a78bfa" },
                { label: "Mortgage insurance", value: result.monthlyPmi, color: "#fb923c" },
              ]}
            />
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Total housing cost{" "}
              <strong className="text-gray-900">{formatMoney(result.monthlyHousing)}</strong>{" "}
              a month, against {formatMoney((income || 0) / 12, 0)} of gross monthly income.
            </p>
          </div>
        )}

        {!noRoom && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="font-medium text-gray-900">What is actually capping you</h3>
            <div className="mt-3">
              <StatGrid
                cols={3}
                items={[
                  {
                    label: "Housing share of income",
                    value: formatPercent(result.frontEndRatioPct),
                    strong: true,
                  },
                  {
                    label: "All debt share of income",
                    value: formatPercent(result.backEndRatioPct),
                    strong: true,
                  },
                  {
                    label: "Down payment is",
                    value: formatPercent(result.downPaymentPct),
                  },
                ]}
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              {result.bindingConstraint === "front" ? (
                <>
                  The <strong>housing</strong> limit is the binding constraint here: your
                  other debts are small enough that the ceiling on housing cost is what
                  stops you, not the ceiling on total debt.
                </>
              ) : (
                <>
                  The <strong>total-debt</strong> limit is the binding constraint here:
                  your existing monthly debts are eating the allowance that would
                  otherwise go to housing. Paying one of them down raises this number
                  more than any change to the down payment.
                </>
              )}{" "}
              On the wider {other.front}% / {other.back}% setting, the same numbers
              would support{" "}
              <strong className="text-gray-900">
                {formatMoney(altResult.maxHomePrice, 0)}
              </strong>
              .
            </p>
          </div>
        )}

        {result.hasPmi && pmiMonths > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
            <h3 className="font-medium text-gray-900">
              Mortgage insurance is charged on top of everything else
            </h3>
            <div className="mt-3">
              <StatGrid
                cols={3}
                items={[
                  { label: "Monthly PMI", value: formatMoney(result.monthlyPmi), strong: true },
                  { label: "Falls off around", value: `Month ${pmiMonths}`, strong: true },
                  {
                    label: "Total PMI paid",
                    value: formatMoney(result.monthlyPmi * pmiMonths),
                    strong: true,
                  },
                ]}
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Every dollar of PMI is a dollar of debt-to-income allowance that cannot go
              towards the loan itself — which is why a smaller down payment here buys a
              cheaper house, not a more expensive one. That month is when the balance
              reaches 80% of the purchase price; conventional loans normally allow a
              borrower to ask for cancellation at that point and terminate automatically
              at 78%. Government-backed loans follow their own rules.
            </p>
          </div>
        )}

        {result.cappedByLtv && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="font-medium text-gray-900">
              You are being capped by the 20% down payment line
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Your income supports a larger loan, but borrowing past four times your down
              payment would put the loan above 80% of the purchase price and trigger
              mortgage insurance — and that premium, added to the payment, would put the
              larger loan out of reach anyway. The figure above is the largest price that
              is stable under both conditions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
