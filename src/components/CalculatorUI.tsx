"use client";

import { useMemo, useState } from "react";
import type { PaymentRow } from "@/lib/loan";
import { formatMoney } from "@/lib/loan";

/**
 * 四个计算器共用的输入控件与结果排版。
 * 目的是让「数字长什么样」只有一套实现，避免各页面各写一份导致读起来不像同一个站。
 */

export const inputCls =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

export function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step,
  placeholder,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {prefix}
          </span>
        )}
        {/* 0 显示为空串，否则用户没法把字段清空重打 */}
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) && value !== 0 ? value : ""}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`${inputCls} ${prefix ? "pl-8" : ""} ${suffix ? "pr-9" : ""}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{hint}</p>}
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
}: {
  label: string;
  value: number | string;
  onChange: (v: string) => void;
  options: { value: number | string; label: string }[];
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-gray-500">{hint}</p>}
    </div>
  );
}

export function Panel({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
      <div className={title ? "mt-4 space-y-4" : "space-y-4"}>{children}</div>
    </div>
  );
}

/** 大数字结果块 —— 字号自适应，金额再长也不会把卡片撑破 */
export function ResultHero({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <p className="text-sm font-medium text-emerald-700">{label}</p>
      <p className="mt-1 overflow-hidden whitespace-nowrap text-[clamp(1.5rem,4.5vw,2.5rem)] font-semibold leading-tight tracking-tight tabular-nums text-gray-900">
        {value}
      </p>
      {note && <p className="mt-2 text-sm text-gray-600">{note}</p>}
    </div>
  );
}

export function StatGrid({
  items,
  cols = 2,
}: {
  items: { label: string; value: React.ReactNode; strong?: boolean }[];
  cols?: 2 | 3;
}) {
  // 窄屏一律压成两列：三列时单元格内宽只剩约 66px，
  // "$1,896.20" 这类金额会顶破卡片（数字设了 whitespace-nowrap，不会自动换行）。
  const gridCls =
    cols === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2";
  return (
    <div className={`grid gap-3 text-sm ${gridCls}`}>
      {items.map((it) => (
        <div key={it.label} className="min-w-0 rounded-xl bg-white/80 p-3">
          <p className="text-gray-500">{it.label}</p>
          <p
            className={`mt-0.5 whitespace-nowrap tabular-nums ${
              it.strong ? "font-semibold text-gray-900" : "font-medium text-gray-900"
            }`}
          >
            {it.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export type BarSegment = { label: string; value: number; color: string };

/** 堆叠条：一眼看出这笔月供里各占多少 */
export function StackedBar({ segments }: { segments: BarSegment[] }) {
  const total = useMemo(
    () => segments.reduce((s, x) => s + Math.max(0, x.value), 0),
    [segments]
  );
  if (total <= 0) return null;

  return (
    <div className="mt-5">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/80">
        {segments.map((s) => (
          <div
            key={s.label}
            style={{ width: `${(Math.max(0, s.value) / total) * 100}%`, background: s.color }}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: s.color }}
            />
            {s.label} {((Math.max(0, s.value) / total) * 100).toFixed(1)}%
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * 摊销明细表：默认只露前 12 期，剩下的按需展开。
 * 360 行一次性铺出来会把移动端拖垮，也没人这么看。
 */
export function ScheduleTable({
  rows,
  initial = 12,
  caption,
}: {
  rows: PaymentRow[];
  initial?: number;
  caption?: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? rows : rows.slice(0, initial);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-3">
        <h3 className="font-medium text-gray-900">Payment schedule</h3>
        <span className="whitespace-nowrap text-sm text-gray-500">
          Showing {visible.length} of {rows.length}
        </span>
      </div>
      <div className="max-h-80 overflow-x-auto overflow-y-auto">
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
            {visible.map((row) => (
              <tr key={row.month} className="tabular-nums text-gray-600">
                <td className="px-5 py-2">{row.month}</td>
                <td className="px-5 py-2">{formatMoney(row.payment)}</td>
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
      {rows.length > initial && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="w-full border-t border-gray-100 py-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
        >
          {showAll
            ? `Show first ${initial} months`
            : `Show all ${rows.length} months`}
        </button>
      )}
      {caption && <p className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">{caption}</p>}
    </div>
  );
}

/** 输入校验提醒：金额为 0 或还款额不足以覆盖利息时，别让用户对着 0 发呆 */
export function InputWarning({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 text-xs leading-relaxed text-amber-900">
      {children}
    </p>
  );
}
