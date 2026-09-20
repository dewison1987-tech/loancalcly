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
  alternates: { canonical: "/personal-loan-calculator" },
  title: "Personal Loan Calculator — Payment, Interest and Real Cost",
  description:
    "Work out the monthly payment and total interest on an unsecured personal loan, and see what an origination fee does to the real annual cost before you sign.",
};

const REVIEWED = "September 20, 2026";

const FAQ = [
  {
    q: "What interest rate should I expect on a personal loan?",
    a: "It depends almost entirely on your credit profile and the lender. Well-qualified borrowers are commonly quoted single-digit to low-double-digit rates; weaker credit or a longer term pushes the rate up sharply. Personal loans are unsecured, so there is no collateral for the lender to recover if you stop paying — that risk is priced into the rate you are offered.",
  },
  {
    q: "What is an origination fee and why does it matter?",
    a: "It is a fee charged for making the loan, typically 1% to 8% of the amount, deducted from the money you receive. Because you repay the full principal plus interest while only receiving the net amount, the true annual cost is higher than the headline rate. The calculator below lets you see the payment; the guide below shows what the fee does to the effective rate.",
  },
  {
    q: "Is a personal loan better than a credit card?",
    a: "Usually, if you are carrying a balance. Credit cards commonly charge several times the APR of an unsecured personal loan, and a fixed-rate instalment loan has a defined end date. What personal loans do not have is the grace period — a credit card costs nothing if you clear the balance each month, while a loan charges interest from day one.",
  },
  {
    q: "Does paying a personal loan off early save money?",
    a: "On most personal loans, yes — they are usually simple-interest instalment loans with no prepayment penalty, so anything you pay above the scheduled instalment reduces the balance and shortens the term. Check the agreement for a prepayment penalty first, since a minority of lenders do charge one.",
  },
  {
    q: "Will applying affect my credit score?",
    a: "A single application produces a hard enquiry, which typically has a small temporary effect. Rate-shopping within a short window is usually treated as one enquiry by the major scoring models, so it is worth gathering quotes close together rather than spreading them over months.",
  },
];

// 同样三个额度/利率/期限组合，全部按等额本息、无手续费计算。
const SCENARIOS = [
  ["$15,000", "11.0%", "3 years", "$491.08", "$2,679"],
  ["$20,000", "9.5%", "5 years", "$420.04", "$5,202"],
  ["$25,000", "12.5%", "5 years", "$562.45", "$8,747"],
];

