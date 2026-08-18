"use client";

import { useMemo, useState } from "react";
import { calculateLoan, formatMoney } from "@/lib/loan";

const YEARS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState(250000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [showAll, setShowAll] = useState(false);

  const result = useMemo(
    () => calculateLoan(principal || 0, rate, years),
    [principal, rate, years]
  );

  const principalPct =
    result.totalPayment > 0
      ? ((principal / result.totalPayment) * 100).toFixed(1)
      : "0";
  const interestPct =
    result.totalPayment > 0
      ? ((result.totalInterest / result.totalPayment) * 100).toFixed(1)
      : "0";

  const visibleRows = showAll
    ? result.schedule
    : result.schedule.slice(0, 12);

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      {/* 输入区 */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Loan details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Loan amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                $
              </span>
              <input
                type="number"
                value={principal || ""}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                min={0}
                placeholder="250000"
                className={`${inputCls} pl-8`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Annual interest rate (APR) — {rate}%
            </label>
            <input
              type="range"
              min={0}
              max={20}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Loan term
            </label>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className={inputCls}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y} year{y > 1 ? "s" : ""} ({y * 12} months)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 结果区 */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
          <p className="text-sm font-medium text-emerald-700">
            Estimated monthly payment
          </p>
          <p className="mt-1 text-4xl font-semibold tracking-tight text-gray-900">
            {formatMoney(result.monthlyPayment)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white/80 p-3">
              <p className="text-gray-500">Total interest</p>
              <p className="mt-0.5 font-medium text-gray-900">
                {formatMoney(result.totalInterest)}
              </p>
            </div>
            <div className="rounded-xl bg-white/80 p-3">
              <p className="text-gray-500">Total payment</p>
              <p className="mt-0.5 font-medium text-gray-900">
                {formatMoney(result.totalPayment)}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/80">
              <div
                className="bg-emerald-500"
                style={{ width: `${principalPct}%` }}
              />
              <div
                className="bg-orange-400"
                style={{ width: `${interestPct}%` }}
              />
            </div>
            <div className="mt-2 flex gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Principal {principalPct}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                Interest {interestPct}%
              </span>
            </div>
          </div>
        </div>

        {/* 还款计划表 */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
            <h3 className="font-medium text-gray-900">Amortization schedule</h3>
            <span className="text-sm text-gray-500">
              Showing {visibleRows.length} of {result.schedule.length} months
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-5 py-2 font-medium">Month</th>
                  <th className="px-5 py-2 font-medium">Payment</th>
                  <th className="px-5 py-2 font-medium">Principal</th>
                  <th className="px-5 py-2 font-medium">Interest</th>
                  <th className="px-5 py-2 text-right font-medium">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibleRows.map((row) => (
                  <tr key={row.month} className="text-gray-600">
                    <td className="px-5 py-2">{row.month}</td>
                    <td className="px-5 py-2">
                      {formatMoney(row.payment)}
                    </td>
                    <td className="px-5 py-2">{formatMoney(row.principal)}</td>
                    <td className="px-5 py-2">{formatMoney(row.interest)}</td>
                    <td className="px-5 py-2 text-right">
                      {formatMoney(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.schedule.length > 12 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full border-t border-gray-100 py-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
            >
              {showAll ? "Show first 12 months" : `Show full schedule (${result.schedule.length} months)`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
