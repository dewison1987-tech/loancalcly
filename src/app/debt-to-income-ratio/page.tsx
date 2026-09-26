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
  path: "/debt-to-income-ratio",
  title: "Debt-to-Income Ratio: How Lenders Read It",
  description:
    "An $8,000 income carrying $2,156.58 of housing and $675 of other debt sits at 35.4% back-end DTI. How the ratio is built, what counts towards it, and what the ceiling buys.",
  type: "article",
});

const PUBLISHED = "September 26, 2026";

/**
 * 全部数字由 src/lib/loan.ts 生成（calculateLoan / affordableHomePrice），
 * 并经 Python / Node 两套独立实现逐位复算。
 * 场景：$300,000 房价、10% 首付、6.50%、30 年、房产税 1.2%/年、保险 $1,800/年。
 */
const WORKED = [
  ["Principal & interest", "$1,706.58", "$270,000 at 6.50% over 30 years"],
  ["Property tax", "$300.00", "1.2% a year on a $300,000 price"],
  ["Home insurance", "$150.00", "$1,800 a year"],
  [
    <strong key="h" className="text-gray-900">
      Housing total
    </strong>,
    <strong key="hv" className="text-gray-900">
      $2,156.58
    </strong>,
    "26.96% of an $8,000 monthly income — the front-end ratio",
  ],
  [
    "Other debt payments",
    "$675.00",
    "$420 car loan, $180 student loan, $75 card minimum",
  ],
  [
    <strong key="t" className="text-gray-900">
      Total obligations
    </strong>,
    <strong key="tv" className="text-gray-900">
      $2,831.58
    </strong>,
    "35.39% of the same income — the back-end ratio",
  ],
];

const COUNTS = [
  [
    "Counted",
    "Mortgage or rent, car loans, student loans, personal loans, instalment plans, and the minimum payment on each revolving card.",
  ],
  [
    "Usually not counted",
    "Utilities, phone and internet, insurance premiums, food, fuel, childcare, taxes and anything already repaid.",
  ],
  [
    "Judgement calls",
    "Support payments, money you pay on someone else&apos;s loan, and debts in a grace period are treated differently by different lenders and programmes. Expect to document them and expect the answer to depend on the file.",
  ],
];

const CEILINGS = [
  ["28% / 36%", "$291,718", "$2,205", "27.6%", "36.0%"],
  ["36% / 43%", "$364,094", "$2,765", "34.6%", "43.0%"],
];

const BY_INCOME = [
  ["$60,000", "$5,000", "$197,370"],
  ["$80,000", "$6,667", "$289,994"],
  ["$96,000", "$8,000", "$364,094"],
  ["$120,000", "$10,000", "$472,012"],
];

const FAQ = [
  {
    q: "What is a good debt-to-income ratio?",
    a: "Lower is easier, and there is no threshold below which the ratio stops mattering — it is one input among credit history, reserves and the property itself. What the number does do is set a ceiling on how much you can borrow: in the worked example here, moving from a 28/36 ceiling to a 36/43 ceiling raises the supported house price from $291,718 to $364,094, a gap of $72,376.",
  },
  {
    q: "Is front-end or back-end DTI more important?",
    a: "Back-end, in almost every case, because it is the number that captures your whole debt load rather than just the housing payment. Front-end exists as a secondary guard — it stops a borrower with no other debts from putting an unusually large share of income into a house. In the worked example the back-end ratio is the binding one at both ceilings, because $675 of other debt is large relative to the income.",
  },
  {
    q: "Does paying off a credit card help my ratio?",
    a: "Yes, and often more than the balance suggests, because what counts is the minimum payment rather than the outstanding amount. Closing the account can work against you if it reduces your available credit, so the usual approach is to clear the balance and leave the line open. Paying down an instalment loan helps only when it reduces or retires the monthly obligation.",
  },
  {
    q: "Can I get a mortgage with a DTI above 43%?",
    a: "Sometimes — the ceiling is not a single national wall. It varies with the loan programme, the lender, the size of your reserves and the rest of your file, and some programmes allow higher ratios with compensating factors. What is consistent is that a higher ratio narrows your options and usually costs more. Our guide to how much house you can afford covers what the approved figure leaves out.",
  },
  {
    q: "Should I use the ratio to decide what I can afford?",
    a: "No. The ratio is a lender&apos;s test of default probability, not a household budget. It says nothing about childcare, maintenance, commuting costs or the reserve you would need after closing, and it is calculated on gross income rather than take-home pay. Treat the ceiling as the upper bound of what a lender will consider, then build your own budget underneath it — that is the gap the affordability calculator is designed to show.",
  },
];

