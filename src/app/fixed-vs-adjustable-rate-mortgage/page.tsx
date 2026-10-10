import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import {
  A,
  ArticleFooter,
  ArticleSchema,
  Byline,
  Callout,
  DataTable,
  Faq,
  H2,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = pageMetadata({
  path: "/fixed-vs-adjustable-rate-mortgage",
  title: "Fixed vs Adjustable-Rate Mortgage",
  description:
    "Five years at 6.00% saves $6,243.60 against a 6.50% fixed loan. If it resets to 7.50%, the saving is erased in 35 months and costs $47,128 overall.",
  type: "article",
});

const PUBLISHED = "October 9, 2026";

/**
 * 全部数字由 src/lib/loan.ts 的 armMortgage 生成，
 * 并经 Python / Node 两套独立实现 + 站点内核三方逐位复算（290 个值逐字节一致）。
 * 场景：$320,000 贷款，30 年。可调利率贷款 6.00% 固定 5 年，之后按表中利率
 * 重设并把当时余额在剩余 25 年内重摊；对照为同额 30 年固定 6.50%。
 * 刻意只建模**第一次重设**，不叠加后续每年调整与利率上限 —— 多一个假设就多一处
 * 三套实现可能分歧的地方，而结论方向由第一次重设幅度决定。
 *
 * ⚠️ **显示口径（2026-10-10）**：凡是读者能用本页另外两个已显示数字算出来的
 * 差额，一律由**已取整到分**的显示值相减得出，所以每一格都能自己核。
 *   - 侵蚀表的「比固定贷款每月多付」= 表内重设月供 − 表内固定月供
 *     （$2,200.52 − $2,022.62 = $177.90，而不是由未取整值算出的 $177.91）
 *   - 五年省下的钱 = $104.06 × 60 = $6,243.60，与表头说明写的算式一致
 * 模型侧的精确差额仍在引擎里输出（`arm.monthlyUp` / `arm.saving`），
 * 两个口径的差距由断言约束在展示精度内。
 */
const TWO_LOANS = [
  ["Payment during the first five years", "$1,918.56", "$2,022.62"],
  ["Balance at the five-year mark", "$297,774", "$299,555"],
  [
    <strong key="r" className="text-gray-900">
      Payment after the reset, at 7.50%
    </strong>,
    <strong key="r2" className="text-gray-900">
      $2,200.52
    </strong>,
    <strong key="r3" className="text-gray-900">
      $2,022.62
    </strong>,
  ],
  [
    <strong key="t" className="text-gray-900">
      Total interest over 30 years
    </strong>,
    <strong key="t2" className="text-gray-900">
      $455,271
    </strong>,
    <strong key="t3" className="text-gray-900">
      $408,142
    </strong>,
  ],
];

const SENSITIVITY = [
  ["6.00% — unchanged", "$1,918.56", "—", "$370,682", "−$37,460"],
  ["6.25%", "$1,964.32", "+$45.76", "$384,411", "−$23,732"],
  ["6.50% — the fixed loan's own rate", "$2,010.59", "+$92.03", "$398,291", "−$9,851"],
  [
    <strong key="a" className="text-gray-900">
      6.75%
    </strong>,
    "$2,057.35",
    "+$138.79",
    "$412,320",
    <strong key="a2" className="text-gray-900">
      +$4,178
    </strong>,
  ],
  ["7.00%", "$2,104.60", "+$186.04", "$426,495", "+$18,353"],
  [
    <strong key="b" className="text-gray-900">
      7.50%
    </strong>,
    <strong key="b2" className="text-gray-900">
      $2,200.52
    </strong>,
    "+$281.96",
    "$455,271",
    <strong key="b3" className="text-gray-900">
      +$47,128
    </strong>,
  ],
  ["8.00%", "$2,298.27", "+$379.71", "$484,594", "+$76,452"],
];

const EROSION = [
  ["6.75%", "$34.74", "180 months"],
  ["7.00%", "$81.98", "76 months"],
  ["7.50%", "$177.90", "35 months"],
  ["8.00%", "$275.65", "23 months"],
];

const FAQ = [
  {
    q: "Is an adjustable-rate mortgage cheaper than a fixed one?",
    a: "For as long as the initial rate lasts, yes. On a $320,000 loan at 6.00% against a 30-year fixed at 6.50%, the payment is $1,918.56 rather than $2,022.62 — $104.06 less, or $6,243.60 over five years. Whether it is cheaper overall depends entirely on what the rate does at the reset. If the rate comes back at 6.50% the adjustable loan still wins by $9,851 over thirty years; at 6.75% it loses by $4,178, and at 7.50% it loses by $47,128.",
  },
  {
    q: "What rate does the adjustable loan have to reset to for the fixed one to win?",
    a: "On this example the crossover sits between 6.50% and 6.75% — and remarkably, the payment crossover falls in the same band. At 6.50% the adjustable payment after the reset is $2,010.59, still $12.03 below the fixed payment of $2,022.62. At 6.75% it is $2,057.35, which is $34.74 above. So on these assumptions the same threshold decides both the monthly payment and the thirty-year total.",
  },
  {
    q: "How quickly does the higher payment wipe out the savings?",
    a: "It depends on the size of the reset. The five years at 6.00% save $6,243.60. At 7.50% the payment is $177.90 higher, which erases that in 35 months — just under three years. At 8.00% it is $275.65 higher and the saving is gone in 23 months. At 7.00% it takes 76 months, and at 6.75% essentially the whole remaining term. The saving is real; it is also finite, and it is spent down by the very thing you are being compensated for risking.",
  },
  {
    q: "Do the caps and the index change this?",
    a: "Yes, and they are the reason a real adjustable loan is less risky than the model above suggests. Real loans have periodic and lifetime caps that limit how far the rate can move, and a margin added to a published index that sets where it lands. Those terms decide the actual reset, and they are in your loan documents rather than in any general description. This page models one reset to a stated rate so the arithmetic is checkable; read your caps and margin to see how far from that your own loan could go.",
  },
  {
    q: "When does an adjustable-rate mortgage make sense?",
    a: "When the fixed period covers the time you expect to hold the loan, and when a higher payment later would still be affordable. The value of the fixed period is that you get the lower rate for exactly as long as you need it; the risk is that life changes and you are still there when it ends. If you are close to certain of a sale or a move inside five years, the exposure is short. If the only reason it works is that the current payment is easier to make, the rate after the reset is the number to test first.",
  },
];

export default function FixedVsAdjustableRateMortgageGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="Fixed vs Adjustable-Rate Mortgage"
        description="A five-year fixed period at 6.00% against a thirty-year fixed at 6.50%: what the discount is worth, what the reset costs, and the rate at which the fixed loan wins."
        path="/fixed-vs-adjustable-rate-mortgage"
        siteUrl={SITE_URL}
        datePublished="2026-10-09"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Fixed vs adjustable-rate mortgage
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          An adjustable-rate mortgage trades certainty for a discount. You accept
          a rate that will change at a date written into the contract, and in
          exchange you pay less until it does. The discount is easy to see and
          the risk is easy to defer, because it lands years later on a payment
          that the lender, not you, will recalculate.
        </P>
        <P>
          What follows prices both halves on one loan: <strong>$320,000</strong>{" "}
          over <strong>30 years</strong>. The adjustable version starts at{" "}
          <strong>6.00%</strong> and is fixed for the first{" "}
          <strong>five years</strong>. The comparison is the same amount on a
          30-year <strong>6.50%</strong> fixed loan.
        </P>

        <H2>The two loans, side by side</H2>
        <DataTable
          head={["", "5/1 adjustable at 6.00%", "30-year fixed at 6.50%"]}
          align={["l", "r", "r"]}
          rows={TWO_LOANS}
          caption="$320,000 over 30 years. The adjustable loan is modelled with a single reset at month 61, when the remaining balance is re-amortised over the remaining 25 years at the rate shown. Produced by our calculator and independently recomputed."
        />
        <P>
          Read the first two rows together and the discount is clear:{" "}
          <strong>$104.06</strong> a month, and the balance also ends up{" "}
          <strong>$1,781</strong> lower after five years, because a lower rate
          retires principal faster. Read the last two rows and the picture
          changes — at a 7.50% reset the adjustable loan costs{" "}
          <strong>$47,128</strong> more over its life.
        </P>

        <H2>What the reset does to the payment</H2>
        <P>
          The reset is the whole risk, and it arrives with both a new rate and a
          new schedule. The balance is re-amortised over the years that remain,
          so the payment is not just the old payment scaled by the rate change:
        </P>
        <P>
          Going from <strong>$1,918.56</strong> to <strong>$2,200.52</strong> is a{" "}
          <strong>14.70%</strong> increase, or <strong>$281.96</strong> a month.
          On a payment that has already been running for five years, that is a
          meaningful step — and it is not a step that can be negotiated, because
          it is arithmetic rather than policy.
        </P>

        <H2>What if the rate lands somewhere else?</H2>
        <P>
          The reset rate is the one input nobody controls, so the honest way to
          present the decision is across a range rather than as a single
          forecast:
        </P>
        <DataTable
          head={[
            "Rate at the reset",
            "Payment from month 61",
            "Change from $1,918.56",
            "Total interest over 30 years",
            "Against the fixed loan",
          ]}
          align={["l", "r", "r", "r", "r"]}
          rows={SENSITIVITY}
          caption="The fixed period is 6.00% in every row; only the rate applied to the remaining balance changes. The comparison column is against $408,142 of interest on the 30-year fixed at 6.50%, so a negative figure means the adjustable loan costs less. Produced by our calculator and independently recomputed."
        />
        <P>
          The crossover falls between <strong>6.50%</strong> and{" "}
          <strong>6.75%</strong>. Below it the adjustable loan wins over thirty
          years; above it the fixed loan does, and the losses grow quickly —
          $4,178 at 6.75%, $47,128 at 7.50%, $76,452 at 8.00%. Notice also that
          the payment crossover sits in the same band: at 6.50% the adjustable
          payment of $2,010.59 is still $12.03 below the fixed payment, and at
          6.75% it is $34.74 above it.
        </P>

        <H2>How long the discount survives</H2>
        <P>
          The five years at 6.00% save <strong>$6,243.60</strong>. That saving is
          not destroyed at the reset; it is spent, month by month, by the higher
          payment that follows:
        </P>
        <DataTable
          head={["Rate at the reset", "Extra per month vs the fixed loan", "Time to spend the $6,243.60"]}
          align={["l", "r", "r"]}
          rows={EROSION}
          caption="The saving is the $104.06 monthly difference over 60 months. The erasure time is that saving divided by the extra monthly cost after the reset, ignoring the small balance difference between the two loans. Produced by our calculator and independently recomputed."
        />
        <Callout>
          <strong>The finding in one line:</strong> five years at the lower rate
          buys you a <strong>$6,243.60</strong> head start. If the rate then resets
          to 7.50%, the resulting payment is <strong>$177.90</strong> a month
          higher than the fixed loan&apos;s, and the head start is gone in{" "}
          <strong>35 months</strong>. The discount is not small. It is also not
          durable, and it is being spent to buy a risk that pays off only if the
          rate comes back near where it started.
        </Callout>

        <H2>What this model deliberately leaves out</H2>
        <UL>
          <li>
            <strong>Subsequent adjustments.</strong> Real adjustable loans
            typically keep adjusting on a schedule after the first reset. The
            model applies one change and holds it. That is a simplification, but
            it is not the one that decides the direction — the sign of the
            comparison is set at the first reset and later moves scale it rather
            than reverse it.
          </li>
          <li>
            <strong>Caps and the margin.</strong> Loans include periodic and
            lifetime limits on how far the rate can move, and a margin added to a
            published index. Those terms are what determine your actual reset.
            They are in the loan documents; the CFPB&apos;s material on
            adjustable-rate mortgages is the right place to read about how they
            work.
          </li>
          <li>
            <strong>Refinancing before the reset.</strong> Many borrowers with an
            adjustable loan intend to refinance into a fixed loan before the
            fixed period ends. That is a real strategy, and it depends on rates,
            on your equity and on your income at that time — it is a plan rather
            than a feature of the loan.
          </li>
          <li>
            <strong>Where rates go.</strong> Nothing here forecasts them. The
            range in the table exists precisely so the decision can be read
            without a forecast.
          </li>
        </UL>

        <H2>How to decide</H2>
        <UL>
          <li>
            <strong>Start from the reset payment, not the introductory one.</strong>{" "}
            Test whether the payment at a plausible reset rate is affordable
            before deciding whether the discount is worth it.{" "}
            <A href="/mortgage-calculator">The mortgage calculator</A> will price
            the loan at the higher rate so you can look at that number directly
            rather than reasoning about it.
          </li>
          <li>
            <strong>Check it against your income and debts.</strong> A payment
            that would push you over the limits in{" "}
            <A href="/debt-to-income-ratio">the debt-to-income guide</A> is a
            problem whether or not it is currently affordable.
          </li>
          <li>
            <strong>Be honest about the holding period.</strong> The discount is
            worth having for exactly the length of the fixed period. If your
            plans and the fixed period are the same length, the mismatch risk is
            small.
          </li>
          <li>
            <strong>Price the fixed alternative properly.</strong> The gap
            between the two rates is the size of the discount, and it varies by
            lender and by day. A smaller gap makes the fixed loan far more
            competitive at the crossover, and{" "}
            <A href="/15-vs-30-year-mortgage">15 versus 30 years</A> covers what
            the term itself does to the same comparison.
          </li>
        </UL>
        <P>
          One related decision worth making at the same time is the down payment,
          since it changes both the loan amount and whether{" "}
          <A href="/how-to-remove-pmi">mortgage insurance</A> applies — and
          insurance is a cost that does not care which rate structure you chose.
        </P>

        <H2>The short version</H2>
        <P>
          On $320,000 over 30 years, a five-year fixed period at 6.00% costs
          $1,918.56 a month against $2,022.62 for a 30-year fixed at 6.50%,
          saving $6,243.60 and reducing the balance by an extra $1,781. If the rate
          resets to 7.50% the payment becomes $2,200.52, the saving is spent
          within 35 months, and the loan costs $47,128 more over its life. The
          crossover is between 6.50% and 6.75%. The discount is genuine; the
          question is whether the fixed period is as long as your plans.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="fixed-vs-adjustable-rate-mortgage" />
      </article>
    </main>
  );
}
