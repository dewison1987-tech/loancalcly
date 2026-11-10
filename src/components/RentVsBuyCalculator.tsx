"use client";

import { useState } from "react";
import { formatMoney, formatMonths, rentVsBuy } from "@/lib/loan";
import {
  InputWarning,
  NumberField,
  Panel,
  ResultHero,
  SelectField,
  StatGrid,
} from "@/components/CalculatorUI";

/**
 * 租买对比计算器。
 *
 * 与站上 `/rent-vs-buy` 那篇指南的分工：指南给的是**一组固定假设下的静态
 * 结论**（第 11 年追平），本页让读者改假设，看结论怎么动。两页默认值完全
 * 相同 —— 从指南跳过来的人不会看到另一个答案。
 *
 * 全部算术委托给 lib/loan.ts 的 `rentVsBuy`，本组件只做取数与排版。
 * ⚠️ 不要在下面写任何一行金额运算：这里算出来的每个数都必须能追溯到引擎输出。
 * 尤其是「首年每月持有成本」—— 引擎已单独输出 `firstYearMonthly*` 一组，
 * 不要拿 `paidTax` 这类**持有期累计值**去除以 12，那是首年值的十几倍。
 */

const HOLD_PRESETS = [5, 7, 10, 15, 20, 30] as const;

