import { consentBootstrapScript } from "@/lib/consent";

/**
 * 同意引导脚本 —— **原生同步 `<script>`，放在 `<body>` 的第一个子元素**。
 *
 * ⚠️ 这里**刻意不用** `next/script`（哪怕 `strategy="beforeInteractive"`）。
 * 实测（2026-10-10，Next 16.3 + Turbopack）：用 next/script 的内联脚本，
 * 构建产物不是一段真脚本，而是
 *
 *     <script>(self.__next_s=self.__next_s||[]).push([0,{"children":"…","id":"consent-mode"}])</script>
 *
 * 也就是把它塞进了 Next 的**延迟队列**，要等 Next 运行时（一个 `async` 分片）
 * 加载后才展开。后果是：
 *   - 脚本**不再先于一切执行**，执行时机取决于分片下载速度；
 *   - 而 `gtag('consent','default', …)` 一旦晚于首发的 GA4 命中，就等于没做 ——
 *     页面照常渲染、控制台没有任何报错，只有 GA4 的 Tag Diagnostics 里
 *     才会显示「未检测到 consent signal」。
 *   - 更麻烦的是**验收脚本也看不出来**：`id="consent-mode"` 确实在 HTML 里、
 *     位置也确实靠前，只有真的读那段 HTML 才会发现它是一个队列条目而不是脚本。
 *
 * 原生内联脚本没有这个问题：解析到就同步执行，必然早于任何 `async` 分片、
 * 早于 `afterInteractive` 注入的 gtag.js。而且它在 SSR HTML 里是**一段看得见、
 * 可断言的真脚本**，验收脚本可以逐字检查 region 数组。
 *
 * 脚本内容由 `lib/consent.ts` 生成（单一来源），本组件只负责挂载位置。
 */
export default function ConsentBootstrap() {
  return (
    <script
      id="consent-mode"
      // React 不会执行字符串，这里注入的是自己的构建期常量，不含用户输入。
      dangerouslySetInnerHTML={{ __html: consentBootstrapScript() }}
    />
  );
}
