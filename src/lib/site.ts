/**
 * 站点规范主机名（唯一来源）。
 *
 * 2026-09-25 最终决定：使用**独立域名**，规范主机名 = 裸域 loancalcly.com。
 * （当天先评估过「挂在已有 aiscoutly.com 的子域名下、省一次注册」的方案，
 *   后来改回独立域名：aiscoutly.com 带程序化 SEO 历史包袱，AdSense 的拒批
 *   记录会跟着子域名走，省下的 $10 换不来干净的抓取历史。
 *   架构上没有任何返工 —— 主机名只在这一个常量里声明。）
 *
 * ⚠️ 与 aiscoutly 主站**相反**：主站规范主机名是带 www 的
 * `https://www.aiscoutly.com`，本站是裸域 `https://loancalcly.com`。
 * 因此 Vercel 里**必须把裸域 loancalcly.com 设为 Primary Domain**，
 * 让 www.loancalcly.com 308 跳转到裸域。若设反，sitemap 和 canonical 里
 * 写的 URL 会全部变成重定向，Google 判为「网页已重定向」而不予收录
 * （aiscoutly 主站踩过这个坑，2026-09-20 才发现并修复）。
 *
 * 改动 SITE_HOST 时请一并确认：Vercel 项目已绑定该域名、DNS 已解析、
 * 线上 `curl -sI` 返回 200 而非 308。
 */
export const SITE_HOST = "loancalcly.com";

export const SITE_URL = `https://${SITE_HOST}`;

export const SITE_NAME = "LoanCalcly";

/**
 * 联系邮箱。挂在 loancalcly.com 上。
 * ⚠️ 需要用户在 Namecheap 配置邮件转发，把 hello@loancalcly.com 转到自己的
 * Gmail，否则 contact / privacy / terms 页上的这个地址收不到信。
 */
export const CONTACT_EMAIL = "hello@loancalcly.com";

/**
 * 作者署名（唯一来源）。
 *
 * 2026-09-26 决定：把署名从机构化的「LoanCalcly Editorial」升级为真人署名。
 * 原因是 E-E-A-T —— 本站属 YMYL（金融），Google 对这个品类的作者真实性
 * 要求最严；一个「没有人的金融站」是最容易被判低价值的形态。
 *
 * ⚠️ **底线：bio 里的每一句都必须是可核实的事实。**
 * 2026 年 Google 已把「虚构作者人设」（编造姓名 + 编造资历 + 库图头像）
 * 明确列为垃圾内容 —— 编一个不存在的「CFA 房贷专家」比不署名更糟。
 * 所以这里只陈述真实背景，不堆砌头衔、不虚构执业年限。
 *
 * ⚠️ 改笔名只动 `AUTHOR_NAME` 这一个常量：`Byline`、`ArticleSchema`、
 * `/methodology` 页、`/about` 页、页脚全部从这里取值。
 *
 * ⚠️ **2026-09-26 复盘：这句话此前是不成立的。**
 * 当时 `name` 是唯一常量，但人名还被字面写死在两处、第三人称代词写死在三处：
 *   - bio[0] 以 "David Chen writes about…" 开头（人名硬编码）
 *   - bio[0]/bio[1] 里的 "He" / "his" / "he"（代词硬编码）
 *   - `about/page.tsx` 的 "carry his byline"（代词硬编码，且在 AUTHOR 之外）
 * 后果很隐蔽：直接改 `name`，署名链接与 schema 会跟着变，但 bio 正文仍是旧人名，
 * 出现「链接写新人名、正文写旧人名」的不一致 —— **而且改完不会报错**，只有逐句读才发现。
 *
 * 修法（比加 pronoun 字段更稳）：**bio 改用第一人称**，从根上消除第三人称代词；
 * 人名只以 `AUTHOR_NAME` 形式出现，且不在 bio 里重复出现（姓名由署名行与
 * 作者区块负责显示）。这样「改一个常量」才是真的。
 *
 * `slug` 字段已删除：本站没有也不会做 `/authors/<slug>` 路由，作者页就是
 * `/methodology`（`AuthorLink` 指向它），留着纯属死字段。
 */
const AUTHOR_NAME = "David Chen";

export const AUTHOR = {
  /** 对外署名（英文笔名）。全站唯一的人名来源。 */
  name: AUTHOR_NAME,
  /** 一句话角色描述（不是资质声明），出现在作者区块里 */
  shortRole: "personal finance editor",
  /**
   * 作者简介段落 —— **第一人称，刻意不用第三人称代词**。
   * 事实依据：作者本人具备证券行业从业背景，长期做量化与因子分析，
   * 熟悉现值/折现/本息拆分这套数学 —— 与贷款摊销是同一套东西。
   * 未虚构任何执业资格、年限或雇主。
   */
  bio: [
    "I write about borrowing costs and personal finance. I came to the subject from securities analysis, where the same amortisation mathematics decides what an instrument is worth: present value, discounting, and the month-by-month split between interest and principal.",
    "I am not a lender, a broker or a mortgage adviser, and nothing on this site is personalised advice. What I bring to it is a habit carried over from quantitative work — never publish a number that has not been computed twice, by two independent routes.",
  ],
} as const;
