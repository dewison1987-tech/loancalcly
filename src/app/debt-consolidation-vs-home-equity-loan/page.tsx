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
  Formula,
  H2,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = pageMetadata({
  path: "/debt-consolidation-vs-home-equity-loan",
  title: "Debt Consolidation vs a Home Equity Loan",
  description:
    "Consolidating $30,000 unsecured at 11.50% costs $11,670 all in. The 8.00% home equity loan is cheaper at five years — and $3,208 dearer at ten.",
  type: "article",
});

const PUBLISHED = "October 11, 2026";

/**
 * 全部数字由 src/lib/loan.ts 的 debtConsolidation 生成，并经 Python / Node
 * 两套独立实现 + 站点内核三方逐位复算（175 个值逐字节一致）。
 *
 * 场景：要合并的债务 $30,000；无抵押 11.50% / 60 期，手续费 5%（从放款额里扣）；
 * 有抵押 8.00%，一次性成本 $1,200，候选期限 60 / 120 / 180 期；月收入 $7,500。
 *
 * ⚠️ 寿命较长的总额一律取整到元（与站内其他页面一致），月供取整到分。
 * 页面里所有「差额」都由同页已显示的数字相减得出 —— 180 期那条月供差是
 * $407.80（显示口径），不是精确值 $407.81。
 */

const ROUTES = [
  [
    <strong key="a" className="text-gray-900">
      Unsecured personal loan
    </strong>,
    "11.50%",
    "60 mo",
    "$31,578.95",
    "$694.50",
    "$41,670.20",
    "$11,670",
    "9.26%",
  ],
  [
    <strong key="b" className="text-gray-900">
      Home equity loan
    </strong>,
    "8.00%",
    "60 mo",
    "$30,000.00",
    "$608.29",
    "$36,497.51",
    <strong key="b2" className="text-gray-900">
      $7,698
    </strong>,
    "8.11%",
  ],
  [
    <strong key="c" className="text-gray-900">
      Home equity loan
    </strong>,
    "8.00%",
    "120 mo",
    "$30,000.00",
    "$363.98",
    "$43,677.93",
    "$14,878",
    "4.85%",
  ],
  [
    <strong key="d" className="text-gray-900">
      Home equity loan
    </strong>,
    "8.00%",
    "180 mo",
    "$30,000.00",
    "$286.70",
    "$51,605.21",
    "$22,805",
    "3.82%",
  ],
];

const TERM_ROWS = [
  [
    "60 months",
    "$608.29",
    <strong key="a" className="text-gray-900">
      $86.21
    </strong>,
    "$7,698",
    <strong key="a2" className="text-gray-900">
      −$3,972
    </strong>,
  ],
  [
    "120 months",
    "$363.98",
    <strong key="b" className="text-gray-900">
      $330.52
    </strong>,
    "$14,878",
    <strong key="b2" className="text-gray-900">
      +$3,208
    </strong>,
  ],
  [
    "180 months",
    "$286.70",
    <strong key="c" className="text-gray-900">
      $407.80
    </strong>,
    "$22,805",
    <strong key="c2" className="text-gray-900">
      +$11,135
    </strong>,
  ],
];

const FAQ = [
  {
    q: "Why is the secured loan more expensive at ten years if the rate is lower?",
    a: "Because the rate is applied over twice as many months. An 8.00% loan repaid over 120 months charges interest on a balance that stays outstanding far longer than an 11.50% loan repaid over 60. The lower rate reduces the cost per month of borrowing; the longer term increases the number of months you are borrowing. Past a certain point the second effect is larger, and on these figures that point sits at ten years — beyond it, the secured route costs more in total than the unsecured one.",
  },
  {
    q: "Does the fee really mean I have to borrow more than I need?",
    a: "Where a fee is deducted from the proceeds rather than paid separately, yes. To walk away with $30,000 when 5% is withheld, the loan has to be $31,578.95, because 95% of that figure is $30,000. The extra $1,578.95 is not a down payment — it is borrowing you did not want, on which you pay interest. Whether a particular loan works this way is stated in the disclosure, and some lenders charge the same cost as a separately paid fee instead, which produces a different total.",
  },
  {
    q: "Is the 60-month secured loan the best answer then?",
    a: "It is the cheapest of the four routes priced here, and that is a narrower statement than it sounds. It carries the highest secured monthly payment, $608.29, and it still uses the house as collateral. A household that cannot comfortably meet $608.29 a month has not been handed a solution by the total-cost column — it has been handed a cheaper loan with an unaffordable payment. Cheapest and most suitable are different tests, and only one of them is arithmetic.",
  },
  {
    q: "What does a secured loan actually put at risk?",
    a: "The home. An unsecured personal loan leaves a lender with no claim on the property if payments stop; a home equity loan is secured on it, which is what the lower rate is compensation for. That difference does not appear in any of the totals on this page, because it is not a number. It is the reason the lower rate exists, and it is worth pricing honestly rather than treating the saving as free money.",
  },
  {
    q: "Should the comparison use the payment or the total?",
    a: "Both, and in that order of priority. The payment decides whether the arrangement survives a bad month; the total decides whether it was a good idea. These four routes are a good illustration of why one alone is not enough: the 180-month option has the smallest payment of all, $286.70, and the largest total cost, $22,805 — more than twice what the 60-month secured loan costs. Whichever you start with, check the other before committing.",
  },
];

