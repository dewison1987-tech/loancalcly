import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import {
  A,
  ArticleFooter,
  ArticleSchema,
  Byline,
  Callout,
  DataTable,
  Formula,
  H2,
  H3,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = {
  alternates: { canonical: "/apr-vs-interest-rate" },
  title: "APR vs Interest Rate: What Is the Difference, and Which Should You Compare?",
  description:
    "The interest rate prices the money; APR prices the loan. See what APR includes, what it leaves out, a worked three-lender example, and the situations where comparing APR misleads you.",
};

const PUBLISHED = "September 20, 2026";

const THREE_LENDERS = [
  [
    "Lender A",
    "6.500%",
    "$3,000",
    "$1,896.20",
    "6.597%",
  ],
  [
    "Lender B",
    <span key="b" className="font-medium text-gray-900">
      6.000%
    </span>,
    "$4,200 (1 point + $1,200)",
    "$1,798.65",
    <span key="bapr" className="font-medium text-gray-900">
      6.132%
    </span>,
  ],
  [
    "Lender C",
    "6.750%",
    "$0",
    "$1,945.79",
    "6.750%",
  ],
];

export default function AprVsRateGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="APR vs Interest Rate: What Is the Difference, and Which Should You Compare?"
        description="What each number measures, what APR leaves out, a worked three-lender example, and the cases where APR comparison misleads."
        path="/apr-vs-interest-rate"
        siteUrl={SITE_URL}
        datePublished="2026-09-20"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          APR vs interest rate
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          The interest rate and the APR both describe the cost of a loan, both
          are expressed as a percentage, and they are almost never the same
          number. Borrowers who treat them as interchangeable regularly pick the
          more expensive of two loans — and are surprised afterwards.
        </P>

        <H2>The difference in one sentence</H2>
        <P>
          <strong>The interest rate prices the money you borrowed. The APR
          prices the loan you signed.</strong>
        </P>
        <P>
          The interest rate is applied to your outstanding balance to work out
          each period&apos;s interest charge. Nothing else enters that
          calculation. The APR starts from the interest rate and then adds the
          cost of the up-front fees the lender charges — origination, discount
          points, and certain other finance charges — and expresses the whole
          thing as a single annual rate. It answers a different question: not
          &ldquo;what does the balance cost me each month?&rdquo; but &ldquo;what
          did this loan cost me in total, per year?&rdquo;
        </P>
        <P>
          The APR also assumes you hold the loan to the end of its full term and
          make every payment on time. That assumption is the source of both its
          usefulness and its most common failure — more on that below.
        </P>

        <H2>A worked example with three lenders</H2>
        <P>
          Take a $300,000 30-year fixed loan and three genuinely different offers.
          Lender B advertises the lowest rate. Lender C advertises the lowest
          fees. Lender A sits in between.
        </P>
        <DataTable
          head={[
            "Lender",
            "Interest rate",
            "Up-front fees",
            "Monthly payment",
            "APR",
          ]}
          align={["l", "r", "r", "r", "r"]}
          rows={THREE_LENDERS}
          caption="$300,000 over 30 years. APRs computed on net proceeds (loan amount less up-front finance charges) with the standard monthly-rate solve, then ×12. Your lender's disclosed APR governs; this is an illustration of the concept."
        />
        <P>
          Notice what the table exposes. Lender C charges no fees at all, and it
          has the <em>highest</em> APR — because there is nothing to add to a
          rate of 6.750%. Its APR equals its rate exactly. A borrower scanning
          for &ldquo;the lowest rate&rdquo; would rule Lender C out immediately,
          and a borrower scanning for &ldquo;the lowest APR&rdquo; would rule it
          out too. Both are correct in the long run: over 30 years, Lender B is
          cheaper.
        </P>
        <P>
          But look at the fee column again. Lender B costs <strong>$4,200</strong>{" "}
          up front against Lender C&apos;s <strong>zero</strong>. That $4,200 is
          real money out of your pocket at closing, and whether it is worth
          spending depends entirely on how long you keep the loan — which is the
          subject of the next section.
        </P>

        <H2>How APR is calculated (and why it is higher)</H2>
        <P>
          APR is found by solving for the rate at which your payment stream
          equals the money you actually received. If you borrow $300,000 and pay
          $4,200 in finance charges, you received $295,800 but you will repay as
          though you borrowed $300,000. The APR is the rate that makes those two
          consistent:
        </P>
        <Formula>
          Solve for i: net proceeds = payment × [1 − (1 + i)<sup>−n</sup>] ÷ i,
          then APR = i × 12
        </Formula>
        <UL>
          <li>
            <strong>Net proceeds</strong> — the amount advanced, minus up-front
            finance charges.
          </li>
          <li>
            <strong>i</strong> — the monthly rate that reconciles the two sides.
          </li>
          <li>
            <strong>n</strong> — the number of monthly payments: 360 for a
            30-year loan.
          </li>
        </UL>
        <P>
          Two consequences follow directly from that formula and are worth
          internalising. First, the APR is always greater than or equal to the
          interest rate; it can never be lower, because it adds cost without
          adding benefit. Second, the gap between them shrinks as the term
          lengthens — the same $3,000 spread over 30 years moves the annual rate
          far less than it would over 10 — and it grows as the fees grow.
        </P>
        <P>
          This is why a short-term loan with modest fees can show a
          startlingly high APR, and why the same fee on a 30-year mortgage barely
          registers. The APR is not lying in either case; it is faithfully
          annualising a cost over a specific horizon.
        </P>

        <H2>When comparing APR will lead you astray</H2>
        <P>
          APR is the right tool for the majority of fixed-rate, keep-it-to-term
          decisions. It is the wrong tool in four recurring situations.
        </P>
        <H3>1. You will not keep the loan to term</H3>
        <P>
          Because APR assumes every payment is made for the full term, the value
          of discount points is spread across all 360 months. If you sell in year
          four, you paid the fees but never collected most of the benefit. In
          this scenario the low-APR loan is usually the <em>worse</em> deal, and
          you should compare the rate and the cash to close instead. The{" "}
          <A href="/how-to-compare-loan-offers">
            break-even arithmetic for points
          </A>{" "}
          is set out in our comparison guide.
        </P>
        <H3>2. The loan is adjustable-rate</H3>
        <P>
          An adjustable-rate mortgage&apos;s APR is calculated on a projected
          path for the underlying index, which nobody can know. Two lenders can
          publish very different APRs on structurally identical adjustable loans
          purely because they assumed different future rates. Treat a quoted APR
          on an adjustable loan as a rough indicator, not a ranking.
        </P>
        <H3>3. A lender credit is in play</H3>
        <P>
          A lender credit means the lender covers some closing costs in exchange
          for a higher rate. That reliably worsens the APR — you are paying more
          interest for the privilege of paying less today — but for a borrower
          who plans to refinance or move within a few years, it can be the better
          choice. APR will tell you to avoid it. Your time horizon says otherwise.
        </P>
        <H3>4. Costs outside the finance charge</H3>
        <P>
          Not every dollar you pay at closing appears in the APR. Third-party
          costs such as title services, appraisals, credit reports, notary fees
          and recording charges are generally excluded from the finance charge
          used to compute APR. Two loans with identical APRs can therefore require
          very different amounts of cash at closing. APR ranks the loans; it does
          not rank your closing bill.
        </P>

        <H2>What APR does and does not include</H2>
        <DataTable
          head={["Generally included in APR", "Generally excluded from APR"]}
          align={["l", "l"]}
          rows={[
            ["Origination fee", "Title search, title insurance"],
            ["Discount points", "Appraisal fee"],
            ["Mortgage insurance premiums", "Credit report fee"],
            ["Prepaid interest and mortgage broker fees", "Notary, recording, courier fees"],
            ["Certain closing costs that are finance charges", "Property taxes and homeowners insurance"],
            ["", "HOA dues and transfer taxes"],
          ]}
          caption="Simplified summary of the general rule. The itemisation on your Loan Estimate and the disclosed APR are authoritative for your loan."
        />

        <H2>How to use both numbers together</H2>
        <P>
          You do not have to choose between them. Use them in sequence:
        </P>
        <UL>
          <li>
            <strong>First, filter on cash at closing.</strong> If a loan requires
            more cash than you have, it is out, whatever its APR. This single
            constraint eliminates more options than any rate comparison.
          </li>
          <li>
            <strong>Then compare APR within the same term.</strong> Compare a
            30-year only against other 30-year loans. The same is true of rate
            type.
          </li>
          <li>
            <strong>Then check your horizon against the break-even.</strong> If
            you are likely to move or refinance before the break-even month, pay
            no points and prefer the lower cash-to-close offer.
          </li>
          <li>
            <strong>Then confirm the total.</strong> Run each surviving offer
            through the <A href="/">loan calculator</A> and record the monthly
            payment and total interest. The total is the number that actually
            leaves your accounts.
          </li>
        </UL>
        <Callout>
          <strong>A practical sanity check.</strong> If the lowest-rate offer also
          has the lowest APR, it is probably genuinely the cheapest for a
          long-term borrower — that combination is hard to fake. If the
          lowest-rate offer has a noticeably higher APR than a competitor, the
          rate is being subsidised by fees, and your decision rests entirely on
          your time horizon.
        </Callout>

        <H2>Frequently asked questions</H2>
        <H3>Can APR ever be lower than the interest rate?</H3>
        <P>
          No. APR is the interest rate plus fees annualised, so it is equal when
          there are no finance charges and higher whenever there are. If a quoted
          APR comes back below the quoted rate, something in the quote is wrong;
          ask the lender to explain it before proceeding.
        </P>
        <H3>Which number should I quote when comparing offers?</H3>
        <P>
          Both, plus the cash to close. Asking for APR alone invites a quote with
          heavy fees and a low rate; asking for rate alone invites the reverse.
          Asking for all three makes the trade-off visible.
        </P>
        <H3>Does a lower APR always mean a cheaper loan?</H3>
        <P>
          For a fixed-rate loan held to term, yes. For any other scenario — a
          short holding period, an adjustable rate, a lender credit, or
          comparison across different terms — no. APR is a good default and a
          poor absolute.
        </P>
        <H3>Where do I find my loan&apos;s APR?</H3>
        <P>
          On page 3 of the Loan Estimate, in the Comparisons section, alongside
          the total interest percentage and the total you would pay in the first
          five years. That page exists precisely to support this comparison.
        </P>

        <ArticleFooter currentSlug="apr-vs-interest-rate" />
      </article>
    </main>
  );
}
