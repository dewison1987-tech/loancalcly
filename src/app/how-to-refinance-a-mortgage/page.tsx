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
  path: "/how-to-refinance-a-mortgage",
  title: "How to Refinance a Mortgage",
  description:
    "After 10 years on a 6.50% loan, refinancing the $254,328 balance at 6.00% cuts the payment by $371.38 and adds $93,849 of interest. Why the clock matters more than the rate.",
  type: "article",
});

const PUBLISHED = "October 3, 2026";

/**
 * 全部数字由 src/lib/loan.ts 生成（runAmortization），并经 Python / Node
 * 两套独立实现 + 站点内核三方逐位复算。
 */
const CLOCK = [
  [
    <strong key="s" className="text-gray-900">
      Stay put
    </strong>,
    "$1,896.20",
    "—",
    "$382,633",
    "—",
  ],
  [
    <strong key="a" className="text-gray-900">
      Refinance to 6.00%, 30 years
    </strong>,
    "$1,524.83",
    "$294,609",
    "$476,482",
    <strong key="a2" className="text-gray-900">
      +$93,849
    </strong>,
  ],
  [
    "Refinance to 6.00%, 20 years",
    "$1,822.09",
    "$182,973",
    "$364,845",
    <strong key="b2" className="text-gray-900">
      −$17,788
    </strong>,
  ],
  [
    "Refinance to 6.00%, 15 years",
    "$2,146.17",
    "$131,982",
    "$313,855",
    "−$68,779",
  ],
];

const FIRST_TEN = [
  ["Interest paid", "$181,873"],
  ["Principal repaid", "$45,672"],
  ["Balance remaining", "$254,328"],
];

const CASHOUT = [
  ["Refinance the balance only, 30 years at 6.50%", "$254,328", "$1,607.53"],
  ["Refinance the balance plus $50,000, 30 years at 6.50%", "$304,328", "$1,923.56"],
];

const FAQ = [
  {
    q: "Does a lower interest rate always mean a cheaper loan?",
    a: "No, and the gap can be large. On a $254,328 balance, moving from 6.50% to 6.00% and restarting a 30-year term lowers the payment by $371.38 a month but raises the interest paid across both loans from $382,633 to $476,482. The rate fell; the cost of the money rose, because the new loan starts the clock again and charges interest on the whole balance for thirty more years.",
  },
  {
    q: "How do I refinance without extending my payoff date?",
    a: "Match the new term to the time remaining on the old loan rather than taking the longest term offered. If ten years have passed on a 30-year loan, ask for a 20-year term. On the same balance that produces a payment of $1,822.09 — still $74.12 lower than the $1,896.20 you were paying — and total interest across both loans falls by $17,788. A 15-year term lowers the total further but raises the monthly payment to $2,146.17.",
  },
  {
    q: "Is a no-cost refinance really free?",
    a: "Not usually. Costs are real, and if you are not paying them at closing they are generally recovered through a higher rate or added to the balance, which means you pay interest on them for the life of the loan. What a no-cost structure genuinely buys is protection if you move or refinance again soon: you do not have to stay long enough to earn back an upfront fee. The trade is that it costs more if you do stay.",
  },
  {
    q: "How long do I have to stay for a refinance to pay off?",
    a: "Divide the closing costs by the monthly saving. On this balance the costs are about $5,087 and the saving against a 20-year term is $74.12 a month, so the break-even is roughly 69 months. Against the 30-year term the saving is $371.38 a month and the break-even is under 14 months — but that is the version that also increases your total interest, so a fast break-even is not by itself a reason to take it.",
  },
  {
    q: "Does taking cash out change what the loan costs?",
    a: "It adds the cost of the money you take, on top of the refinance itself. Borrowing an extra $50,000 on the same terms raises the payment from $1,607.53 to $1,923.56 and adds $63,772 of interest over the life of the loan. Whether that is expensive depends on the alternative you are comparing it with, and cash-out pricing is often slightly worse than rate-and-term pricing, so the number to check is the rate you are actually offered for the cash-out version.",
  },
];

export default function HowToRefinanceAMortgageGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="How to Refinance a Mortgage"
        description="What a refinance does to the clock rather than just the rate, why a lower rate can raise total interest, what cash out costs, and the checks to make before signing."
        path="/how-to-refinance-a-mortgage"
        siteUrl={SITE_URL}
        datePublished="2026-10-03"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          How to refinance a mortgage
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          A refinance replaces one loan with another. That sounds like a
          narrow, mechanical transaction, and most of the marketing around it
          treats it as one: a lower rate, a lower payment, a decision that
          makes itself. The part that gets left out is that the new loan also
          restarts the calendar, and the calendar is where a large share of the
          money lives.
        </P>
        <P>
          The numbers below are all from one loan: $300,000 at 6.50% over 30
          years, payment $1,896.20, total interest $382,633. We refinance it at
          the ten-year mark, when the balance stands at $254,328.
        </P>

        <H2>The same balance, four different decisions</H2>
        <P>
          Rates have fallen to 6.00%. Here is what happens to the payment and
          to the interest bill across the two loans put together:
        </P>
        <DataTable
          head={[
            "Option at month 120",
            "New payment",
            "Interest on the new loan",
            "Interest, both loans",
            "Change",
          ]}
          align={["l", "r", "r", "r", "r"]}
          rows={CLOCK}
          caption="$254,328 outstanding after 120 payments on a $300,000 loan at 6.50% over 30 years, refinanced at 6.00%. Comparison is against the $382,633 of interest the original loan would have cost if left alone. Produced by our calculator and independently recomputed."
        />
        <P>
          Read the first two rows together. The rate falls by half a point, the
          payment falls by <strong>$371.38 a month</strong>, and the interest
          you pay over the life of the borrowing rises by{" "}
          <strong>$93,849</strong>. Nothing about the rate was a trick. The term
          went back to 30 years, so the balance you still owe gets charged
          interest for another three decades instead of the two that remained.
        </P>
        <P>
          Then read the third row. Taking a <em>shorter</em> term at the same
          6.00% also lowers the payment — by $74.12 — and lowers the total
          interest by $17,788. Both of the things people want from a refinance
          are available at once; the 30-year version gives up the second one in
          exchange for a bigger version of the first.
        </P>
        <Callout>
          <strong>The single variable that decides this:</strong> the term you
          ask for. At the same rate, on the same balance, the difference between
          a 30-year and a 15-year term is $621.34 a month and{" "}
          <strong>$162,628</strong> of interest. The rate is what the
          conversation is about; the term is what the money is about.
        </Callout>

        <H2>Why the balance had barely moved</H2>
        <P>
          Ten years of payments is $227,544 out of your account on this loan.
          Here is where it went:
        </P>
        <DataTable
          head={["After 120 payments of $1,896.20", "Amount"]}
          align={["l", "r"]}
          rows={FIRST_TEN}
          caption="A $300,000 loan at 6.50% over 30 years. Produced by our calculator and independently recomputed."
        />
        <P>
          Four dollars of interest for every dollar of principal. This is why
          the term matters so much: a refinance does not write off the balance,
          it re-borrows it, and it re-borrows it at the point in the schedule
          where interest is most expensive. Refinancing to save $371.38 a month
          is not a saving on the loan as it stands; it is a purchase of lower
          monthly cash flow, paid for with a longer interest bill.
        </P>

        <H2>A cash-out refinance has a second price</H2>
        <P>
          A cash-out refinance borrows more than you owe and hands you the
          difference. It is a rate-and-term refinance plus a new loan rolled
          into your mortgage, and the new loan is usually the longest, cheapest
          -looking way to borrow. Priced here at 6.50% over 30 years so that the
          only thing changing is the amount:
        </P>
        <DataTable
          head={["What you refinance", "Loan amount", "Monthly payment"]}
          align={["l", "r", "r"]}
          rows={CASHOUT}
          caption="Same 30-year term and same 6.50% rate in both rows, so the difference is entirely the $50,000. Produced by our calculator and independently recomputed."
        />
        <P>
          The $50,000 costs <strong>$63,772</strong> in interest if the loan
          runs its full term. That is not automatically a bad price for money —
          but it is a price, and it is easy to lose sight of it when the only
          visible change is the payment going up by $316.03. It is also worth
          knowing that cash-out pricing is often a little worse than
          rate-and-term pricing on the same day, so the comparison that matters
          is against the rate you are actually offered for the cash-out version,
          not the one quoted for the plain refinance.
        </P>

        <H2>The costs, and how long they take to earn back</H2>
        <P>
          A refinance is not free. Lender fees, title, appraisal, recording and
          the rest typically land somewhere around 2% of the loan, which on this
          balance is about <strong>$5,087</strong>. Divide that by the monthly
          saving and you get the number of months you have to stay for the
          refinance to have paid for itself:
        </P>
        <UL>
          <li>
            <strong>Against the 30-year term:</strong> $371.38 a month, so about
            14 months. Fast — but this is the version that adds $93,849 of
            interest, so a short break-even is not the recommendation it looks
            like.
          </li>
          <li>
            <strong>Against the 20-year term:</strong> $74.12 a month, so about
            69 months, or a little under six years. Slower, and the version that
            actually reduces what the borrowing costs.
          </li>
        </UL>
        <P>
          The arithmetic behind the break-even month has its own guide — see{" "}
          <A href="/refinance-break-even-point">refinance break-even point</A>{" "}
          — and the individual fees are broken down in{" "}
          <A href="/closing-costs-explained">closing costs explained</A>. What
          matters for this decision is the shape: a fast break-even is a
          statement about how long you must stay, not about whether the loan is
          cheaper.
        </P>

        <H2>What a refinance actually involves</H2>
        <P>
          The paperwork is similar to a purchase, minus the purchase contract.
          Most of it is a document collection exercise rather than a decision,
          and starting it early is what keeps the timeline short:
        </P>
        <UL>
          <li>
            <strong>Income and employment evidence</strong> — recent pay
            statements, and tax returns if you are self-employed or have
            variable income.
          </li>
          <li>
            <strong>The current loan statement</strong>, so the payoff figure can
            be requested and quoted accurately.
          </li>
          <li>
            <strong>Insurance and tax information</strong> for the property, since
            both are usually collected monthly alongside the payment.
          </li>
          <li>
            <strong>An appraisal</strong>, unless the loan is one that waives it.
            What you owe is known; what the property is worth is the part that
            has to be established, and it is what sets the loan-to-value ratio
            the pricing depends on.
          </li>
          <li>
            <strong>The rate lock terms</strong> — how long the quoted rate is
            held, and what happens if the closing slips past that date.
          </li>
        </UL>
        <P>
          You will also be asked about debts, since a refinance is a new
          underwriting decision and the{" "}
          <A href="/debt-to-income-ratio">debt-to-income ratio</A> is calculated
          again from scratch. A loan that was approved three years ago with
          different debts in the file is not automatically approved now.
        </P>

        <H2>When not to refinance</H2>
        <UL>
          <li>
            <strong>You will move before the break-even.</strong> The costs are
            paid on day one and recovered monthly. Selling in year two hands
            those costs to a loan you no longer have.
          </li>
          <li>
            <strong>The only gain is the payment.</strong> If the rate is barely
            below what you have and the term goes back to 30 years, you have
            bought cash flow and sold the payoff date. Sometimes that is the
            right trade — a forced one, for example — but it should be named as
            the trade it is.
          </li>
          <li>
            <strong>You are near the end of the loan.</strong> Late in the
            schedule most of each payment is already principal, so the interest
            on the remaining balance is small. Re-borrowing puts the expensive
            years back in front of you.
          </li>
          <li>
            <strong>You are rolling in other debt without changing the
            behaviour.</strong> Moving a balance onto a mortgage at a lower rate
            is real arithmetic — but it also converts unsecured debt into debt
            secured against your home, and it converts a five-year repayment
            into a thirty-year one.
          </li>
        </UL>
        <P>
          To see the effect on your own numbers, the{" "}
          <A href="/amortization-schedule">amortization schedule</A> shows the
          month interest stops outweighing principal, the{" "}
          <A href="/mortgage-calculator">mortgage calculator</A> prices any
          term and rate you like, and{" "}
          <A href="/15-vs-30-year-mortgage">15-year vs 30-year mortgage</A>{" "}
          covers the term decision on its own.
        </P>

        <H2>The short version</H2>
        <P>
          A refinance changes two things, and the rate is the one everyone talks
          about. On a $254,328 balance, moving from 6.50% to 6.00% over a fresh
          30 years lowers the payment by $371.38 and raises the total interest
          by $93,849. The same rate over a 20-year term lowers the payment by
          $74.12 and reduces total interest by $17,788. Ask for the term that
          matches the time you actually have left, price the closing costs
          against the monthly saving, and treat a cash-out as a separate loan
          that happens to share a closing.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="how-to-refinance-a-mortgage" />
      </article>
    </main>
  );
}
