import type { Metadata } from "next";
import LoanCalculator from "@/components/LoanCalculator";
import { SITE_URL } from "@/lib/site";
import {
  A,
  Byline,
  CalculatorFooter,
  Callout,
  DataTable,
  H2,
  H3,
  JsonLd,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = {
  alternates: { canonical: "/student-loan-calculator" },
  title: "Student Loan Calculator — Payment, Interest and Payoff Date",
  description:
    "Calculate the monthly payment and total interest on a student loan, then see what a small extra payment each month does to the payoff date and the interest bill.",
};

const REVIEWED = "September 20, 2026";

const FAQ = [
  {
    q: "What interest rate should I enter?",
    a: "Whatever is on your loan documents. Federal student loan rates are set each year by statute and then fixed for the life of that loan, so the rate you were given when you borrowed is the rate you keep. Private loans are credit-based and vary by lender. The 6.53% used in the examples here is illustrative, not a current quote.",
  },
  {
    q: "Why does paying a little extra help so much?",
    a: "Because student loans amortise over a relatively short term with a relatively large balance, so a large share of every early payment is interest. Anything above the scheduled payment goes entirely to principal, and every dollar of principal removed saves interest for every remaining month of the loan.",
  },
  {
    q: "Should I pay extra on my student loans or invest the money?",
    a: "There is no universal answer, and anyone who gives you one is guessing about your circumstances. Paying extra earns a guaranteed return equal to your interest rate. Investing has a higher expected return over long periods but no guarantee and no liquidity. Two things worth weighing: an emergency fund matters more than either, and if your loan is on an income-driven plan heading for forgiveness, extra payments can reduce the amount forgiven.",
  },
  {
    q: "What happens if I consolidate or refinance?",
    a: "Consolidating federal loans through the government combines them into one loan at a weighted average rate, which is mostly an administrative simplification. Refinancing with a private lender can lower the rate, but it converts federal loans into private ones — and with them you give up income-driven repayment, forgiveness programmes, and federal deferment and forbearance options. That trade deserves careful thought before it is made.",
  },
  {
    q: "What is interest capitalisation?",
    a: "It is when unpaid interest is added to the principal balance, so that future interest is charged on the larger amount. It commonly happens at the end of the grace period and after deferment or forbearance. It is the reason a loan balance can be higher after graduation than the amount originally borrowed.",
  },
  {
    q: "Does this calculator cover income-driven repayment?",
    a: "No. Income-driven plans set the payment as a percentage of discretionary income rather than from the balance, so they cannot be modelled from loan amount, rate and term alone. This calculator covers the standard fixed instalment schedule, which is what most private loans use and what federal loans default to.",
  },
];

// 额外还款对一笔 $30,000 @6.53%/10 年的影响
const EXTRA = [
  ["$0", "$341.10", "120 months", "$10,932", "—"],
  ["$50", "$391.10", "100 months", "$8,936", "$1,996"],
  ["$100", "$441.10", "86 months", "$7,567", "$3,365"],
];

export default function StudentLoanCalculatorPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "LoanCalcly Student Loan Calculator",
      url: `${SITE_URL}/student-loan-calculator`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      description:
        "Free student loan calculator showing monthly payment, total interest and the payoff effect of extra monthly payments.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-12">
      <JsonLd data={schema} />

      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Student Loan Calculator
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Your monthly payment, the total interest over the term, and the one
          lever that changes both without needing a new lender: what happens to
          the payoff date when you pay a little extra each month.
        </p>
      </section>

      <div className="mt-10">
        <LoanCalculator
          amountLabel="Amount borrowed"
          amountHint="The original balance, or the balance on your statement today."
          defaultPrincipal={30000}
          defaultRate={6.53}
          defaultYears={10}
          termOptions={[5, 7, 10, 15, 20, 25]}
          showExtraPayment
          extraLabel="Extra monthly payment"
        />
      </div>

      <article className="mx-auto mt-14 max-w-3xl">
        <Byline published={REVIEWED} />

        <H2>The standard schedule, on a $30,000 loan</H2>
        <P>
          A $30,000 balance at 6.53% over the standard 10-year term costs{" "}
          <strong>$341.10 a month</strong> and <strong>$10,932</strong> in
          interest — more than a third of the original balance again. Because the
          term is short and the balance is large, the early years are
          interest-heavy in the same way a mortgage is, just compressed.
        </P>
        <P>
          Here is what happens when you add to the payment. The extra money does
          not reduce next month&apos;s bill; it removes months from the end of
          the loan:
        </P>
        <DataTable
          head={[
            "Extra per month",
            "Payment becomes",
            "Paid off in",
            "Total interest",
            "Interest saved",
          ]}
          align={["r", "r", "l", "r", "r"]}
          rows={EXTRA}
          caption="$30,000 at 6.53% over 10 years. Assumes a simple-interest instalment loan with no prepayment penalty. Figures rounded to the nearest dollar."
        />
        <Callout>
          <strong>$100 a month — about $3.30 a day — removes $3,365 of interest
          and 34 months from the loan.</strong> The extra payments total $8,600,
          and the time saved is nearly three years. The reason the return is so
          high is that every dollar of principal paid early stops accruing
          interest for every remaining month: a dollar paid in month 5 saves 115
          months of interest, while the same dollar paid in month 115 saves one.
          Our <A href="/how-loan-amortization-works">amortization guide</A> walks
          through the mechanism, and the{" "}
          <A href="/amortization-schedule">amortization schedule calculator</A>{" "}
          shows it a year at a time.
        </Callout>

        <H2>What changes when the balance is bigger</H2>
        <P>
          Student loan balances are frequently larger than $30,000. Scaling the
          same term and rate to a $50,000 balance gives a payment of{" "}
          <strong>$568.50</strong> and <strong>$18,220</strong> of interest —
          the interest bill scales almost exactly with the balance, because at
          the same rate and term the whole schedule scales. That linearity is
          useful: the numbers above can be multiplied to estimate a loan of any
          size at 6.53% over ten years.
        </P>
        <P>
          What does not scale linearly is the effect of an extra payment, because
          a fixed extra amount does proportionally less work on a bigger balance.
          On a $50,000 loan, $100 a month extra buys noticeably less time saved
          than it does on a $30,000 one.
        </P>

        <H2>Federal and private loans are not the same product</H2>
        <H3>Federal loans</H3>
        <UL>
          <li>
            <strong>Rates are set by statute</strong> each year and fixed for the
            life of the loan. They do not depend on your credit score.
          </li>
          <li>
            <strong>Income-driven repayment</strong> plans set the payment from
            your income rather than the balance, and generally forgive what
            remains after a set number of years. The available plans and their
            terms change, so verify against the official servicer rather than any
            summary.
          </li>
          <li>
            <strong>Forgiveness programmes exist</strong> for defined public
            service careers, generally after a set number of qualifying payments.
          </li>
          <li>
            <strong>Deferment and forbearance</strong> can pause payments in
            defined circumstances — but see the capitalisation warning below.
          </li>
        </UL>
        <H3>Private loans</H3>
        <UL>
          <li>
            <strong>Rates depend on credit</strong> — yours or a co-signer&apos;s.
            This is where a co-signer makes the largest difference.
          </li>
          <li>
            <strong>No income-driven plans and no forgiveness</strong> in the
            federal sense. The contract terms are what you get.
          </li>
          <li>
            <strong>Terms are often shorter</strong>, which raises the payment
            and lowers the total interest.
          </li>
        </UL>

        <H2>The two traps worth knowing before you choose a strategy</H2>
        <H3>Capitalisation</H3>
        <P>
          If you are not paying interest while in school, during a grace period,
          or while payments are paused, that interest does not disappear. It is
          added to the principal at defined points — commonly when the grace
          period ends — and from then on it accrues interest itself. The effect
          is that a balance can be larger after graduation than the amount
          originally borrowed, and the standard repayment schedule starts from
          the larger figure. If you can pay interest during school, even
          partially, it is one of the highest-return things you can do.
        </P>
        <H3>The forgiveness versus prepayment conflict</H3>
        <P>
          If you are on an income-driven plan and expect a remaining balance to
          be forgiven, extra payments reduce the amount that would have been
          forgiven — which means the return on them can be zero or negative. The
          arithmetic that makes $100 a month look excellent on a standard
          schedule reverses entirely on a forgiveness track. Decide which track
          you are on before deciding whether to prepay.
        </P>
        <P>
          Refinancing deserves the same care. A lower rate from a private lender
          can be a genuine saving on a standard schedule, but it permanently
          retires the federal protections listed above. Run the{" "}
          <A href="/refinance-break-even-point">
            refinance break-even arithmetic
          </A>{" "}
          first, then ask what the protections you are giving up are worth.
        </P>

        <H2>Frequently asked questions</H2>
        <div className="mt-4 space-y-4">
          {FAQ.map((f) => (
            <div
              key={f.q}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <p className="font-medium text-gray-900">{f.q}</p>
              <p className="mt-1.5 leading-relaxed text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>

        <CalculatorFooter currentSlug="student-loan-calculator" />
      </article>
    </main>
  );
}
