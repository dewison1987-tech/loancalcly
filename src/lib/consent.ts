/**
 * 同意管理（cookie consent）的**单一来源**。
 *
 * 背景（2026-10-10 核实）：
 *   - 自 2024-01-16 起，Google 要求用 AdSense / Ad Manager / AdMob 向
 *     **EEA + 英国**投放**个性化广告**时，必须使用「Google 认证的 CMP」并集成
 *     IAB TCF；2024-07-31 起扩展到瑞士。不合规的后果**不是封号**，而是把该地区
 *     流量降级成 Limited Ads（非个性化），收入可能掉一半以上。
 *   - 2026-03-01 起所有新生成的 TC string 必须是 TCF v2.3。
 *   - Google 官方文档明确支持「开发者自建同意方案 + 集成 Consent Mode」这条路径
 *     （developers.google.com/tag-platform/security/guides/consent 开头即是）。
 *
 * ⚠️ **本模块只做到「Consent Mode v2 兼容」，不构成认证 CMP。**
 *    差别在于：认证 CMP 会生成 TC string 交给 Google 的广告栈，我们自建的发不出
 *    这个串。所以：
 *      - 现在（AdSense 未获批、EEA/UK 流量≈0）：自建足够，且零第三方脚本、零成本。
 *      - AdSense 获批后：必须在 AdSense 后台「隐私权和消息」启用 Google 原生 CMP
 *        （免费），或接入列表里的免费层认证 CMP。届时本组件只需撤下横幅
 *        （保留 Consent Mode 这一层，认证 CMP 会接管并自己发 update）。
 *
 * 设计取舍（都有理由，改动前先读）：
 *   1. **默认值按区域分层**，用 Google 原生的 `region` 参数实现 —— 不需要我们做
 *      任何 IP 地理判断。EEA/UK/CH 默认全拒绝，其余地区默认允许。这样英国访客
 *      受保护，而美国（主市场）的 GA4 数据不会平白损失。
 *   2. **默认值必须是 denied 而不是 granted**（在有 opt-in 义务的区域）—— 这是
 *      GDPR 与 Google EU User Consent Policy 的共同要求。
 *   3. **高级（软）屏蔽模式**：不清空 GA4，而是靠 consent signal 控制其行为。
 *      这是 Google 推荐的 CMP 集成方式，也是认证 CMP 接入后的行为 —— 保持两阶段
 *      行为一致，将来换 CMP 不会出现数据断层。
 */

/** 存储键。带版本号，便于将来结构变更时安全失效旧值。 */
export const CONSENT_STORAGE_KEY = "loancalcly-consent-v1";

/** 存储结构版本。改了 `ConsentChoice` 的形状就要 +1（旧值会被忽略）。 */
export const CONSENT_VERSION = 1;

/** 页脚「Cookie preferences」按钮 → 横幅 的自定义事件名。两者因此互不依赖。 */
export const CONSENT_OPEN_EVENT = "loancalcly:open-consent";

/**
 * 需要「先同意后处理」的地区 —— 显式的 ISO 3166-1 alpha-2 国家码。
 *
 * ⚠️ **不要图省事写成 `['EEA']` 或 `['EU']`。**
 * Google 的 `region` 只认国家码（可选带 ISO 3166-2 细分码如 `US-CA`）；
 * 传进去的非法值会被**静默丢弃** —— 数组语法合法、构建不报错、页面照常渲染，
 * 但那条 default 会变成「无区域限制」，等于**在全球范围内拒绝**，
 * 美国的 GA4 数据会被无声无息地清空，而且从代码上完全看不出来。
 * 这类 bug 只能靠「核对线上 HTML 里 region 数组的实际内容」发现。
 *
 * 名单构成：欧盟 27 + EEA 非欧盟三国（IS/LI/NO）+ 英国（UK GDPR/PECR）+ 瑞士（revFADP）。
 */
export const CONSENT_STRICT_REGIONS = [
  // 欧盟 27 国
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EEA 中不属于欧盟的三个
  "IS", "LI", "NO",
  // 英国
  "GB",
  // 瑞士
  "CH",
] as const;