export default function DebtConsolidationGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="Debt Consolidation vs a Home Equity Loan"
        description="Why the lower-rate secured route can cost more than the unsecured one, where that crossover sits, and what the comparison leaves out."
        path="/debt-consolidation-vs-home-equity-loan"
        siteUrl={SITE_URL}
        datePublished="2026-10-11"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Debt consolidation vs a home equity loan
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          Consolidating debt with a home equity loan is usually argued on the
          rate. That is where the argument is easiest to make and where it proves
          least. On the figures below an 8.00% home equity loan is genuinely
          cheaper than an 11.50% personal loan — for five years. Stretch the same
          loan to ten and it costs <strong>$3,208 more</strong>, with the rate
          unchanged at 8.00% throughout.
        </P>
        <P>
          The comparison uses a <strong>$30,000</strong> balance. Both routes are
          priced end to end, including the fee on one and the closing costs on the
          other, because the rate alone will not tell you which is cheaper.
        </P>

        <H2>The lower rate is not the cheaper loan</H2>
        <P>
          Two things move when you switch from an unsecured loan to a secured one,
          and only one of them is the rate. The rate falls, which helps. The fee
          structure changes, and the term is now yours to choose — which is a
          freedom that works in both directions. Set the term too long and the
          lower rate is applied over so many extra months that the total cost
          climbs well past what the higher rate would have charged.
        </P>
        <P>
          That is the whole of the mechanism, and it is why a rate comparison is
          not a cost comparison. The{" "}
          <A href="/apr-vs-interest-rate">difference between APR and interest
          rate</A> is the general version of this point; here it is worked through
          on one specific balance.
        </P>

        <H2>Start with what you actually receive</H2>
        <P>
          The unsecured route in this example carries a 5% fee, deducted from the
          proceeds rather than paid separately. That single detail changes the
          principal, because the balance has to be grossed up before the
          deduction:
        </P>
        <Formula>
          $30,000 ÷ (1 − 5%) = $31,578.95 borrowed, to receive $30,000
        </Formula>
        <P>
          The extra <strong>$1,578.95</strong> is real borrowing. It attracts
          interest, it is repaid over the 60 months, and it is the reason the
          unsecured column below is measured against a larger principal than the
          secured one. The home equity route has no equivalent gross-up — instead
          it carries a one-off $1,200 in closing costs, which enters the total
          without inflating the balance.
        </P>

        <H2>Four routes, priced end to end</H2>
        <P>
          Both products on the same $30,000, with the secured route shown at three
          terms. Total cost is everything paid over and above the $30,000 received
          — interest plus fees plus closing costs, with nothing netted off:
        </P>
        <DataTable
          head={[
            "Route",
            "Rate",
            "Term",
            "Borrowed",
            "Monthly",
            "Total paid",
            "Total cost",
            "Of income",
          ]}
          align={["l", "r", "r", "r", "r", "r", "r", "r"]}
          rows={ROUTES}
          caption="Monthly income of $7,500, which is what the final column is measured against. Total cost includes the 5% fee in the first row and the $1,200 closing cost in the other three. Aggregates are rounded to the nearest dollar; monthly payments are to the cent. Produced by our calculator and independently recomputed."
        />
        <P>
          Read down the total cost column and the shape of the decision appears.
          The shortest secured term costs <strong>$7,698</strong> — comfortably the
          cheapest of the four, and $3,972 less than the unsecured loan. The
          longest costs <strong>$22,805</strong>, nearly three times as much, while
          cutting the monthly payment to <strong>$286.70</strong>, the lowest in the
          table.
        </P>
        <Callout>
          <strong>The finding in one line:</strong> at 180 months the secured route
          saves <strong>$407.80</strong> a month against the unsecured loan and
          costs <strong>$11,135</strong> more in total. The monthly saving is more
          than half the unsecured payment; the extra cost is more than a third of
          the balance being consolidated.
        </Callout>

        <H2>The term is the variable that decides it</H2>
        <P>
          Holding the secured rate at 8.00% and varying only the term isolates
          what the length of the loan is doing:
        </P>
        <DataTable
          head={[
            "Secured term",
            "Monthly",
            "Cut vs unsecured",
            "Total cost",
            "Change in total cost",
          ]}
          align={["l", "r", "r", "r", "r"]}
          rows={TERM_ROWS}
          caption="Monthly cut is measured against the $694.50 unsecured payment; the change in total cost is measured against the $11,670 unsecured figure. Every figure in this table also appears in the one above. Produced by our calculator and independently recomputed."
        />
        <P>
          Doubling the term from 60 months to 120 cuts the payment by{" "}
          <strong>$244.31</strong> and adds <strong>$7,180</strong> to the total
          cost. Tripling it to 180 months cuts the payment a further{" "}
          <strong>$77.28</strong> — a much smaller gain — while adding another{" "}
          <strong>$7,927</strong> of cost. The first extension is a real
          improvement in monthly breathing room; the second is a marginal one that
          carries the largest price tag in the table.
        </P>
        <P>
          The crossover sits at <strong>120 months</strong>. Below that, the
          secured route is cheaper overall than the unsecured one; at 120 months
          and beyond, it is not. That is one specific pair of rates and one
          specific balance, and a different spread would move the crossover — but
          the fact that a crossover exists at all is the part worth keeping.
        </P>

        <H2>What this arithmetic leaves out, on purpose</H2>
        <UL>
          <li>
            <strong>That the house is the collateral.</strong> This is the
            difference between the two products and it appears nowhere in the
            totals, because it is not a quantity. A secured loan converts
            unsecured debt into debt with a claim on your home attached. The lower
            rate is the compensation for that, not a gift, and the comparison
            above should be read knowing what has been traded away.
          </li>
          <li>
            <strong>Whether the rate you are quoted matches this one.</strong>{" "}
            8.00% and 11.50% are illustrative figures for one borrower and one
            moment, and both products price on credit history, income and the
            lender. Your own quotes will differ, and the crossover point moves
            with them — which is why the useful exercise is re-running the
            comparison with your real numbers rather than adopting this result.
          </li>
          <li>
            <strong>Whether you can borrow against the house at all.</strong>
            A home equity loan needs sufficient equity and remaining room beneath
            the lender’s combined loan-to-value ceiling. That constraint is
            independent of everything on this page and can rule the secured column
            out before the arithmetic starts.{" "}
            <A href="/how-much-home-equity-do-i-have">
              How much home equity you have
            </A>{" "}
            works through how much room a house supports.
          </li>
          <li>
            <strong>Where the closing cost actually lands.</strong> The $1,200
            used here is a single illustrative figure for appraisal, recording and
            related charges, and it varies by lender and by market. It is the only
            entry in the secured column that is a cost rather than interest, so it
            is the one to verify against a real quote.
          </li>
          <li>
            <strong>What happens if circumstances change.</strong> A 60-month
            unsecured loan and a 180-month secured loan are not the same
            commitment in anything but balance. One is finished in five years; the
            other runs for fifteen with the house behind it. Neither the payment
            column nor the total column expresses that difference.
          </li>
        </UL>

        <H2>How to use this</H2>
        <UL>
          <li>
            <strong>Price both routes over the same short term first.</strong>{" "}
            Most of the secured route’s advantage comes from the rate rather than
            the term, and it survives easily at 60 months. If a five-year secured
            loan is affordable, the decision is straightforward — the{" "}
            <A href="/personal-loan-calculator">personal loan calculator</A> prices
            the unsecured side of that comparison.
          </li>
          <li>
            <strong>Treat any term beyond about five years as a separate
            decision.</strong> Extending a loan to reduce the payment is a
            legitimate choice, but it is a choice to pay more in exchange for
            monthly room, and it should be made deliberately. An{" "}
            <A href="/amortization-schedule">amortization schedule</A> shows how
            little of each early payment touches the balance on a long term.
          </li>
          <li>
            <strong>Check the borrowing room before you shortlist the secured
            route.</strong> A home equity loan or line needs equity above the
            lender’s ceiling.{" "}
            <A href="/heloc-vs-home-equity-loan">
              HELOC versus home equity loan
            </A>{" "}
            compares the two product shapes, and{" "}
            <A href="/cash-out-refinance-vs-heloc">
              cash-out refinance versus a HELOC
            </A>{" "}
            covers the third route to the same money.
          </li>
          <li>
            <strong>Establish what the payment does to your budget</strong> before
            choosing on total cost. The{" "}
            <A href="/mortgage-calculator">mortgage calculator</A> prices a fixed
            payment over any term, which is the same arithmetic the secured
            column is built from.
          </li>
        </UL>

        <H2>The short version</H2>
        <P>
          On a $30,000 balance, an 8.00% secured loan repaid over 60 months costs{" "}
          <strong>$7,698</strong> all in — $3,972 less than the 11.50% unsecured
          route, whose 5% fee forces it to borrow $31,578.95 to deliver $30,000.
          The same secured loan over 180 months cuts the payment to $286.70 but
          costs <strong>$22,805</strong>. The rate never changes; only the term
          does. The crossover is at 120 months, beyond which the cheaper rate
          stops producing the cheaper loan — and the house is collateral in every
          secured row.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="debt-consolidation-vs-home-equity-loan" />
      </article>
    </main>
  );
}
