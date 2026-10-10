import Script from "next/script";

/**
 * Google Analytics 4（环境变量驱动）
 * 在 Vercel 项目里设置 NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX 即自动生效；
 * 未设置时组件不渲染任何东西，不会污染 HTML。
 *
 * ⚠️ **这里是「高级（软）屏蔽」：无论同意与否都加载 gtag.js**，
 * 由 `components/ConsentBootstrap.tsx` 提前设好的 consent signal 决定 Google 的行为
 * （同意 → 正常写 Cookie；拒绝 → 只发 cookieless ping，不写任何 Cookie）。
 *
 * 为什么不改成「拒绝就不加载」：那是「基本（硬）屏蔽」。两种都合规，但高级模式的
 * 好处是与将来接入的**认证 CMP 行为一致** —— CMP 也是发信号而不是拦加载。
 * 换 CMP 时数据不会出现断层，也不用重写这里的加载逻辑。
 *
 * ⚠️ 顺序依赖：本组件的 `afterInteractive` 一定晚于 `ConsentBootstrap` 那段
 * **原生同步**内联脚本（它在解析到时就执行，早于任何 async 分片），所以
 * `gtag('consent','default')` 必定先于下面的 `config` 执行。**不要**把那
 * 段引导脚本改成 `next/script` 的任何 strategy —— 实测 `beforeInteractive`
 * 也会被编成延迟队列条目，首发命中会带着未定义的 consent 状态发出去。
 */
export default function SiteAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
