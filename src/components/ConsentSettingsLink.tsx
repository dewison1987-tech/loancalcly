"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

/**
 * 页脚里的「Cookie preferences」入口。
 *
 * 存在的理由是隐私政策里的一句承诺：第 3 节写「you can change or withdraw that
 * consent at any time」、第 6 节把「withdraw consent for cookie-based advertising
 * at any time」列为用户的 GDPR 权利 —— 但在 2026-10-10 之前，**页面上根本没有任何
 * 能撤回同意的控件**。那句话因此是不成立的（与 aiscoutly 那次「bio 里硬编码人名」
 * 同一类问题：文档承诺了、实现没跟上，而且不会报错）。
 *
 * 只派发一个自定义事件，不直接引用横幅组件 —— 两者因此互不依赖。
 */
export default function ConsentSettingsLink() {
  return (
    <li>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
        className="text-left text-gray-700 transition-colors hover:text-emerald-700 hover:underline"
      >
        Cookie preferences
      </button>
    </li>
  );
}
