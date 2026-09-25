# LoanCalcly

Free loan calculators — mortgage (PITI), auto, personal and student loans — plus amortization schedules and explanatory guides. English-language site aimed at US/UK search traffic.

**Live:** https://loancalcly.com

---

## 域名形态（重要，勿忘）

本站使用**独立域名** `loancalcly.com`，规范主机名是**裸域**。决策日期 **2026-09-25**。

> 当天先评估过「挂在已有 aiscoutly.com 的子域名下、省一次注册」的方案，最终放弃：
> aiscoutly.com 带程序化 SEO 历史包袱（前任同名联盟站遗留 478 条垃圾 URL，
> Google 抓取后几乎零收录，AdSense 两次拒批）。子域名会继承同一站点的信誉，
> **省下的 $10 换不来干净的抓取历史**。

- 规范主机名 = `https://loancalcly.com`，唯一来源是 `src/lib/site.ts` 里的 `SITE_HOST`
- ⚠️ **与 aiscoutly 主站相反**：主站必须写 `https://www.aiscoutly.com`（裸域 308 跳 www），本站必须写裸域。
  因此 Vercel 里**必须把 `loancalcly.com` 设为 Primary Domain**，让 `www.loancalcly.com` 308 跳向裸域
- 设反的后果：sitemap 与 canonical 里的每条 URL 都会变成重定向，Google 判「网页已重定向」而不予收录。校验方法：

  ```bash
  curl -sI https://loancalcly.com/       | head -1   # 应为 200，不是 308
  curl -sI https://www.loancalcly.com/   | head -1   # 应为 308（跳向裸域）
  ```

- DNS 托管在 **Namecheap**（域名在同一处注册），记录加在 Advanced DNS：
  裸域用 **A 记录**指向 Vercel 的 IP；`www` 用 **CNAME** 指向 Vercel 给出的**项目专属**目标（形如 `<hash>.vercel-dns-017.com`，**不是**通用的 `cname.vercel-dns.com`）。两条记录都以 Vercel 域名设置页显示的实际值为准

## 架构约定

| 文件 | 职责 |
|---|---|
| `src/lib/loan.ts` | **唯一计算内核**。所有算术都写在这里，页面里禁止另写一份 |
| `src/lib/calculators.ts` | 计算器注册表，驱动 `/calculators`、sitemap、页脚 |
| `src/lib/guides.ts` | 指南注册表，同上 |
| `src/lib/site.ts` | 站点常量（主机名 / 站名 / 联系邮箱 / 署名）唯一来源 |
| `src/components/CalculatorUI.tsx` | 四个交互计算器共用的输入控件、结果块与明细表 |
| `src/components/Prose.tsx` | 长文排版原子（H2/H3/P/UL/Formula/Callout/DataTable/ArticleSchema） |

**新增页面的标准流程**：注册表加一条 → 建页面 → sitemap / 页脚 / 内链自动派生，无需改动其他文件。

## 本地开发

```bash
npm run dev      # http://localhost:3000
npm run build
npm run start
npx tsc --noEmit && npx eslint .
```

### 构建注意

沙箱环境下 `next build` 可能在 Finalizing 阶段被 safe-delete 拦截。标准解法是先把缓存挪走再构建：

```bash
mv .next /tmp/next_old_$(date +%s) && npm run build
```

### 静态页面忌讳

- 不要在渲染路径里直接调用 `new Date()` —— 构建期与访问期月份不一致会造成 hydration 不匹配。需要时用 `useState("") + useEffect` 挂载后再算
- 金额类的统计格不要用 `grid-cols-3` + `whitespace-nowrap`，375px 窄屏下会顶破卡片，用 `grid-cols-2 sm:grid-cols-3`

## 内容规范

- 金融数字必须经**两套独立实现（Python + Node）复算逐位一致**后才写入正文；发布前再用 `node --experimental-strip-types` 直接执行线上 `loan.ts` 交叉验证
- 不编造「我实测 X 天」之类无法核实的一手体验
- 监管细则（IDR 计划、FHA MIP 年限、各州销售税）只做一般性表述并指向官方文件
