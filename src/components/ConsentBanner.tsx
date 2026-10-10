"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CONSENT_OPEN_EVENT,
  readConsent,
  updateConsentSignals,
  writeConsent,
} from "@/lib/consent";

const GOOGLE_DATA_RESPONSIBILITY =
  "https://business.safety.google/privacy/";

/**
 * Cookie 同意横幅。
 *
 * ⚠️ **服务端渲染，但初始 `hidden`。**
 * 是否显示取决于 localStorage，服务端读不到 —— 若把「该不该显示」作为初始 state，
 * 服务端（无记录 → 显示）与客户端（有记录 → 不显示）会不一致，触发 hydration 报错。
 * 所以两边首屏**都是 hidden**，挂载后（useEffect）才决定揭不揭开。
 * 这样做还有个额外好处：横幅的文案与按钮**存在于 SSR HTML 里**，
 * 验收脚本用 curl 就能断言关键的合规文案（"Reject non-essential"、
 * 指向 Google 的链接）没有在构建中被摇掉。
 *
 * 布局上没有 CLS 风险：fixed 定位，`hidden` ↔ 显示都不占文档流。
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [detailed, setDetailed] = useState(false);
  // 首屏两边都用「全选」：服务端与客户端一致，且不暗示任何倾向。
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect --
       localStorage 是外部系统，服务端读不到，只能在挂载后同步一次。
       这不违反本规则要防的问题：初始 state 刻意与 SSR 完全一致
       （visible=false / 两项全选），挂载后的这次 setState 只会让它从
       「保守的初值」变成「真实的已存选择」，不会产生 hydration 不匹配。
       若改成 useSyncExternalStore 也能过 lint，但为一次性的读取引入
       subscribe + getSnapshot 的缓存层，收益不抵复杂度。 */
    const stored = readConsent();
    if (stored) {
      setAnalytics(stored.analytics);
      setAds(stored.ads);
    } else {
      setVisible(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // 页脚「Cookie preferences」按钮通过自定义事件打开 —— 横幅不依赖触发器在不在，
  // 触发器也不用知道横幅长什么样。
  useEffect(() => {
    const onOpen = () => {
      setDetailed(true);
      setVisible(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  const commit = useCallback((next: { analytics: boolean; ads: boolean }) => {
    writeConsent(next);
    updateConsentSignals(next);
    setAnalytics(next.analytics);
    setAds(next.ads);
    setVisible(false);
    setDetailed(false);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-desc"
      hidden={!visible}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white shadow-[0_-6px_20px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto max-h-[80vh] max-w-5xl overflow-y-auto px-4 py-4 sm:py-5">
        <h2
          id="consent-title"
          className="text-sm font-semibold text-gray-900"
        >
          Cookies and personalised advertising
        </h2>

        <p
          id="consent-desc"
          className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-600"
        >
          We use cookies to measure which pages are useful (analytics) and to
          show advertising. Advertising cookies may be used by Google and its
          partners to personalise ads based on your visits to this and other
          websites. You can accept or reject the non-essential ones — the
          calculators work either way. See our{" "}
          <Link
            href="/privacy"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            Privacy policy
          </Link>{" "}
          and{" "}
          <a
            href={GOOGLE_DATA_RESPONSIBILITY}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            how Google uses data from sites that use its services
          </a>
          .
        </p>

        {detailed && (
          <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600"
              />
              <span className="text-sm leading-relaxed text-gray-700">
                <span className="font-medium text-gray-900">Analytics</span> —
                aggregate measurement of which pages are visited and how
                visitors arrive. No personal profiles.
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={ads}
                onChange={(e) => setAds(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-emerald-600"
              />
              <span className="text-sm leading-relaxed text-gray-700">
                <span className="font-medium text-gray-900">
                  Advertising
                </span>{" "}
                — serves ads and, when allowed, uses them to personalise what
                you see on this and other sites.
              </span>
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* ⚠️ 两个按钮必须同样显眼、同样是一次点击可达。
              把「拒绝」做成小字链接或二次确认属于暗黑模式，
              既违反 GDPR 的「撤回与同意同样容易」，也是 Google 明确点名的反例。 */}
          <button
            type="button"
            onClick={() => commit({ analytics: true, ads: true })}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={() => commit({ analytics: false, ads: false })}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            Reject non-essential
          </button>

          {detailed ? (
            <button
              type="button"
              onClick={() => commit({ analytics, ads })}
              className="rounded-lg px-2 py-2 text-sm font-medium text-emerald-700 underline underline-offset-2 transition-colors hover:text-emerald-900"
            >
              Save my choices
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setDetailed(true)}
              className="rounded-lg px-2 py-2 text-sm font-medium text-emerald-700 underline underline-offset-2 transition-colors hover:text-emerald-900"
            >
              Manage preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