export default function PersonalLoanCalculatorPage() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "LoanCalcly Personal Loan Calculator",
      url: `${SITE_URL}/personal-loan-calculator`,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      description:
        "Free personal loan calculator showing monthly payment, total interest and the effect of extra monthly payments on an unsecured instalment loan.",
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
          Personal Loan Calculator
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          Unsecured borrowing at the rates lenders really quote — and the
          two-piece arithmetic that decides whether the money is worth taking:
          the payment, and the fee that never shows up in the headline rate.
        </p>
      </section>

      <div className="mt-10">
        <LoanCalculator
          amountLabel="Loan amount"
          defaultPrincipal={15000}
          defaultRate={11}
          defaultYears={3}
          termOptions={[1, 2, 3, 4, 5, 6, 7]}
          maxRate={40}
          showExtraPayment
        />
      </div>

      <article className="mx-auto mt-14 max-w-3xl">
        <Byline published={REVIEWED} />

        <H2>Three worked examples</H2>
        <P>
          Personal loan pricing varies enormously between borrowers, so no single
          rate is &ldquo;typical&rdquo;. What does transfer is the shape of the
          maths: at these amounts and terms, here is what a lender would show you.
        </P>
        <DataTable
          head={["Amount", "Rate", "Term", "Monthly", "Total interest"]}
          align={["r", "r", "l", "r", "r"]}
          rows={SCENARIOS}
          caption="Fixed-rate, fully amortising, no fees. Figures rounded to the nearest dollar for totals."
        />
        <P>
          Note the third row. Borrowing $10,000 more than the first example costs
          only <strong>$71.37 more a month</strong> — because the term is two
          years longer and the rate is spread over a bigger balance. That is the
          seduction of the longer term, and it is the same pattern that makes 72
          and 84-month car loans feel affordable.
        </P>

        <H2>The fee that is not in the rate</H2>
        <P>
          An origination fee is deducted before the money reaches you, while you
          repay the full principal plus interest. That means the true annual cost
          is higher than the rate the lender quotes — and by more than most
          borrowers expect.
        </P>
        <P>
          Take the $15,000 loan at 11% over three years. The payment is $491.08 a
          month. Now apply a fee:
        </P>
        <DataTable
          head={["Origination fee", "Deducted", "Cash received", "Effective annual cost"]}
          align={["l", "r", "r", "r"]}
          rows={[
            ["None", "$0", "$15,000", "11.00%"],
            ["3%", "$450", "$14,550", "13.12%"],
            ["5%", "$750", "$14,250", "14.58%"],
          ]}
          caption="Effective annual cost is the internal rate of return on the cash actually received against the payments actually made — the same method lenders use to compute APR."
        />
        <Callout>
          <strong>A 5% fee adds 3.58 percentage points to the real cost</strong>{" "}
          — a third more than the 11% on the advert. Two lenders quoting the same
          rate can therefore be more than three points apart in what they
          actually charge, which is precisely the situation{" "}
          <A href="/apr-vs-interest-rate">the APR</A> exists to expose. Never
          compare personal loan offers on the rate alone; ask what percentage is
          deducted and compare the APR, which is required to include it.
        </Callout>

        <H2>When a personal loan is the sensible tool</H2>
        <UL>
          <li>
            <strong>Consolidating higher-rate debt.</strong> Moving balances from
            cards charging several times the rate to a fixed instalment loan at a
            lower rate is the classic use, and the saving is real. The condition
            is that the cards stay cleared — otherwise the balances rebuild on
            top of the loan, which is the most common way this goes wrong.
          </li>
          <li>
            <strong>A defined, one-off expense.</strong> A medical bill, a
            funeral, a necessary repair, a move. Costs with a known amount and a
            known date suit an instalment loan, because the repayment schedule
            matches the shape of the problem.
          </li>
          <li>
            <strong>Buying time without a revolving balance.</strong> A fixed
            term with a fixed payment forces the debt to end. A credit card
            balance does not.
          </li>
        </UL>

        <H3>When it is not</H3>
        <P>
          Unsecured lenders rarely ask what the money is for, which is exactly
          why they are a poor fit for anything ongoing. Funding a business
          shortfall, covering a gap between income and spending, or taking on a
          loan with a monthly payment that competes with rent is a sign that the
          problem is the cash flow, not the financing. A loan converts an
          existing problem into a fixed monthly obligation, and a fixed monthly
          obligation is harder to renegotiate than a bill you can defer.
        </P>
        <P>
          It is also worth checking whether a secured option exists for less. If
          you own a home, a{" "}
          <A href="/mortgage-calculator">mortgage-based calculation</A> will show
          why a home equity product can carry a much lower rate — along with the
          important caveat that it puts the house up as collateral.
        </P>

        <H2>Reading the offer documents</H2>
        <P>
          In the United States, a personal loan is covered by the Truth in
          Lending Act, so the lender must disclose the APR, the finance charge,
          the amount financed and the total of payments on a standard form.
          Three numbers on that form do most of the work:
        </P>
        <UL>
          <li>
            <strong>The APR</strong> — includes the origination fee, so it is the
            number to rank offers by.
          </li>
          <li>
            <strong>The amount financed</strong> — what actually lands in your
            account, after the fee.
          </li>
          <li>
            <strong>The total of payments</strong> — the whole cost, in one
            figure. If a lender is reluctant to state it, that is the answer.
          </li>
        </UL>
        <P>
          And check the prepayment terms. Most personal loans are simple-interest
          with no penalty, which means{" "}
          <A href="/amortization-schedule">an extra payment</A> is one of the
          cheapest interest savings available — the calculator above will show
          you exactly how much.
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

        <CalculatorFooter currentSlug="personal-loan-calculator" />
      </article>
    </main>
  );
}
