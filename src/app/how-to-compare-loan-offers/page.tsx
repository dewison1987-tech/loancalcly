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
  alternates: { canonical: "/how-to-compare-loan-offers" },
  title: "How to Compare Loan Offers: Rate, APR, Points and Fees",
  description:
    "A practical method for comparing loan offers: the three numbers that matter, why the headline rate misleads, worked break-even maths for discount points, and the questions to ask every lender.",
};

const PUBLISHED = "September 20, 2026";

const RATE_LADDER = [
  ["6.50%", "$1,896.20", "$382,633"],
  ["6.25%", "$1,847.15", "$364,975"],
  ["6.00%", "$1,798.65", "$347,515"],
  ["5.75%", "$1,750.72", "$330,259"],
];

const POINT_MATH = [
  ["0.5 point", "$1,250", "$40.88", "31 months", "2.6 years"],
  ["1 point", "$2,500", "$40.88", "61 months", "5.1 years"],
  ["1.5 points", "$3,750", "$40.88", "92 months", "7.6 years"],
];

const CHECKLIST = [
  "Same loan amount, same term, same rate type (fixed vs adjustable)",
  "The interest rate, unambiguously stated as a percentage",
  "The APR, as disclosed on page 3 of the Loan Estimate",
  "Total discount points and origination fee, in dollars — not as a percentage",
  "Every other lender fee, itemised",
  "Whether the quote includes escrow (taxes and insurance) or is principal & interest only",
  "The lock period, and whether an extension costs money",
  "Prepayment penalty — yes or no, and for how long",
  "Whether there is a lender credit, and what rate you pay for it",
  "The total cash you need at closing",
];

