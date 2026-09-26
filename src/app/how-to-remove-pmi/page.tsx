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
  path: "/how-to-remove-pmi",
  title: "How to Remove PMI From Your Mortgage",
  description:
    "On a $270,000 loan PMI runs $112.50 a month for 95 months. Why the end date follows your balance rather than the calendar, and how extra payments shorten it.",
  type: "article",
});

const PUBLISHED = "September 26, 2026";

/**
 * 全部数字由 src/lib/loan.ts 生成，并经 Python / Node 两套独立实现逐位复算。
 * 场景：$300,000 成交价，6.50%，30 年，PMI 按原始贷款额的 0.50%/年计。
 * PMI 费率只作 illustrative —— 真实报价随信用分、LTV 与承保方浮动。
 */
const MONTHLY = [
  ["Principal & interest", "$1,706.58", "$270,000 at 6.50% over 30 years"],
  ["PMI", "$112.50", "0.50% a year on the original $270,000"],
  [
    <strong key="t" className="text-gray-900">
      Total before tax and insurance
    </strong>,
    <strong key="v" className="text-gray-900">
      $1,819.08
    </strong>,
    "Property tax, insurance and HOA sit on top of this",
  ],
];

const THRESHOLDS = [
  ["80% of the original price", "$240,000", "Month 95", "$10,688"],
  ["78% of the original price", "$234,000", "Month 109", "$12,263"],
];

const DOWN_PAYMENTS = [
  ["5% — $15,000", "$285,000", "$1,801.39", "$118.75", "Month 124", "$14,725"],
  ["10% — $30,000", "$270,000", "$1,706.58", "$112.50", "Month 95", "$10,688"],
  ["15% — $45,000", "$255,000", "$1,611.77", "$106.25", "Month 56", "$5,950"],
  ["20% — $60,000", "$240,000", "$1,516.96", "$0", "—", "$0"],
];

const PAYING_AHEAD = [
  ["As scheduled", "Month 95", "—", "—"],
  ["$100 a month", "Month 72", "23 months", "$2,588"],
  ["$200 a month", "Month 58", "37 months", "$4,163"],
  ["$300 a month", "Month 49", "46 months", "$5,175"],
];

const FAQ = [
  {
    q: "How long do you have to pay PMI?",
    a: "It depends entirely on how fast the loan balance falls to the threshold set in your loan documents. On a $270,000 loan at 6.50% with 10% down, the balance takes 95 months to reach 80% of the original price, so that is 95 months of PMI at $112.50 — about $10,688 in total. Put 15% down instead and the same threshold arrives at month 56, cutting the bill to $5,950.",
  },
  {
    q: "Does paying extra remove PMI faster?",
    a: "Yes, and only through the balance — PMI itself does not change. Extra payments are applied to principal, so they move the balance towards the threshold sooner. On the same $270,000 loan, adding $200 a month brings the end date from month 95 to month 58, which saves 37 payments of $112.50, or $4,163. That is on top of the interest those extra payments save, which is a separate and larger benefit.",
  },
  {
    q: "Does my home going up in value remove PMI?",
    a: "Usually not automatically. Many loans set the threshold against the original purchase price or the original appraised value, so market appreciation does not by itself change the calculation. Some loans and some servicers allow a new appraisal to be used, but the terms differ and you generally have to ask. Read the PMI section of your loan documents, or the Consumer Financial Protection Bureau material on the Homeowners Protection Act, rather than assuming either way.",
  },
  {
    q: "Is it better to put 20% down or pay PMI and invest the difference?",
    a: "PMI is not an investment return, it is a cost that buys the lender protection rather than you. On this example it runs $10,688 before it stops, on top of a higher loan balance. Whether that beats keeping the cash depends on what the cash earns and on how much reserve you would be left with after the larger down payment — and a thin reserve is a real risk, not a theoretical one. There is no single right answer, but the comparison should start from the PMI cost rather than from the investment return alone.",
  },
  {
    q: "Can I get rid of PMI by refinancing?",
    a: "Yes, if the new loan has a loan-to-value ratio of 80% or less, which typically means either a lower balance or a documented higher value. But refinancing has its own costs and restarts the clock on a new loan, so the PMI saved has to be weighed against the closing costs and the new rate. Our guide to the refinance break-even point works through the arithmetic; the break-even month is usually the number that decides it.",
  },
];