export default function DebtToIncomeRatioGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="Debt-to-Income Ratio: How Lenders Read It"
        description="How front-end and back-end debt-to-income ratios are calculated, what counts towards them, where the commonly quoted ceilings come from, and what each ceiling buys in house price."
        path="/debt-to-income-ratio"
        siteUrl={SITE_URL}
        datePublished="2026-09-26"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Debt-to-income ratio
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          The debt-to-income ratio is how a lender turns your finances into a
          single number. It is not a budget and it is not a judgement about
          whether you feel comfortable — it is a probability estimate, and it
          works by asking what share of your gross monthly income is already
          promised to somebody else before the new loan is added.
        </P>
        <P>
          Understanding how it is built is worth an hour, because the ratio
          decides the loan size rather than the other way round. It is also the
          part of mortgage underwriting where a small change in your situation
          produces a large change in what you are allowed to borrow.
        </P>

        <H2>Two ratios, not one</H2>
        <P>
          There are two versions and they are usually quoted as a pair, in the
          form 28/36.
        </P>
        <UL>
          <li>
            <strong>Front-end</strong> is housing cost divided by gross monthly
            income. Housing cost means principal, interest, property tax,
            insurance and any HOA dues, plus mortgage insurance where it applies.
          </li>
          <li>
            <strong>Back-end</strong> is the same housing cost plus every other
            monthly debt payment, divided by the same income. It is the stricter
            of the two in practice, because it sees the whole picture.
          </li>
        </UL>
        <P>
          Both use <strong>gross</strong> income — before tax and before any
          deduction. That is one of the reasons the ratio flatters a household
          budget: a 36% back-end ratio on gross pay is a considerably larger share
          of what actually lands in your account.
        </P>

        <H2>A worked example</H2>
        <P>
          Take an $8,000 monthly income, a $300,000 house with 10% down at 6.50%
          over 30 years, property tax at 1.2% a year and insurance at $1,800 a
          year. Add a $420 car payment, $180 of student loan and a $75 card
          minimum:
        </P>
        <DataTable
          head={["Line", "Monthly", "Where it comes from"]}
          align={["l", "r", "l"]}
          rows={WORKED}
          caption="Produced by our calculators and independently recomputed. Property tax and insurance rates are illustrative — substitute your own county and quote."
        />
        <P>
          So this household sits at <strong>26.96% front-end</strong> and{" "}
          <strong>35.39% back-end</strong>. Note which half moved: $675 of other
          debt adds{" "}
          <strong>8.4 percentage points</strong> to the ratio without changing the
          house, the loan or the rate by a cent. That is the whole reason the
          back-end number is the one that gets discussed.
        </P>
        <Callout>
          <strong>A detail that catches people out:</strong> what counts on a
          revolving card is the <strong>minimum payment</strong>, not the
          balance. A $6,000 balance at a 2% minimum contributes $120 to the
          ratio; halve the balance and it contributes $60; pay it off and it
          contributes nothing. So the ratio improves gradually on the way down
          and abruptly at zero — which is why clearing one card outright moves
          the number far more than the same cash spread across several months of
          minimum payments, and why a split across three cards is not
          automatically an improvement over one.
        </Callout>

        <H2>What counts towards the ratio</H2>
        <P>
          The categories below are the shape of it rather than a rulebook —
          lenders and loan programmes differ in the details, and the treatment of
          anything ambiguous is a matter for the individual file:
        </P>
        <DataTable
          head={["Category", "Treatment"]}
          align={["l", "l"]}
          rows={COUNTS}
          caption="General orientation, not a substitute for the specific programme guidance or your lender&apos;s own documentation."
        />

        <H2>Where the ceilings come from</H2>
        <P>
          The 43% figure most people have heard sits in the context of US
          qualified mortgage rules, where a back-end ratio at or below that level
          has been one of the routes by which a loan can qualify. The 36% figure
          is the more conservative practice that many lenders and programmes still
          apply, and 28% is the matching guard on the housing share alone.
        </P>
        <P>
          None of these is a fixed wall. Programme rules, lender overlays,
          reserves, credit history and the size of the loan all move the number,
          and some programmes permit higher ratios when other parts of the file
          are strong. The CFPB publishes the rules themselves and is a better
          source than any summary for what currently applies. What is stable is
          the shape: a ceiling exists, it binds on the back end, and it moves with
          your income and your other debts.
        </P>

        <H2>What the ceiling actually buys</H2>
        <P>
          The useful way to read a ratio is in money rather than percentages.
          Applying two common ceiling pairs to the household above — $96,000 a
          year, $675 of other debt, $30,000 down:
        </P>
        <DataTable
          head={[
            "Ceiling applied",
            "House price supported",
            "Monthly housing",
            "Front-end",
            "Back-end",
          ]}
          align={["l", "r", "r", "r", "r"]}
          rows={CEILINGS}
          caption="6.50% over 30 years, 1.2% property tax, $1,800 insurance a year, PMI modelled at 0.50%. At 10% down both rows still include mortgage insurance. Produced by our affordability calculator and independently recomputed."
        />
        <P>
          The difference between the two ceilings is{" "}
          <strong>$72,376 of house</strong> from the same income and the same
          savings. Neither figure is an instruction — they are the boundaries of
          what a lender will consider, and the second one costs more every month
          because it is a bigger loan.
        </P>
        <P>
          Because the ratio is a share of income, the ceiling scales with what
          you earn. Holding the debts, the down payment and the rate constant,
          the same 43% back-end ceiling supports:
        </P>
        <DataTable
          head={["Annual income", "Monthly income", "House price at a 43% back-end ceiling"]}
          align={["r", "r", "r"]}
          rows={BY_INCOME}
          caption="Same assumptions as above. This is the ceiling, not a recommendation — see the note below on why the two are different numbers."
        />
        <P>
          To run this on your own income and debts, the{" "}
          <A href="/home-affordability-calculator">affordability calculator</A>{" "}
          does the same arithmetic in reverse — from income to price rather than
          from price to payment.
        </P>

        <H2>Three ways to lower the ratio, and what each one costs</H2>
        <P>
          Almost everything that improves the ratio trades something else away.
          Worth knowing which trade you are making:
        </P>
        <UL>
          <li>
            <strong>Retire a debt.</strong> Clearing a $420 car payment removes
            $420 from the numerator, which at a 43% ceiling raises the monthly
            housing budget from $2,765 to $3,185 and supports a larger loan. The
            cost is the cash, and if the debt you clear was cheaper than the
            mortgage you are about to take, you have traded cheap money for
            expensive money in order to qualify for more of it.
          </li>
          <li>
            <strong>Increase documented income.</strong> A raise helps
            immediately at the next underwriting, but overtime, bonuses and
            second jobs are treated differently from base salary, and the
            treatment varies by programme. The cost here is that income that is
            not stable does not fix a stability problem — it only changes which
            month the problem shows up in.
          </li>
          <li>
            <strong>Put more down.</strong> A larger down payment lowers the loan
            and therefore the payment, so it lowers both ratios. It also removes
            mortgage insurance once you cross 20%, which lowers the housing cost
            again. The cost is liquidity: the reserve you no longer have is what
            protects you if income stops, and a thin reserve is exactly the
            situation a high ratio was warning about.
          </li>
        </UL>
        <P>
          Two things do not work, though they are widely believed to. Paying down
          a card without closing it helps only through the minimum payment, so the
          effect is often smaller than expected. And a co-signer adds their
          obligations to yours as well as their income, which can move the ratio
          in either direction.
        </P>

        <H2>The ratio is not a budget</H2>
        <P>
          Everything above describes a lender&apos;s test. It is deliberately
          generous in two directions: it uses gross income, and it ignores
          everything a household spends that is not a debt payment. Childcare,
          maintenance, commuting, medical costs and saving do not appear anywhere
          in the calculation, and they are the reason two households with
          identical ratios can have very different experiences of the same
          payment.
        </P>
        <P>
          The honest use of the number is as a ceiling rather than a target.{" "}
          <A href="/how-much-house-can-i-afford">How much house can I afford</A>{" "}
          works through what the approved figure leaves out; this page covers how
          the figure is produced.
        </P>

        <H2>The short version</H2>
        <P>
          The ratio is housing cost over gross income (front-end) and all debt
          payments over gross income (back-end), and the back end is the one that
          binds. In the example here, $675 of debt adds 8.4 points to a household
          that would otherwise sit at 27% front-end. The commonly quoted ceilings
          are programme rules rather than physics, and the gap between a 28/36 and
          a 36/43 ceiling is $72,376 of house on a $96,000 income. Lowering the
          ratio always costs something — cash, liquidity or stability — and the
          number to keep in view is the one your own budget supports, not the one
          a lender will approve.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="debt-to-income-ratio" />
      </article>
    </main>
  );
}