export default function CompareLoanOffersGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="How to Compare Loan Offers: Rate, APR, Points and Fees"
        description="A practical method for comparing loan offers, with worked break-even maths for discount points."
        path="/how-to-compare-loan-offers"
        siteUrl={SITE_URL}
        datePublished="2026-09-20"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          How to compare loan offers
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          Almost every borrower compares loan offers the same way: they look at
          the interest rate. It is the number that gets advertised, the number
          lenders lead with on the phone, and the number that feels like the
          answer. It is also an incomplete answer — and on a long loan, the
          incompleteness is worth tens of thousands of dollars.
        </P>
        <P>
          This guide sets out a comparison method that takes about twenty
          minutes per lender, uses only documents you are legally entitled to,
          and produces one number you can rank offers by.
        </P>

        <H2>Start with why the headline rate is not the comparison</H2>
        <P>
          Two lenders can quote you the same 6.5% and hand you loans that cost
          materially different amounts. The rate governs interest on the balance;
          it says nothing about the fees wrapped around it, and nothing about how
          much of the loan you will actually pay before you sell or refinance.
        </P>
        <P>
          Consider a $300,000 loan over 30 years. Walking the rate down half a
          percentage point at a time produces this:
        </P>
        <DataTable
          head={[
            "Interest rate",
            "Monthly payment",
            "Total interest",
          ]}
          align={["l", "r", "r"]}
          rows={RATE_LADDER}
          caption="Fixed-rate, fully amortising, principal and interest only. Produced by our loan calculator and independently recomputed."
        />
        <P>
          Moving from 6.50% to 6.25% saves <strong>$49.05 a month</strong> and{" "}
          <strong>$17,659 in total interest</strong>. That is a real saving — but
          notice what it does <em>not</em> tell you. It does not tell you whether
          the 6.25% offer charges $4,000 more in fees, and it does not tell you
          whether you will still hold this loan in fifteen years. Both of those
          facts can reverse the ranking entirely.
        </P>

        <H2>Step 1 — Force the offers onto the same footing</H2>
        <P>
          Rate comparisons are meaningless across different loan shapes. Before
          comparing anything, check that every offer covers:
        </P>
        <UL>
          <li>
            <strong>The same amount.</strong> If one lender is quoting a loan
            amount that includes closing costs rolled in, you are comparing a
            larger loan against a smaller one.
          </li>
          <li>
            <strong>The same term.</strong> A 30-year and a 20-year loan are not
            competing offers; the 20-year will always look expensive monthly and
            cheap in total.
          </li>
          <li>
            <strong>The same rate type.</strong> A fixed rate and an adjustable
            rate are different products. An adjustable-rate loan typically opens
            lower than any fixed offer you will receive — that is not a bargain,
            it is a different risk profile.
          </li>
          <li>
            <strong>The same items included.</strong> Ask explicitly whether a
            quote is principal and interest only, or whether it includes escrow
            for taxes and insurance. Lenders switch between the two constantly
            because the escrow-inclusive figure looks alarming and the P&amp;I
            figure looks attractive.
          </li>
        </UL>
        <P>
          Any lender who resists normalising to these four dimensions is either
          disorganised or hoping the ambiguity works in their favour. Either way,
          that is useful information.
        </P>

        <H2>Step 2 — Rank on three numbers, not one</H2>
        <P>
          Once the offers are comparable, three figures settle most decisions:
        </P>
        <UL>
          <li>
            <strong>Monthly payment</strong> — what it does to your budget. This
            is the constraint that most borrowers cannot move.
          </li>
          <li>
            <strong>Total interest over the full term</strong> — what the loan
            costs if you keep it to the end. Our{" "}
            <A href="/">loan calculator</A> returns this alongside the payment,
            and{" "}
            <A href="/how-loan-amortization-works">
              our amortization guide
            </A>{" "}
            explains how the figure accumulates.
          </li>
          <li>
            <strong>APR</strong> — the interest rate plus most lender fees,
            expressed as a single yearly rate. This is the number that lets you
            rank loans of equal term when fees differ, and it is why{" "}
            <A href="/apr-vs-interest-rate">APR and the interest rate diverge</A>
            . A fuller treatment is in that guide; for now, the working rule is
            that a lower APR is better when you intend to keep the loan long
            enough for the fees to be absorbed.
          </li>
        </UL>
        <P>
          A lender with the lowest rate but the highest APR is telling you
          something specific: the rate is subsidised by fees they have moved
          elsewhere. That can still be the right loan — but only if you know
          which one you are buying.
        </P>

        <H2>Step 3 — Do the break-even maths on any discount points</H2>
        <P>
          Discount points are an up-front fee paid to lower your rate
          permanently. One point usually costs 1% of the loan amount and buys
          roughly a quarter of a percentage point off the rate, though the exact
          exchange is set by the market and changes weekly.
        </P>
        <P>
          The question is never &ldquo;is a lower rate better&rdquo; — it
          obviously is. The question is whether you will hold the loan long
          enough to earn the fee back:
        </P>
        <Formula>Break-even months = points paid ÷ monthly payment saving</Formula>
        <P>
          Here is that calculation for a $250,000 30-year loan, where paying
          points lowers the rate from 6.50% to 6.25% — a saving of{" "}
          <strong>$40.88 per month</strong> ($1,580.17 falls to $1,539.29):
        </P>
        <DataTable
          head={["Points paid", "Cost", "Monthly saving", "Break-even", "In years"]}
          align={["l", "r", "r", "r", "r"]}
          rows={POINT_MATH}
        />
        <P>
          Read the middle row carefully. Paying a full point on this loan takes{" "}
          <strong>5.1 years</strong> just to get your money back. If you sell,
          refinance or move before then, you have handed the lender $2,500 and
          received nothing for it — the rate reduction only pays while the loan
          exists.
        </P>
        <Callout>
          <strong>The same rate cut behaves very differently on different loan
          sizes.</strong> On a $300,000 loan, a full point costs $3,000 and lowers
          the rate from 6.50% to 6.00%, which saves $97.55 a month — a break-even
          of about <strong>31 months</strong>, roughly half the time. The
          percentage cut is identical; the arithmetic is not, because the fee
          scales linearly with the loan while the saving depends on the size of
          the rate step. Never assume a rule of thumb transfers between loans.
        </Callout>

        <H2>Step 4 — Answer the only question that settles it</H2>
        <P>
          Every comparison above collapses into one honest question:{" "}
          <strong>how long will you actually keep this loan?</strong>
        </P>
        <DataTable
          head={["If you expect to keep the loan…", "Compare on"]}
          align={["l", "l"]}
          rows={[
            ["Longer than the break-even, roughly 7+ years", "APR, then total interest"],
            ["3–7 years", "APR, and only pay points if the break-even is well inside your horizon"],
            ["Under 3 years", "Rate and cash to close — points will not pay back"],
            ["Until a planned move or upgrade", "Ask about portability and prepayment penalties"],
          ]}
        />
        <P>
          Most borrowers know this answer better than they think they do. If you
          bought a starter home and expect to move when your family grows, you
          are not a 30-year-and-hold borrower, and paying points is an expensive
          way to discover that.
        </P>

        <H2>What lenders will and will not tell you</H2>
        <P>
          In the United States, once you submit a full application for a
          mortgage, the lender must send you a <strong>Loan Estimate</strong>{" "}
          within three business days. Page 3 has a section headed
          &ldquo;Comparisons&rdquo; that shows the APR, the total interest
          percentage, and the total you would pay in the first five years — which
          is precisely the comparison this guide describes, done for you.
        </P>
        <H3>Three questions worth asking every lender</H3>
        <UL>
          <li>
            <strong>&ldquo;What is the APR on this quote?&rdquo;</strong> If the
            answer comes back as the interest rate, you have learned that this
            lender either does not know the distinction or prefers you not to.
          </li>
          <li>
            <strong>&ldquo;What is the total cash I need at closing?&rdquo;</strong>{" "}
            This surfaces fees that were quietly absent from the headline rate.
          </li>
          <li>
            <strong>&ldquo;Is there any prepayment penalty?&rdquo;</strong> A
            penalty is a direct tax on the option to refinance later, which is
            exactly the option you are relying on if you take a long term.
          </li>
        </UL>

        <H2>A comparison checklist</H2>
        <P>
          Collect these ten items from each lender and lay them out side by side.
          Offers that cannot supply them are not offers yet.
        </P>
        <ol className="ml-5 mt-4 list-decimal space-y-2 leading-relaxed text-gray-600">
          {CHECKLIST.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>

        <H2>Where borrowers most often go wrong</H2>
        <UL>
          <li>
            <strong>Comparing monthly payment across different terms.</strong> A
            30-year loan will beat a 15-year loan on payment every single time,
            by construction. That is not a better deal, it is a longer one.
          </li>
          <li>
            <strong>Ignoring the cash at closing.</strong> A loan that saves
            $40 a month but costs $6,000 up front is a fifteen-year break-even.
            Count the cash, then decide.
          </li>
          <li>
            <strong>Paying points on a loan you will not keep.</strong> The
            single most common expensive mistake in this category.
          </li>
          <li>
            <strong>Letting a lender set the term.</strong> Sales pressure
            tends toward the longest term available because it produces the
            lowest payment and the highest commission. Choose the term
            deliberately, then compare lenders within it — as{" "}
            <A href="/how-loan-amortization-works">
              the amortization maths
            </A>{" "}
            makes plain, term choice moves total interest far more than rate
            shopping within a term does.
          </li>
        </UL>
        <P>
          Run your own numbers before the conversation. Enter each offer into the{" "}
          <A href="/">loan calculator</A> and record the monthly payment and
          total interest side by side; the discipline of typing the figures in
          yourself catches more bad offers than any advice column.
        </P>

        <ArticleFooter currentSlug="how-to-compare-loan-offers" />
      </article>
    </main>
  );
}