export default function HowToRemovePmiGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="How to Remove PMI From Your Mortgage"
        description="Why PMI ends when your loan balance crosses a threshold rather than when a set number of years pass, what that threshold costs on a worked example, and how the down payment size and extra payments change the date."
        path="/how-to-remove-pmi"
        siteUrl={SITE_URL}
        datePublished="2026-09-26"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          How to remove PMI from your mortgage
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          Private mortgage insurance is the price of a small down payment. It
          protects the lender, not you, and it usually stops at some point — but
          the date it stops is decided by your remaining balance, not by the
          calendar. That distinction matters, because it means the end date is a
          number you can compute, and to a degree a number you can move.
        </P>
        <P>
          This guide works through a single loan in detail — $300,000 purchase,
          10% down, 6.50%, 30 years — and then shows how the answer changes with
          a bigger down payment and with extra payments.
        </P>

        <H2>What the monthly bill actually contains</H2>
        <P>
          PMI is one line among several. It is worth separating it out, because
          only one of these numbers is affected by how much you borrowed.
        </P>
        <DataTable
          head={["Component", "Monthly", "Where it comes from"]}
          align={["l", "r", "l"]}
          rows={MONTHLY}
          caption="$300,000 purchase with 10% down, 6.50% over 30 years, PMI modelled at 0.50% a year on the original loan amount. Produced by our calculator and independently recomputed."
        />
        <P>
          Two things about that $112.50 are worth holding on to. It is charged on
          the loan as it was originally written, not on the balance as it falls,
          so it stays flat while the principal declines. And it sits outside
          principal and interest, which means it does nothing for your equity —
          a payment that reduces neither the balance nor the interest.
        </P>

        <H2>The threshold, and when the balance reaches it</H2>
        <P>
          PMI ends when the loan balance falls to a set percentage of the
          property value used in your loan documents. Two percentages matter, and
          they are not the same event: at 80% the borrower can generally ask for
          cancellation, and at 78% the servicer is generally required to end it
          without being asked. The exact conditions depend on your loan type and
          documents — for the rules themselves, see the CFPB material on the
          Homeowners Protection Act rather than a summary like this one.
        </P>
        <P>
          What is worth computing is when each threshold arrives, because that is
          the length of the bill:
        </P>
        <DataTable
          head={["Threshold", "Balance target", "Reached", "PMI paid by then"]}
          align={["l", "r", "l", "r"]}
          rows={THRESHOLDS}
          caption="$270,000 at 6.50% over 30 years, on a $300,000 price. Values are the original price, on the assumption that the documents set the threshold against it."
        />
        <P>
          Both dates are far later than most borrowers expect — the 80% mark
          arrives in <strong>month 95</strong>, which is almost eight years of
          payments — and the gap between the two thresholds costs another{" "}
          <strong>$1,575</strong>. If the loan documents do permit a
          borrower-requested cancellation at 80%, asking on time is worth doing;
          the automatic termination at 78% does not depend on anyone remembering.
        </P>

        <H2>A bigger down payment shortens it by far more than you would guess</H2>
        <P>
          This is the part that surprises people. The threshold is a percentage
          of the price, so a larger down payment helps twice: the loan starts
          closer to the threshold, and the monthly payment is larger, so the
          balance falls faster. Both effects push in the same direction, and the
          combined result is not linear.
        </P>
        <DataTable
          head={[
            "Down payment",
            "Loan amount",
            "Monthly P&I",
            "Monthly PMI",
            "PMI reaches 80% in",
            "PMI paid in total",
          ]}
          align={["l", "r", "r", "r", "l", "r"]}
          rows={DOWN_PAYMENTS}
          caption="Same $300,000 price and 6.50% rate throughout; PMI modelled at 0.50% a year on each loan amount. Produced by our calculator and independently recomputed."
        />
        <P>
          Read the last three rows together and the sensitivity becomes clear.{" "}
          <strong>15% down ends PMI at month 56; 5% down ends it at month 124.</strong>{" "}
          The difference in down payment is $30,000, but the difference in PMI
          paid is $8,775 — and the borrower who put down less also carries a
          larger loan at a higher monthly payment for the whole period.
        </P>
        <Callout>
          <strong>The practical version:</strong> if you are close to the 20%
          line, closing the gap is usually worth more than it looks. Between 15%
          and 20% down, the $15,000 difference ends the $106.25 PMI charge and
          lowers principal and interest by a further $94.81 a month, for a
          combined $201.06 — but it also removes cash that would otherwise be your
          reserve. The arithmetic favours a larger down payment; the reserve
          question is the one that can actually hurt you. See{" "}
          <A href="/home-affordability-calculator">the affordability calculator</A>{" "}
          for how the two interact on your own numbers.
        </Callout>

        <H2>Paying ahead, and what it does to the PMI bill</H2>
        <P>
          Extra payments do not change the PMI amount — it is fixed at
          application. What they change is how long you keep paying it, because
          they shorten the time the balance takes to reach the threshold:
        </P>
        <DataTable
          head={["Extra each month", "PMI ends", "Brought forward by", "PMI saved"]}
          align={["r", "l", "l", "r"]}
          rows={PAYING_AHEAD}
          caption="Extra payments assumed to start with the first payment. PMI is held at $112.50 throughout, since it is charged on the original loan amount."
        />
        <P>
          An extra <strong>$200 a month</strong> brings the end date from month 95
          to month 58 and saves <strong>$4,163</strong> of PMI. That figure is
          only half the benefit: the same $200 a month also removes interest, and
          on a 30-year loan at 6.50% the interest saving is several times larger.
          The two are additive, which is why paying ahead on a loan with PMI is
          more valuable than paying ahead on one without it.
        </P>
        <P>
          One caveat that matters: the interest saving is certain, while the PMI
          saving assumes the loan is not refinanced or paid off before the
          threshold arrives. If you expect to move within a few years, the PMI
          element largely disappears from the calculation.
        </P>

        <H2>What does not remove PMI</H2>
        <UL>
          <li>
            <strong>Waiting for the market to rise.</strong> Many loans measure
            the threshold against the original purchase price or original
            appraised value, so an increase in market value does not by itself
            change anything. Some loans allow a new appraisal, but that is a
            term in your documents, not a general right.
          </li>
          <li>
            <strong>Renovating.</strong> The same logic applies — improving the
            house does not alter the denominator if the denominator is the
            original price.
          </li>
          <li>
            <strong>Asking at the wrong level.</strong> A servicer generally is
            not obliged to cancel on request before the balance reaches the
            documented threshold. Asking early is not harmful, but it is not a
            substitute for the balance getting there.
          </li>
          <li>
            <strong>Assuming all loans work the same way.</strong> Government-backed
            loans have their own rules, which can include different thresholds and
            different mechanisms. The place to look is your own loan documents and
            the official guidance for that loan type.
          </li>
        </UL>
        <P>
          Refinancing is a genuine route when the balance has not fallen far
          enough but the value has risen, because a new loan is underwritten at a
          new loan-to-value ratio. It is not free — there are closing costs, and
          the term restarts. See{" "}
          <A href="/refinance-break-even-point">the refinance break-even guide</A>{" "}
          for how to test whether the PMI saved pays for the costs.
        </P>

        <H2>How to work out your own numbers</H2>
        <P>
          Three steps, in this order:
        </P>
        <UL>
          <li>
            <strong>Find the threshold in your documents.</strong> Is it 80% of
            the original price, the original appraised value, or something else —
            and is a borrower-requested cancellation allowed at that point? This
            one line decides whether the rest of the arithmetic applies to you.
          </li>
          <li>
            <strong>Compute the month the balance gets there.</strong> The{" "}
            <A href="/mortgage-calculator">mortgage calculator</A> shows the
            monthly figure including PMI; the{" "}
            <A href="/amortization-schedule">amortization schedule</A> shows the
            balance year by year, which is where the threshold date is visible.
          </li>
          <li>
            <strong>Test the extra payment against the alternative.</strong> The
            saving is PMI plus interest; the cost is the cash and whatever else it
            would have done. If you hold any debt at a higher rate than this loan,
            clearing that first is almost always the better use of the money —
            see{" "}
            <A href="/how-to-pay-off-a-loan-early">how to pay off a loan early</A>{" "}
            for the timing arithmetic.
          </li>
        </UL>

        <H2>The short version</H2>
        <P>
          On a $270,000 loan at 6.50% with 10% down, PMI is $112.50 a month and
          stops at month 95, having cost $10,688. A larger down payment helps more
          than proportionally, because it moves the starting point and speeds the
          balance down at the same time. Extra payments do not change the PMI
          amount but do change the end date — $200 a month brings it forward 37
          months. And the threshold is defined in your loan documents, usually
          against the original value rather than today&apos;s market, so the first
          useful thing to do is read that one clause.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="how-to-remove-pmi" />
      </article>
    </main>
  );
}