export default function RentVsBuyCalculator() {
  const [homePrice, setHomePrice] = useState(420000);
  const [downPayment, setDownPayment] = useState(42000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [taxRatePct, setTaxRatePct] = useState(1.2);
  const [insuranceYear, setInsuranceYear] = useState(1380);
  const [hoa, setHoa] = useState(0);
  const [maintenancePct, setMaintenancePct] = useState(1.0);
  const [buyCostPct, setBuyCostPct] = useState(2.5);
  const [sellCostPct, setSellCostPct] = useState(7.0);
  const [appreciationPct, setAppreciationPct] = useState(3.0);
  const [monthlyRent, setMonthlyRent] = useState(2300);
  const [inflationPct, setInflationPct] = useState(3.0);
  const [returnPct, setReturnPct] = useState(5.0);
  const [holdYears, setHoldYears] = useState(15);

  // 单一输入对象，避免下面每次计算都重复拼装；计算量极小，不需要 useMemo
  const result = rentVsBuy({
    homePrice: homePrice || 0,
    downPayment: downPayment || 0,
    annualRate: rate || 0,
    years: years || 0,
    annualTaxRatePct: taxRatePct || 0,
    annualInsurance: insuranceYear || 0,
    monthlyHoa: hoa || 0,
    annualMaintenancePct: maintenancePct || 0,
    buyingClosingCostPct: buyCostPct || 0,
    sellingCostPct: sellCostPct || 0,
    annualAppreciationPct: appreciationPct || 0,
    monthlyRent: monthlyRent || 0,
    annualInflationPct: inflationPct || 0,
    investmentReturnPct: returnPct || 0,
    holdYears: holdYears || 1,
  });

  const noDeal = (homePrice || 0) <= 0 || (holdYears || 0) < 1;
  const buyingWins = result.advantage > 0;
  const brokeEven = result.breakEvenYears !== null;

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <div className="space-y-6">
        <Panel title="The home and the loan">
          <NumberField
            label="Home price"
            value={homePrice}
            onChange={setHomePrice}
            prefix="$"
            step={10000}
            placeholder="420000"
          />
          <NumberField
            label="Down payment"
            value={downPayment}
            onChange={setDownPayment}
            prefix="$"
            step={5000}
            placeholder="42000"
            hint={`${result.downPaymentPct.toFixed(1)}% of the price.`}
          />
          <NumberField
            label="Mortgage rate"
            value={rate}
            onChange={setRate}
            suffix="%"
            max={20}
            step={0.01}
            placeholder="6.5"
          />
          <SelectField
            label="Loan term"
            value={years}
            onChange={(v) => setYears(Number(v))}
            options={[10, 15, 20, 25, 30].map((y) => ({
              value: y,
              label: `${y} years`,
            }))}
            hint="The payment is fixed for this term. That is the one number on this page that never rises."
          />
        </Panel>

        <Panel title="What owning costs">
          <NumberField
            label="Property tax rate"
            value={taxRatePct}
            onChange={setTaxRatePct}
            suffix="%"
            max={5}
            step={0.01}
            placeholder="1.2"
            hint="Per year, as a share of the price. It rises with the home's value, not with inflation."
          />
          <NumberField
            label="Home insurance"
            value={insuranceYear}
            onChange={setInsuranceYear}
            prefix="$"
            step={20}
            placeholder="1380"
            hint="Per year, first year."
          />
          <NumberField
            label="HOA fee"
            value={hoa}
            onChange={setHoa}
            prefix="$"
            step={10}
            placeholder="0"
            hint="Per month. Leave at 0 if there is no association."
          />
          <NumberField
            label="Maintenance and repairs"
            value={maintenancePct}
            onChange={setMaintenancePct}
            suffix="%"
            max={5}
            step={0.1}
            placeholder="1.0"
            hint="Per year, as a share of the price. A roof, a furnace and a water heater are not optional."
          />
          <NumberField
            label="Buying costs"
            value={buyCostPct}
            onChange={setBuyCostPct}
            suffix="%"
            max={10}
            step={0.1}
            placeholder="2.5"
            hint="Closing costs paid at purchase. This money is gone on day one."
          />
          <NumberField
            label="Selling costs"
            value={sellCostPct}
            onChange={setSellCostPct}
            suffix="%"
            max={15}
            step={0.1}
            placeholder="7.0"
            hint="Agent commission and fees taken out of the sale price at the end."
          />
        </Panel>

        <Panel title="The alternative">
          <NumberField
            label="Monthly rent"
            value={monthlyRent}
            onChange={setMonthlyRent}
            prefix="$"
            step={50}
            placeholder="2300"
            hint="What the equivalent home would rent for today."
          />
          <NumberField
            label="Rent and cost inflation"
            value={inflationPct}
            onChange={setInflationPct}
            suffix="%"
            max={15}
            step={0.1}
            placeholder="3.0"
            hint="Applied to rent and to the owner's running costs alike. Using one rate for both keeps the comparison honest."
          />
          <NumberField
            label="Return on invested cash"
            value={returnPct}
            onChange={setReturnPct}
            suffix="%"
            max={20}
            step={0.5}
            placeholder="5.0"
            hint="Earned on the down payment and on the monthly difference if you rent instead. Set it to 0 to assume the money sits idle."
          />
        </Panel>

        <Panel title="How long you stay">
          <SelectField
            label="Years before you sell"
            value={holdYears}
            onChange={(v) => setHoldYears(Number(v))}
            options={HOLD_PRESETS.map((y) => ({ value: y, label: `${y} years` }))}
            hint="The break-even is only meaningful against a holding period. Move the ceiling and the answer moves."
          />
          <NumberField
            label="Home price growth"
            value={appreciationPct}
            onChange={setAppreciationPct}
            suffix="%"
            max={15}
            step={0.1}
            placeholder="3.0"
            hint="Per year. This is the assumption the conclusion is most sensitive to — try 1% and 8%."
          />
        </Panel>
      </div>

      <div className="min-w-0 space-y-4">
        <ResultHero
          label={
            noDeal
              ? "Add a purchase price"
              : brokeEven
                ? "Buying pulls ahead in"
                : `Buying never catches up within ${holdYears} years`
          }
          value={
            noDeal ? "—" : brokeEven ? `Year ${result.breakEvenYears}` : formatMoney(Math.abs(result.advantage), 0)
          }
          note={
            noDeal
              ? "Enter a home price and a holding period to compare."
              : brokeEven
                ? `By year ${holdYears} owning is ${formatMoney(Math.abs(result.advantage), 0)} ${
                    buyingWins ? "cheaper" : "more expensive"
                  } than renting under these assumptions.`
                : `Renting stays ahead by ${formatMoney(Math.abs(result.advantage), 0)} at the end of year ${holdYears}.`
          }
        />

        {!noDeal && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="font-medium text-gray-900">Cost of each path</h3>
            <div className="mt-3">
              <StatGrid
                cols={3}
                items={[
                  {
                    label: "Cash to buy",
                    value: formatMoney(result.upfrontCash, 0),
                    strong: true,
                  },
                  {
                    label: "Monthly principal & interest",
                    value: formatMoney(result.monthlyPrincipalInterest),
                  },
                  { label: "Monthly rent", value: formatMoney(monthlyRent || 0) },
                  {
                    label: `Net cost of owning, ${holdYears} yrs`,
                    value: formatMoney(result.buyNetCost, 0),
                  },
                  {
                    label: `Net cost of renting, ${holdYears} yrs`,
                    value: formatMoney(result.rentNetCost, 0),
                  },
                  {
                    label: "Renter's portfolio at exit",
                    value: formatMoney(result.portfolioValue, 0),
                  },
                ]}
              />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Net cost is what each path consumes, not what it costs before the house is
              sold. Owning is credited with the sale proceeds after selling costs and the
              remaining loan balance; renting is credited with the invested difference. A{" "}
              negative number would mean the path made money.
            </p>
          </div>
        )}

        {!noDeal && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="font-medium text-gray-900">
              What the first year of owning costs each month
            </h3>
            <div className="mt-3">
                <StatGrid
                  cols={3}
                  items={[
                    {
                      label: "Principal & interest",
                      value: formatMoney(result.monthlyPrincipalInterest),
                    },
                    { label: "Property tax", value: formatMoney(result.firstYearMonthlyTax) },
                    {
                      label: "Insurance",
                      value: formatMoney(result.firstYearMonthlyInsurance),
                    },
                    {
                      label: "Maintenance",
                      value: formatMoney(result.firstYearMonthlyMaintenance),
                    },
                    { label: "HOA", value: formatMoney(result.firstYearMonthlyHoa) },
                    {
                      label: "Total, first year",
                      value: formatMoney(result.firstYearMonthlyHousing),
                      strong: true,
                    },
                  ]}
                />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Only the first line is fixed for the life of the loan. The rest drift with
              inflation and with the assessed value of the home — which is why the monthly
              gap against rent narrows in the later years and then reverses.
            </p>
          </div>
        )}

        {noDeal && (
          <InputWarning>
            A comparison needs a purchase price and at least one year of ownership.
            Everything else can stay at zero.
          </InputWarning>
        )}

        {!noDeal && result.byYear.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
              <h3 className="font-medium text-gray-900">Year by year</h3>
              <span className="whitespace-nowrap text-sm text-gray-500">
                {formatMonths(result.holdMonths)} of ownership
              </span>
            </div>
            <div className="max-h-96 overflow-x-auto overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 text-left text-gray-500">
                  <tr>
                    <th className="px-4 py-2 font-medium">Year</th>
                    <th className="px-4 py-2 font-medium">Cost of owning</th>
                    <th className="px-4 py-2 font-medium">Cost of renting</th>
                    <th className="px-4 py-2 text-right font-medium">
                      Owning advantage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.byYear.map((row) => {
                    const isBreak = result.breakEvenYears === row.year;
                    return (
                      <tr
                        key={row.year}
                        className={
                          isBreak
                            ? "bg-emerald-50 font-medium tabular-nums text-gray-900"
                            : "tabular-nums text-gray-600"
                        }
                      >
                        <td className="px-4 py-2">
                          {row.year}
                          {isBreak && (
                            <span className="ml-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                              break-even
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2">
                          {formatMoney(row.buyNetCost, 0)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2">
                          {formatMoney(row.rentNetCost, 0)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 text-right">
                          {row.advantage >= 0 ? "+" : "−"}
                          {formatMoney(Math.abs(row.advantage), 0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="border-t border-gray-100 px-5 py-3 text-xs leading-relaxed text-gray-500">
              Each row is the cumulative position at the end of that year, including the
              cost of selling. A negative advantage means renting is ahead at that point.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
