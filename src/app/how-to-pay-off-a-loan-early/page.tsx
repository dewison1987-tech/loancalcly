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
  path: "/how-to-pay-off-a-loan-early",
  title: "How to Pay Off a Loan Early",
  description:
    "$10,000 paid in month 1 saves $53,917 of mortgage interest; the same $10,000 in month 301 saves $3,598. Why timing beats amount, and when paying early is wrong.",
  type: "article",
});

const PUBLISHED = "September 26, 2026";

/**
 * 全部数字由 src/lib/loan.ts 生成（lumpSumPayoff / compareExtraPayment），
 * 并经 Python / Node 两套独立实现逐位复算。
 */
const TIMING = [
  [
    <strong key="1" className="text-gray-900">
      Payment 1
    </strong>,
    "$10,000",
    <strong key="s1" className="text-gray-900">
      $53,917
    </strong>,
    "33 months",
  ],
  ["Payment 61 — year 5", "$10,000", "$37,356", "24 months"],
  ["Payment 121 — year 10", "$10,000", "$24,871", "18 months"],
  ["Payment 241 — year 20", "$10,000", "$8,668", "9 months"],
  ["Payment 301 — year 25", "$10,000", "$3,598", "7 months"],
];

const SMALL = [
  ["Payment 1", "$5,940.48"],
  ["Payment 121 — year 10", "$2,646.96"],
  ["Payment 301 — year 25", "$382.82"],
];

const APPROACHES = [
  [
    "$10,000 in payment 1",
    "$10,000",
    "$53,917",
    <strong key="e1" className="text-gray-900">
      $5.39
    </strong>,
  ],
  ["$100 a month until it clears", "$31,200", "$60,995", "$1.95"],
];

const CAR = [
  ["As scheduled", "60 months", "—", "—"],
  ["$50 a month", "54 months", "6 months", "$607"],
  ["$100 a month", "49 months", "11 months", "$1,089"],
  ["$200 a month", "41 months", "19 months", "$1,808"],
];

const FAQ = [
  {
    q: "Does paying off a loan early hurt my credit?",
    a: "It reduces your outstanding debt, which helps the amounts-owed portion of most scoring models, and it closes an account, which can slightly shorten your credit history and reduce the mix of credit types. For most people the debt reduction outweighs the rest. It is a scoring question rather than a lending question — a loan you have cleared is not a reason to refuse you a mortgage.",
  },
  {
    q: "Is it better to pay a lump sum or pay extra every month?",
    a: "For interest saved, a lump sum early is more efficient per dollar: $10,000 in payment 1 removes $53,917 of interest on a $300,000 loan, while paying $100 a month until it clears removes $60,995 in total but requires $31,200 of your money. The reason is that early dollars have more months left to save interest on. Steady payments win on flexibility, not on efficiency — you can stop them, and a lump sum is gone.",
  },
  {
    q: "Should I pay off my mortgage early or invest?",
    a: "There is no universal answer, but the comparison has to be made honestly on both sides. Paying a 6.50% mortgage has a certain, tax-free return of 6.50% in avoided interest. An investment has an uncertain return, and its advantage is only real if the after-tax return exceeds the mortgage rate. The relevant question is not which has the higher average return but whether you can tolerate the outcome where the investment underperforms and the mortgage is still there.",
  },
  {
    q: "Can extra payments be refused or penalised?",
    a: "Some loans carry a prepayment penalty for paying off or paying down ahead of schedule, especially in the first few years; many mortgages have none. The terms are in your loan documents and should be checked before sending money, because the penalty can exceed the interest saved. There are also rules about when a lender must credit an extra payment, so it is worth confirming how yours is applied.",
  },
  {
    q: "Should I pay off the smallest loan first or the highest rate?",
    a: "Highest rate first is the better arithmetic — every dollar goes where it earns the most. Smallest balance first is sometimes the better plan, because clearing an account entirely removes a fixed monthly obligation and that is often what keeps people going. Since the difference in outcome is usually modest and the difference in adherence is often large, the method you will actually continue with is the better one.",
  },
];

export default function HowToPayOffALoanEarlyGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="How to Pay Off a Loan Early"
        description="Why the same extra payment saves several times more interest when it is made early rather than late, worked through a 30-year mortgage and a car loan, with the cases where paying ahead is the wrong decision."
        path="/how-to-pay-off-a-loan-early"
        siteUrl={SITE_URL}
        datePublished="2026-09-26"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          How to pay off a loan early
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          An extra payment does two things at once: it reduces the balance, and
          it removes every future interest charge that balance would have
          generated. The second effect is the large one, and it shrinks the later
          you leave it — which is why the most useful question about paying ahead
          is not how much, but when.
        </P>
        <P>
          The numbers below are all from one mortgage, $300,000 at 6.50% over 30
          years, with a monthly payment of $1,896.20. The same arithmetic applies
          to any fixed-rate instalment loan; only the scale changes.
        </P>

        <H2>The same $10,000, five different moments</H2>
        <P>
          One payment of $10,000, made at five points across the life of the
          loan, with everything else left as scheduled:
        </P>
        <DataTable
          head={["When the $10,000 is paid", "Amount", "Interest saved", "Term shortened by"]}
          align={["l", "r", "r", "l"]}
          rows={TIMING}
          caption="$300,000 at 6.50% over 30 years, extra payment applied to principal at the start of the stated month. Produced by our calculator and independently recomputed."
        />
        <P>
          Read the first and last rows together. The same $10,000 removes{" "}
          <strong>$53,917</strong> of interest at the start and{" "}
          <strong>$3,598</strong> at year 25 — a difference of almost fifteen
          times, from the same money and the same loan. Nothing about the
          borrower changed; only the date.
        </P>

        <H2>Why the gap is that large</H2>
        <P>
          Interest is charged on the balance, month by month. When you pay down
          the balance in month 1, that amount stops generating interest for the
          remaining 360 months. When you pay it down in month 301, it stops
          generating interest for the remaining 60. The saving is proportional to
          the months of interest you prevented, and there are simply fewer of them
          late in the loan.
        </P>
        <P>
          There is a second effect working in the same direction. In the early
          years, most of each payment is interest rather than principal — on this
          loan principal does not overtake interest until{" "}
          <A href="/how-loan-amortization-works">month 233</A>. An extra payment
          in that period is doing work that the scheduled payment is barely doing
          at all.
        </P>
        <P>
          Scaled down to a single $1,000, the same shape appears and is easier to
          hold in mind:
        </P>
        <DataTable
          head={["A single $1,000 paid at", "Interest saved"]}
          align={["l", "r"]}
          rows={SMALL}
          caption="Same $300,000 loan at 6.50% over 30 years, one extra $1,000 applied to principal. Produced by our calculator and independently recomputed."
        />
        <Callout>
          <strong>The mechanism in one line:</strong> $1,000 in payment 1 saves
          $5,940.48 of interest; the same $1,000 in year 25 saves $382.82. Interest
          is charged on the balance, so removing balance early removes interest
          for every month that follows — and the later payment simply has fewer
          months left to work with.
        </Callout>

        <H2>A lump sum or a steady habit?</H2>
        <P>
          Both work, and they are not equivalent per dollar:
        </P>
        <DataTable
          head={["Approach", "Money you put in", "Interest saved", "Saved per dollar in"]}
          align={["l", "r", "r", "r"]}
          rows={APPROACHES}
          caption="The monthly approach runs until the loan clears, which takes 312 payments of $100. Both measured against the same $382,633 baseline."
        />
        <P>
          The lump sum is roughly <strong>2.8 times more efficient per dollar</strong>{" "}
          — $5.39 of interest saved for each $1, against $1.95. The reason is
          timing: a dollar paid in month 1 works for 360 months, while a dollar
          paid in month 300 works for 60. Spreading the same money across years
          means most of it arrives too late to do much.
        </P>
        <P>
          That is the arithmetic, and it is worth being honest about what it
          leaves out. A monthly extra payment is within most budgets and can be
          stopped in a bad month; a lump sum is irreversible and may consume the
          reserve that protects you. Efficiency is not the only thing being
          optimised.
        </P>

        <H2>A car loan: less to save, but faster feedback</H2>
        <P>
          Shorter loans have less interest to remove overall, but the balance
          falls quickly and the payoff date moves visibly — which is why they are
          often the better place to start:
        </P>
        <DataTable
          head={["Extra each month", "Paid off in", "Months saved", "Interest saved"]}
          align={["r", "l", "l", "r"]}
          rows={CAR}
          caption="$25,000 at 8.00% over 60 months, monthly payment $506.91, total interest $5,415 as scheduled. Produced by our calculator and independently recomputed."
        />
        <P>
          An extra $100 a month — about 20% of the payment — clears the car loan
          eleven months early and saves $1,089. The absolute saving is modest
          because the loan is small, but the ratio of saving to effort is high,
          and the freed-up $506.91 a month is money that can be redirected at
          whatever comes next.
        </P>

        <H2>When paying early is the wrong move</H2>
        <UL>
          <li>
            <strong>You hold a more expensive debt.</strong> Paying a 6.50%
            mortgage while carrying a 22% card balance is a guaranteed loss. Clear
            the higher rate first; the arithmetic is not close.
          </li>
          <li>
            <strong>You have no reserve.</strong> Money sent to the lender is very
            hard to get back, and the loan will still be there next month. A
            reserve that covers several months of payments has a value that does
            not appear in any interest calculation.
          </li>
          <li>
            <strong>There is a prepayment penalty.</strong> Some loans charge for
            paying down or paying off early, most often in the first few years.
            Check the documents — the penalty can exceed the interest saved.
          </li>
          <li>
            <strong>The rate is below inflation or below your alternatives.</strong>{" "}
            A fixed rate that is low in real terms is cheap money to hold. Paying
            it down is still a certain return equal to the rate, but it may be
            less attractive than the uses that cash has elsewhere — the comparison
            has to be made explicitly rather than assumed.
          </li>
          <li>
            <strong>You have not funded retirement accounts with tax
            advantages.</strong> Whether that matters depends on your situation and
            on the rules where you live; it is a question for someone who can see
            your whole position, not a rule of thumb.
          </li>
        </UL>

        <H2>Three mechanics worth checking first</H2>
        <P>
          Before sending anything extra, confirm three things in your loan
          documents or with the servicer, because each one changes where the money
          goes:
        </P>
        <UL>
          <li>
            <strong>How the extra is applied.</strong> On most fixed-rate
            instalment loans, an extra payment goes to principal and shortens the
            term. But some servicers treat it as an early instalment instead,
            which does nothing until the following month and saves nothing in
            between. Ask which one applies.
          </li>
          <li>
            <strong>Whether it shortens the term or reduces the payment.</strong>{" "}
            Term reduction keeps the payment where it is and saves the most
            interest. A recast lowers the payment and stretches the schedule back
            out, which is a different decision and usually the wrong one if the
            goal is to be debt-free sooner.
          </li>
          <li>
            <strong>Whether one large payment is allowed.</strong> Some loans
            restrict how much can be paid ahead in a given period. That is the
            same clause that carries the penalty, so it is read in one pass.
          </li>
        </UL>
        <P>
          To see the effect on your own numbers before committing, the{" "}
          <A href="/amortization-schedule">amortization schedule</A> shows the
          balance month by month and how extra payments move the end date, and{" "}
          <A href="/biweekly-payments-guide">the biweekly guide</A> covers the
          other common way of paying ahead — one extra payment a year, split
          across the calendar. If the loan has mortgage insurance, extra payments
          remove that too; see{" "}
          <A href="/how-to-remove-pmi">how to remove PMI</A>.
        </P>

        <H2>The short version</H2>
        <P>
          Paying early works by removing future interest, so the same money is
          worth several times more at the start of a loan than near the end —
          $10,000 saves $53,917 in month 1 and $3,598 in month 25. A lump sum is
          more efficient per dollar than a monthly habit, but less flexible and
          harder to reverse. Do the arithmetic on your own loan, check how extra
          payments are applied and whether there is a penalty, and clear any
          higher-rate debt and fund a reserve before sending money to a cheap
          loan.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="how-to-pay-off-a-loan-early" />
      </article>
    </main>
  );
}
