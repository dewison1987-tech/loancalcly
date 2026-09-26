import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import {
  A,
  ArticleFooter,
  ArticleSchema,
  Byline,
  Faq,
  Formula,
  H2,
  P,
} from "@/components/Prose";

export const metadata: Metadata = pageMetadata({
  path: "/how-loan-amortization-works",
  title: "How Loan Amortization Works (With a Month-by-Month Example)",
  description:
    "A plain-English explanation of loan amortization: the formula, a worked month-by-month example, when principal finally overtakes interest, and why extra early payments save so much.",
  type: "article",
});

const PUBLISHED = "September 20, 2026";

const SCHEDULE = [
  { m: 1, interest: "$1,625.00", principal: "$988.32", balance: "$299,011.68" },
  { m: 2, interest: "$1,619.65", principal: "$993.68", balance: "$298,018.00" },
  { m: 3, interest: "$1,614.26", principal: "$999.06", balance: "$297,018.94" },
  { m: 4, interest: "$1,608.85", principal: "$1,004.47", balance: "$296,014.48" },
  { m: 5, interest: "$1,603.41", principal: "$1,009.91", balance: "$295,004.56" },
  { m: 6, interest: "$1,597.94", principal: "$1,015.38", balance: "$293,989.18" },
];

/** 文中每一个金额都由 src/lib/loan.ts 生成，并经第二套独立实现复算比对 */
const FAQ = [
  {
    q: "Why is almost all of my early payment interest?",
    a: "Because interest is charged on the balance outstanding, and at the start the balance is at its highest. On a $300,000 loan at 6.5% over 15 years, the first payment of $2,613.32 contains $1,625.00 of interest — about 62% of it — and only $988.32 reduces the debt. As the balance falls the interest charge falls with it, so the same fixed payment leaves progressively more for principal.",
  },
  {
    q: "When does principal start to exceed interest?",
    a: "The crossover depends on the rate and the term, and it arrives far sooner on a shorter loan. On $300,000 at 6.5% over 15 years it happens in month 53. On the same amount at the same rate over 30 years it does not happen until month 233 — more than nineteen years in which the majority of every payment services interest rather than reducing the debt.",
  },
  {
    q: "Do extra payments really shorten the loan?",
    a: "Yes, and by more than most people expect. Adding $200 a month to that $300,000 15-year loan repays it in 160 months instead of 180 and cuts total interest from $170,398 to $148,829 — a saving of $21,569. The extra payment removes principal early, which removes every future interest charge that principal would have generated. That is why the same extra payment made in the final year saves far less.",
  },
  {
    q: "Is a 15-year loan always better than a 30-year loan?",
    a: "It costs far less in total but much more each month, so the answer depends on your constraint. On $300,000 at 6.5%, the 15-year loan pays $170,398 of interest against $382,633 for the 30-year — a gap of $212,235. But the monthly payment is $2,613.32 against $1,896.20. Neither is universally right; what matters is choosing the term deliberately rather than accepting whichever one is proposed.",
  },
  {
    q: "Does the amortization schedule include taxes and insurance?",
    a: "No. Amortization covers principal and interest only. A real mortgage payment usually adds property tax, homeowners insurance, mortgage insurance where the down payment is below the lender's threshold, and sometimes HOA dues. None of those amounts reduces your loan balance, which is why a lender assesses you against a larger figure than any principal-and-interest number.",
  },
];

