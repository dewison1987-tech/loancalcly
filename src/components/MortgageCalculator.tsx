"use client";

import { useMemo, useState } from "react";
import {
  calculateLoan,
  downPaymentRatio,
  formatMoney,
  formatPercent,
  monthlyMortgageInsurance,
  monthlyPropertyTax,
  monthsToBalance,
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
 * 房贷计算器。
 * 与通用贷款计算器的区别：它算的是 PITI —— 本金利息 + 房产税 + 保险 + HOA
 * （首付不足 20% 时再加按揭保险），也就是业主每月真正从账户里出去的钱。
 */
export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [taxRate, setTaxRate] = useState(1.2);
  const [insuranceYear, setInsuranceYear] = useState(1800);
  const [hoaMonthly, setHoaMonthly] = useState(0);
  const [pmiRate, setPmiRate] = useState(0.5);

  const loanAmount = Math.max(0, (homePrice || 0) - (downPayment || 0));
  const ratio = downPaymentRatio(homePrice || 0, downPayment || 0);
  const needsPmi = ratio < 0.2 && loanAmount > 0;

  const result = useMemo(
    () => calculateLoan(loanAmount, rate, years),
    [loanAmount, rate, years]
  );

  const propertyTax = monthlyPropertyTax(homePrice || 0, taxRate);
  const insurance = (insuranceYear || 0) / 12;
  const pmi = needsPmi
    ? monthlyMortgageInsurance(loanAmount, pmiRate)
    : 0;

  const piti = result.monthlyPayment + propertyTax + insurance + hoaMonthly + pmi;

  // 余额跌到房价 80% 的那一期 —— 按揭保险的取消门槛
  const pmiMonths = needsPmi
    ? monthsToBalance(loanAmount, rate, years, (homePrice || 0) * 0.8)
    : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <Panel title="Home and loan">
        <NumberField
          label="Home price"
          value={homePrice}
          onChange={setHomePrice}
          prefix="$"
          placeholder="400000"
        />
        <NumberField
          label="Down payment"
          value={downPayment}
          onChange={setDownPayment}
          prefix="$"
          placeholder="80000"
          hint={`${formatPercent(ratio * 100)} of the purchase price · loan amount ${formatMoney(
            loanAmount,
            0
          )}`}
        />
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
          hint={`Per year, as a share of the purchase price — ${formatMoney(
            propertyTax
          )} a month here.`}
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
          hint="Per month. Leave at 0 if the property has no homeowners association."
        />
        <NumberField
          label="Mortgage insurance rate"
          value={pmiRate}
          onChange={setPmiRate}
          suffix="%"
          max={3}
          step={0.05}
          placeholder="0.5"
          hint={
            needsPmi
              ? `Per year, on the loan amount — ${formatMoney(
                  monthlyMortgageInsurance(loanAmount, pmiRate)
                )} a month. Quoted PMI commonly falls between about 0.3% and 1.5%.`
              : "Not charged while the down payment is 20% or more."
          }
        />
      </Panel>

      <div className="min-w-0 space-y-4">
        <ResultHero
          label="Estimated monthly payment"
          value={formatMoney(piti)}
          note="Principal, interest, property tax, insurance, HOA and any mortgage insurance."
        />

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-medium text-gray-900">Where the payment goes</h3>
          <div className="mt-3">
            <StatGrid
              cols={3}
              items={[
                {
                  label: "Principal & interest",
                  value: formatMoney(result.monthlyPayment),
                },
                { label: "Property tax", value: formatMoney(propertyTax) },
                { label: "Home insurance", value: formatMoney(insurance) },
                { label: "HOA", value: formatMoney(hoaMonthly) },
                {
                  label: "Mortgage insurance",
                  value: needsPmi ? formatMoney(pmi) : "—",
                },
                { label: "Total monthly", value: formatMoney(piti), strong: true },
              ]}
            />
          </div>
          <StackedBar
            segments={[
              { label: "Principal & interest", value: result.monthlyPayment, color: "#059669" },
              { label: "Property tax", value: propertyTax, color: "#0d9488" },
              { label: "Insurance", value: insurance, color: "#38bdf8" },
              { label: "HOA", value: hoaMonthly, color: "#a78bfa" },
              { label: "Mortgage insurance", value: pmi, color: "#fb923c" },
            ]}
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="font-medium text-gray-900">Over the life of the loan</h3>
          <div className="mt-3">
            <StatGrid
              items={[
                { label: "Loan amount", value: formatMoney(loanAmount) },
                { label: "Total interest", value: formatMoney(result.totalInterest) },
                {
                  label: "Total principal + interest",
                  value: formatMoney(result.totalPayment),
                },
                {
                  label: "Of which interest",
                  value:
                    result.totalPayment > 0
                      ? formatPercent((result.totalInterest / result.totalPayment) * 100)
                      : "0%",
                },
              ]}
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            Tax, insurance, HOA and mortgage insurance sit outside that total —
            they are ongoing costs of owning the property rather than costs of
            the loan, and they are not fixed over 30 years.
          </p>
        </div>

        {needsPmi && pmiMonths > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
            <h3 className="font-medium text-gray-900">
              Mortgage insurance is the expensive part of a small down payment
            </h3>
            <div className="mt-3">
              <StatGrid
                cols={3}
                items={[
                  {
                    label: "Monthly PMI",
                    value: formatMoney(pmi),
                    strong: true,
                  },
                  {
                    label: "Falls off around",
                    value: `Month ${pmiMonths}`,
                    strong: true,
                  },
                  {
                    label: "Total PMI paid",
                    value: formatMoney(pmi * pmiMonths),
                    strong: true,
                  },
                ]}
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              That month is when the balance reaches 80% of the purchase price —
              the point at which a borrower with a conventional loan can normally
              ask the servicer to cancel PMI. Automatic termination comes later,
              at 78%. Government-backed loans follow their own rules, so check
              your loan documents rather than assuming these thresholds.
            </p>
          </div>
        )}

        <ScheduleTable
          rows={result.schedule}
          caption="Principal and interest only — property tax, insurance and HOA are not part of the amortization."
        />
      </div>
    </div>
  );
}