/** 用户的选择。存 localStorage，随每次 PageView 回放。 */
export type ConsentChoice = {
  version: number;
  /** analytics_storage */
  analytics: boolean;
  /** ad_storage / ad_user_data / ad_personalization 三项共用（本站不分广告子类） */
  ads: boolean;
  /** 做出选择的时间（ISO）。GDPR 下需要能证明同意发生过。 */
  ts: string;
};

/** 两个非必要类别的当前值。 */
export type ConsentPrefs = { analytics: boolean; ads: boolean };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** 读回已保存的选择。任何异常（无痕模式禁用 localStorage、结构不符）都当作「没选过」。 */
export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (parsed?.version !== CONSENT_VERSION) return null;
    if (typeof parsed.analytics !== "boolean" || typeof parsed.ads !== "boolean") {
      return null;
    }
    return parsed as ConsentChoice;
  } catch {
    return null;
  }
}

/** 落盘。写失败（无痕模式）不抛错 —— 本次会话照常生效，只是下次访问要重问。 */
export function writeConsent(prefs: ConsentPrefs): ConsentChoice {
  const choice: ConsentChoice = {
    version: CONSENT_VERSION,
    analytics: prefs.analytics,
    ads: prefs.ads,
    ts: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice));
  } catch {
    /* localStorage 不可用：忽略 */
  }
  return choice;
}

/**
 * 把选择推给 Google 的四路信号。
 *
 * 四个参数必须**同时**给全。只发 `ad_storage` 会让 `ad_user_data` /
 * `ad_personalization` 停在默认值上 —— 表面看不出问题，但 Google 的
 * Tag Diagnostics 会报「信号不全」，个性化广告资格也没恢复。
 */
export function updateConsentSignals(prefs: ConsentPrefs): void {
  if (typeof window === "undefined") return;
  const state = {
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: prefs.ads ? "granted" : "denied",
    ad_user_data: prefs.ads ? "granted" : "denied",
    ad_personalization: prefs.ads ? "granted" : "denied",
  };
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", state);
    return;
  }
  // 兜底：极端情况下（bootstrap 脚本被扩展拦掉）直接压 dataLayer，
  // gtag.js 一旦加载就会按顺序消费。
  if (!window.dataLayer) window.dataLayer = [];
  window.dataLayer.push(["consent", "update", state]);
}

/**
 * 生成注入 `<body>` 首部的同步引导脚本。
 *
 * 时序要求（错了就等于没做）：这段脚本必须**先于** gtag.js 执行，
 * 且 `consent default` 必须**先于** `config`。它由 `ConsentBootstrap.tsx`
 * 以**原生内联 `<script>`** 挂载（不是 next/script —— 那个会被编进
 * `self.__next_s` 延迟队列，实测踩过）。验收要断言两件事：
 *   ① 线上 HTML 里它是一段真脚本（`<script id="consent-mode">`）；
 *   ② 它的位置早于 `googletagmanager`。
 *
 * 它做四件事：
 *   ① 按区域设默认 consent（EEA/UK/CH → denied，其余 → granted）
 *   ② 开启广告点击标识抹除（仅在 ad_storage 被拒时生效，不需要用户选择）
 *   ③ 回放已保存的选择 —— 同步做完，所以**第一发命中就带正确信号**，
 *      不依赖 `wait_for_update` 那 500ms
 *   ④ 暴露 `window.gtag` 供横幅组件调用
 */
export function consentBootstrapScript(): string {
  const regions = JSON.stringify([...CONSENT_STRICT_REGIONS]);
  const key = JSON.stringify(CONSENT_STORAGE_KEY);
  return `(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    region: ${regions},
    wait_for_update: 500
  });

  gtag('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted'
  });

  gtag('set', 'ads_data_redaction', true);

  try {
    var raw = window.localStorage.getItem(${key});
    if (raw) {
      var c = JSON.parse(raw);
      if (c && c.version === ${CONSENT_VERSION}) {
        gtag('consent', 'update', {
          analytics_storage: c.analytics ? 'granted' : 'denied',
          ad_storage: c.ads ? 'granted' : 'denied',
          ad_user_data: c.ads ? 'granted' : 'denied',
          ad_personalization: c.ads ? 'granted' : 'denied'
        });
      }
    }
  } catch (e) { /* 无痕模式等：按默认值走 */ }
})();`;
}