export default function AmortizationGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="How Loan Amortization Works (With a Month-by-Month Example)"
        description="A plain-English explanation of loan amortization with a worked example, the crossover point and the effect of extra payments."
        path="/how-loan-amortization-works"
        siteUrl={SITE_URL}
        datePublished="2026-09-20"
        dateModified="2026-09-26"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          How loan amortization works
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          If you have ever looked at a mortgage statement after three years of
          payments and wondered why the balance has barely moved, amortization
          is the answer. The word sounds technical, but the idea is simple — and
          understanding it is the difference between paying your loan down
          efficiently and quietly paying far more interest than you needed to.
        </P>

        <H2>What &ldquo;amortization&rdquo; actually means</H2>
        <P>
          Amortization is the process of paying off a debt through a series of
          equal, scheduled payments. Each payment is split into two parts:
          interest owed for that period, and principal that reduces the balance.
          The payment itself never changes on a fixed-rate loan. What changes is
          the <em>ratio</em> between those two parts.
        </P>
        <P>
          The mechanism is straightforward once you see it. Interest is charged
          on the balance outstanding, not on the original amount. When the
          balance is high — as it is at the start — the interest slice is large
          and the principal slice is small. As the balance falls, the interest
          slice shrinks, which leaves more of the same fixed payment to attack
          the principal. That creates a slow, compounding acceleration: the loan
          pays itself off faster and faster in its later years, even though the
          payment never moves.
        </P>

        <H2>The formula, term by term</H2>
        <P>
          Lenders calculate a fixed-rate payment with this formula, which is the
          same one our{" "}
          <Link
            href="/"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            loan calculator
          </Link>{" "}
          uses:
        </P>
        <Formula>
          M = P × [ r(1 + r)<sup>n</sup> ] / [ (1 + r)<sup>n</sup> − 1 ]
        </Formula>
        <ul className="ml-5 mt-4 list-disc space-y-2 leading-relaxed text-gray-600">
          <li>
            <strong>M</strong> — the monthly payment, which stays constant.
          </li>
          <li>
            <strong>P</strong> — the principal, meaning the amount actually
            borrowed (not the purchase price).
          </li>
          <li>
            <strong>r</strong> — the monthly interest rate: the annual rate
            divided by 12. A 6.5% annual rate becomes 0.005416…, not 0.065.
            Forgetting this step is the most common arithmetic error.
          </li>
          <li>
            <strong>n</strong> — the total number of payments: years × 12. A
            15-year loan has 180.
          </li>
        </ul>
        <P>
          The numerator pushes the payment up as the rate rises; the
          denominator spreads the cost across the term. Notably, the formula
          contains no separate term for &ldquo;how much interest you pay in
          total&rdquo; — that emerges from running the schedule, which is why
          two loans with the same rate can cost wildly different amounts.
        </P>

        <H2>A worked example, month by month</H2>
        <P>
          Take a <strong>$300,000</strong> loan at <strong>6.5% APR</strong> over{" "}
          <strong>15 years</strong>. Plugging those numbers in gives a monthly
          payment of <strong>$2,613.32</strong>. Here is exactly how the first
          six months break down:
        </P>

        <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm tabular-nums">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Month</th>
                <th className="px-4 py-2.5 text-right font-medium">Interest</th>
                <th className="px-4 py-2.5 text-right font-medium">
                  Principal
                </th>
                <th className="px-4 py-2.5 text-right font-medium">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {SCHEDULE.map((row) => (
                <tr key={row.m}>
                  <td className="px-4 py-2.5">{row.m}</td>
                  <td className="px-4 py-2.5 text-right">{row.interest}</td>
                  <td className="px-4 py-2.5 text-right">{row.principal}</td>
                  <td className="px-4 py-2.5 text-right text-gray-900">
                    {row.balance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <P>
          Look at month one. You pay <strong>$2,613.32</strong>, and{" "}
          <strong>$1,625.00 of it is interest</strong> — about 62% of the
          payment. Only <strong>$988.32</strong> actually reduces your debt.
          After six months you have handed over roughly $15,680, and the balance
          has fallen by around $6,000.
        </P>
        <P>
          Now look at the other end of the same loan. In month 178 the interest
          portion is <strong>$42.01</strong> and the principal portion is{" "}
          <strong>$2,571.31</strong>. In the final month, interest is just{" "}
          <strong>$14.08</strong>. The payment never changed — the split
          inverted completely.
        </P>
        <P>
          Zoomed out to years, the contrast is stark. Across the first year,
          $19,140 goes to interest and $12,220 to principal. In the fifteenth
          and final year, only $1,077 goes to interest while $30,283 goes to
          principal.
        </P>

        <H2>The crossover point</H2>
        <P>
          At some point the principal slice overtakes the interest slice. On
          this loan that happens in <strong>month 53</strong> — four years and
          five months in. Until then, more than half of every payment is
          servicing the cost of borrowing rather than reducing the debt.
        </P>
        <P>
          The position of that crossover depends on the rate and the term. Raise
          the rate and it moves later; shorten the term and it moves earlier.
          This is why a borrower who refinances from a 30-year to a 15-year term
          feels the loan &ldquo;start working&rdquo; much sooner, even though
          the monthly payment hurts more.
        </P>

        <H2>Why extra payments early are worth so much more than later</H2>
        <P>
          An extra payment made in year one reduces the balance for every
          subsequent month, so it removes not just that principal but all the
          future interest that principal would have accrued. The same extra
          payment made in year ten has far less runway to work with.
        </P>
        <P>
          Take the loan above and add <strong>$200 a month</strong> from the
          start. It is repaid in <strong>160 months instead of 180</strong> —
          about 13 years and 4 months — and total interest falls from{" "}
          <strong>$170,398</strong> to <strong>$148,829</strong>. That is{" "}
          <strong>$21,569 saved</strong> for $200 a month over the life of the
          loan, and a payoff 20 months earlier.
        </P>
        <P>
          The same logic runs in reverse for the lender. Prepayment penalties,
          where they exist, are designed to claw back interest the lender
          expected to earn in exactly these later years.
        </P>

        <H2>How the term changes everything</H2>
        <P>
          Compare a $250,000 loan at 6.5% over 30 years against the same amount
          over 15 years. The 30-year payment is roughly 40% lower — but the
          total interest is dramatically higher, because you are renting the
          money for twice as long and repaying principal far more slowly. Each
          dollar of principal takes much longer to retire, which means it
          accrues interest for much longer.
        </P>
        <P>
          The honest summary: a short term is expensive monthly and cheap
          overall; a long term is comfortable monthly and expensive overall.
          Neither is universally right — it depends on whether your constraint
          is cash flow or total cost. What matters is choosing deliberately
          rather than defaulting to the longest term on offer.
        </P>

        <H2>What amortization does not include</H2>
        <P>
          An amortization schedule covers principal and interest only. A real
          mortgage payment usually also includes:
        </P>
        <ul className="ml-5 mt-4 list-disc space-y-2 leading-relaxed text-gray-600">
          <li>
            <strong>Property taxes</strong>, collected monthly into escrow.
          </li>
          <li>
            <strong>Homeowners insurance</strong>, also typically escrowed.
          </li>
          <li>
            <strong>Mortgage insurance</strong> (PMI or MIP) where the down
            payment is below the lender&apos;s threshold.
          </li>
          <li>
            <strong>HOA dues</strong>, in some properties.
          </li>
          <li>
            <strong>Up-front costs</strong> — origination fees, discount points
            and closing costs, which are paid at the start and so never appear
            in the schedule.
          </li>
        </ul>
        <P>
          For that reason the &ldquo;monthly payment&rdquo; our calculator
          returns is best read as the principal-and-interest component. Your
          lender&apos;s Loan Estimate is the document that adds the rest.
        </P>

        <H2>Glossary</H2>
        <dl className="mt-4 space-y-3 leading-relaxed text-gray-600">
          {[
            ["Principal", "The amount borrowed, separate from interest and fees."],
            ["Interest rate", "The annual cost of borrowing the principal, as a percentage."],
            ["APR", "Annual Percentage Rate — the interest rate plus most lender fees, expressed as a yearly rate. Usually higher than the headline rate."],
            ["Amortization schedule", "The month-by-month table showing each payment's split between interest and principal, and the remaining balance."],
            ["Term", "How long the loan runs. Longer terms mean lower payments and more total interest."],
            ["Escrow", "An account your lender uses to collect and hold money for taxes and insurance, then pay them on your behalf."],
            ["PMI", "Private mortgage insurance — usually required on conventional mortgages when the down payment is under 20%."],
            ["Prepayment penalty", "A fee some lenders charge if you pay the loan off early, intended to recover expected interest."],
          ].map(([term, def]) => (
            <div key={term}>
              <dt className="font-medium text-gray-900">{term}</dt>
              <dd className="mt-0.5">{def}</dd>
            </div>
          ))}
        </dl>

        <H2>Put it to work</H2>
        <P>
          The fastest way to internalise this is to watch it happen. Open the{" "}
          <A href="/">loan calculator</A>
          , enter your own numbers, and scroll the amortization schedule. Then
          change only the term, and compare the Total interest line. The gap
          between a 15-year and a 30-year loan on the same amount is usually the
          single most eye-opening number in personal finance.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="how-loan-amortization-works" />
      </article>
    </main>
  );
}
