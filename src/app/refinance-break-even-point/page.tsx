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
  H3,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = pageMetadata({
  path: "/refinance-break-even-point",
  title: "Refinance Break-Even Point: How Long Until a Lower Rate Pays Off",
  description:
    "Work out the month a refinance pays for itself: closing costs divided by monthly saving, with a worked four-option example, the term-extension trap, and the cases where refinancing costs you money.",
  type: "article",
});

const PUBLISHED = "September 20, 2026";

const OPTIONS = [
  [
    "Keep existing loan",
    <strong key="k" className="text-gray-900">
      7.500%
    </strong>,
    <strong key="km" className="text-gray-900">
      $2,522.57
    </strong>,
    "—",
    "—",
    "$467,312",
  ],
  ["Refinance, 25 years", "6.250%", "$2,308.84", "$213.73", "21.1 months", "$342,653"],
  [
    <strong key="r30" className="text-gray-900">
      Refinance, 30 years
    </strong>,
    "6.250%",
    "$2,155.01",
    "$367.56",
    <strong key="r30b" className="text-gray-900">
      12.2 months
    </strong>,
    "$425,804",
  ],
  ["Refinance, 30 years", "6.000%", "$2,098.43", "$424.14", "10.6 months", "$405,434"],
  ["Refinance, 20 years", "6.500%", "$2,609.51", "−$86.94", "none on payment", "$276,281"],
];

const COSTS = [
  "Loan origination fee",
  "Application, underwriting and processing fees",
  "Appraisal fee",
  "Title search and lender's title insurance",
  "Credit report fee",
  "Recording and transfer fees",
  "Discount points, if you are buying the rate down",
  "Prepaid interest for the partial month at closing",
  "Escrow funding and any escrow shortfall on the outgoing loan",
  "Mortgage insurance premiums, where applicable",
];

/** 文中每一个金额都由 src/lib/loan.ts 生成，并经第二套独立实现复算比对 */
const FAQ = [
  {
    q: "How do I calculate my refinance break-even point?",
    a: "Divide the total closing costs by the monthly payment saving. In the worked example on this page, $4,500 of costs against a $367.56 saving gives 12.2 months. Use the full cash-to-close figure from page 1 of your Loan Estimate rather than a total quoted verbally, because the costs you leave out are precisely the ones that make the break-even look better than it is.",
  },
  {
    q: "What counts as a good break-even period?",
    a: "Under 18 months is comfortable; 18 to 36 months is reasonable if you are confident you are staying put; 36 to 60 months is marginal; and anything over 60 months should be treated with suspicion. The number is only meaningful against your realistic holding period rather than your intended one — if you have moved twice in eight years, you do not have a five-year horizon.",
  },
  {
    q: "Does refinancing always lower my monthly payment?",
    a: "No. Shortening the term usually raises it. Refinancing a $350,000 balance from 7.50% with 27 years left into a 20-year loan at 6.50% raises the payment by $86.94 a month, so there is no payment-based break-even at all — and yet that same option saves $191,031 in interest. Break-even is a tool for payment-reduction refinances and a poor tool for term-reduction ones.",
  },
  {
    q: "Should I refinance if I plan to move soon?",
    a: "Usually not, because the closing costs are paid up front while the saving accrues month by month. If your break-even is 21 months and you expect to move in twelve, you lose money on the transaction even though the new rate is genuinely lower. The exception worth considering is a lender-credit refinance with little or no cash cost — but check whether that credit comes with a prepayment penalty that would claw the benefit back.",
  },
  {
    q: "Is a no-cost refinance really free?",
    a: "No. A so-called no-cost refinance means the lender covers the closing costs in exchange for a higher interest rate, so the cost moves off the closing table and into the loan. That can be a sensible trade if you expect to keep the loan only a short time, and a poor one if you keep it for years. Ask what rate you would have been offered without the credit — the gap is the price you are paying.",
  },
];

