# LoanCalcly

Free loan calculators — mortgage (PITI), auto, personal and student loans — plus amortization schedules and explanatory guides. English-language site aimed at US/UK search traffic.

**Live:** https://loancalcly.aiscoutly.com

---

## 域名形态（重要，勿忘）

本站**不单独注册域名**，部署在已有域名 `aiscoutly.com` 的子域名下。决策日期 **2026-09-25**。

- 规范主机名 = `https://loancalcly.aiscoutly.com`，唯一来源是 `src/lib/site.ts` 里的 `SITE_HOST`
- 子域名没有 www / 裸域两个变体，所以不存在 aiscoutly 主站那种「Vercel 里 Primary Domain 设反 → 整份 sitemap 变成一堆重定向」的问题
- **但铁律不变**：`SITE_HOST` 必须与站点实际返回 200 的主机名完全一致。校验方法：

  ```bash
  curl -sI https://loancalcly.aiscoutly.com/ | head -1   # 应为 200，不是 308
  ```

  若返回 308，说明 DNS 或 Vercel 域名绑定还没生效，此时 sitemap 里的每一条 URL 都会是重定向，Google 会判为「网页已重定向」而不收录。

- DNS 托管在 **Namecheap BasicDNS**（`dns1/dns2.registrar-servers.com`），子域名记录加在 Namecheap 后台的 Advanced DNS，不是在 Vercel
- Vercel 给项目分配的是**专属 CNAME**（形如 `<hash>.vercel-dns-017.com`），不是通用的 `cname.vercel-dns.com`；加 DNS 记录时以 Vercel 域名设置页显示的实际值为准

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