export default function RefinanceBreakEvenGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="Refinance Break-Even Point: How Long Until a Lower Rate Pays Off"
        description="How to calculate the month a refinance pays for itself, with a worked four-option example and the term-extension trap."
        path="/refinance-break-even-point"
        siteUrl={SITE_URL}
        datePublished="2026-09-20"
        dateModified="2026-09-26"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Refinance break-even point
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          A refinance lowers your interest rate, and the marketing stops there.
          The part that matters is arithmetic you have to do yourself: a
          refinance costs money at closing, and it only makes sense if the
          monthly saving outlives those costs. The month where the two cross is
          the break-even point.
        </P>

        <H2>The calculation</H2>
        <Formula>
          Break-even months = total closing costs ÷ monthly payment saving
        </Formula>
        <P>
          That is the whole formula. It is simple enough that the difficulty is
          not the maths but the two inputs — knowing all your costs, and knowing
          how long you will actually keep the loan. Most of this guide is about
          those two things.
        </P>

        <H2>A worked example with four options</H2>
        <P>
          Suppose you owe <strong>$350,000</strong> at <strong>7.50%</strong>{" "}
          with <strong>27 years</strong> remaining. Your principal and interest
          payment is <strong>$2,522.57</strong>, and if you simply keep paying,
          the remaining interest bill is <strong>$467,312</strong>. Closing costs
          on a refinance are <strong>$4,500</strong>.
        </P>
        <DataTable
          head={[
            "Option",
            "Rate",
            "Monthly P&I",
            "Monthly saving",
            "Break-even",
            "Total interest from here",
          ]}
          align={["l", "r", "r", "r", "r", "r"]}
          rows={OPTIONS}
          caption="Break-even = $4,500 closing costs ÷ monthly saving. Total interest is the sum of all remaining payments less the $350,000 balance. Produced by our loan calculator and independently recomputed."
        />
        <P>
          Look at the second and third rows together, because they show why
          break-even alone is a dangerous metric.
        </P>

        <H2>The term-extension trap</H2>
        <P>
          The 30-year refinance at 6.25% has the best-looking numbers in the
          table if you only read the middle columns: it cuts your payment by{" "}
          <strong>$367.56 a month</strong>, the largest saving of any option, and
          it pays for itself in just <strong>12.2 months</strong>. On a
          break-even screen it wins easily.
        </P>
        <P>
          Now read the last column. Over the remaining life of the loan it saves
          only <strong>$41,509</strong> in interest — because you have reset the
          clock and now have 30 years of payments ahead of you instead of 27.
          You bought a lower rate and gave back most of the benefit in extra
          time.
        </P>
        <P>
          The 25-year refinance at the same 6.25% is the opposite profile. It
          saves less each month (<strong>$213.73</strong>) and takes longer to
          break even (<strong>21.1 months</strong>), but it removes{" "}
          <strong>$124,659</strong> of interest — three times the 30-year
          option&apos;s saving.
        </P>
        <Callout>
          <strong>The rule this example encodes:</strong> a refinance changes
          three things at once — the rate, the term, and the fees. Comparing only
          the payment compares one of them. Always put the total-interest column
          next to the break-even column before deciding.
        </Callout>

        <H2>The option with no break-even at all</H2>
        <P>
          The final row is the most instructive. Refinancing into a 20-year loan
          at 6.50% <em>raises</em> your payment by $86.94 a month, so there is no
          payment-based break-even — by that metric alone you would reject it
          immediately. And yet it saves <strong>$191,031</strong> in interest,
          the largest saving in the table by a wide margin.
        </P>
        <P>
          This is a deliberate trade: a higher monthly commitment in exchange for
          a much shorter borrowing period. Whether it is right depends entirely
          on whether your budget can carry the higher payment and whether the
          loan term matters to you at all. It illustrates that{" "}
          <strong>break-even is a tool for one kind of refinance</strong> — the
          payment-reduction kind — and a poor tool for the term-reduction kind.
        </P>

        <H2>What actually counts as closing costs</H2>
        <P>
          The break-even gets worse the more costs you omit, and borrowers
          routinely omit half of them. Put every one of these into the
          calculation:
        </P>
        <UL>
          {COSTS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </UL>
        <P>
          Your Loan Estimate lists them in sections A through C, with a
          &ldquo;Estimated Cash to Close&rdquo; figure on page 1. Use that number,
          not a total someone quoted you verbally.
        </P>
        <H3>Rolling costs into the loan</H3>
        <P>
          Many lenders will add closing costs to the new balance instead of
          collecting them in cash. This does not make them disappear — you now
          pay interest on them for the life of the loan. If you refinance
          $350,000 with $4,500 of costs rolled in, your new principal is
          $354,500 and every figure in the table above shifts slightly. It is a
          legitimate cash-flow choice, but for break-even purposes the cost is
          still real and still counts.
        </P>

        <H2>How long will you actually keep the loan?</H2>
        <P>
          The break-even month is only meaningful against your real holding
          period. Common rules of thumb, with their reasoning:
        </P>
        <DataTable
          head={["Break-even", "Read it as"]}
          align={["l", "l"]}
          rows={[
            ["Under 18 months", "Comfortable. You would need a very near-term move to lose money."],
            ["18–36 months", "Reasonable if you are confident you are staying put for at least three years."],
            ["36–60 months", "Marginal. A job change, a move or a further rate drop can wipe out the benefit."],
            ["Over 60 months", "Treat with suspicion. You are betting five-plus years of stability on a modest rate improvement."],
          ]}
        />
        <P>
          Be honest about your own history. If you have moved twice in eight
          years, you do not have a five-year horizon regardless of what you
          intend. Break-even maths rewards realism, not optimism.
        </P>

        <H2>Reasons not to refinance, even when the maths works</H2>
        <UL>
          <li>
            <strong>You are close to paying off the loan.</strong> The
            interest-savings argument weakens dramatically in the final years,
            because most of each payment is already principal. Run your
            remaining schedule in the <A href="/">loan calculator</A> — if you
            are past the crossover point described in our{" "}
            <A href="/how-loan-amortization-works">amortization guide</A>, a
            refinance has little left to save.
          </li>
          <li>
            <strong>You would be extending a term you do not want extended.</strong>{" "}
            Lower payment, more years, similar total cost is a common and
            disappointing outcome.
          </li>
          <li>
            <strong>You would reset mortgage insurance.</strong> Where mortgage
            insurance applies, refinancing can restart a premium you were close
            to shedding.
          </li>
          <li>
            <strong>You are doing it for cash-out reasons rather than rate reasons.</strong>{" "}
            Tapping equity converts a secured loan into spendable money, which is
            a different decision with a different risk profile. Do the{" "}
            <A href="/how-to-compare-loan-offers">offer comparison</A> as
            carefully as you would for a new purchase, not less carefully.
          </li>
          <li>
            <strong>Your credit or income has changed.</strong> A refinance
            application is a fresh underwriting decision. A rate you can no
            longer qualify for is not a rate.
          </li>
        </UL>

        <H2>A refinance checklist</H2>
        <ol className="ml-5 mt-4 list-decimal space-y-2 leading-relaxed text-gray-600">
          <li>
            Get your current balance, rate and remaining term from your servicer.
          </li>
          <li>
            Get a Loan Estimate from at least two lenders, and read the cash to
            close on page 1 and the APR on page 3.
          </li>
          <li>
            Compute the monthly saving for the same remaining term first — this
            is the apples-to-apples comparison that isolates the rate reduction
            from the term change.
          </li>
          <li>
            Then compute the shorter-term and longer-term variants and compare
            the total-interest column, not just the payment.
          </li>
          <li>
            Divide the cash-to-close figure by the monthly saving to get
            break-even months.
          </li>
          <li>
            Compare that number against a pessimistic estimate of how long you
            will stay.
          </li>
          <li>
            Run every candidate scenario through the <A href="/">loan calculator</A>{" "}
            yourself so you are reading figures you generated, not figures you
            were shown.
          </li>
        </ol>

        <H2>The short version</H2>
        <P>
          Closing costs divided by monthly saving gives you the break-even month.
          Use the full cash to close, not the headline fee, and compare the
          break-even against a realistic estimate of how long you will keep the
          loan. Then — before you sign — put the total-interest figures for a
          same-term refinance, a shortened term and a lengthened term side by
          side, because the option with the fastest break-even is frequently not
          the option that saves you the most money.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="refinance-break-even-point" />
      </article>
    </main>
  );
}
