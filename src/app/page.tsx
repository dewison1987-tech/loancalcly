import type { Metadata } from "next";
import LoanCalculator from "@/components/LoanCalculator";

export const metadata: Metadata = {
  title: "Loan Calculator — Free Monthly Payment Calculator",
  description:
    "Calculate your monthly loan payment, total interest and full amortization schedule. Free, instant, and accurate for mortgages, car loans, personal loans and more.",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-16">
      <section className="pb-8 pt-12 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Loan Calculator
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Enter your loan amount, interest rate and term to see your monthly
          payment, total interest and full amortization schedule — free and
          instant.
        </p>
      </section>

      <LoanCalculator />

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How to use this loan calculator
        </h2>
        <div className="mt-3 space-y-3 text-gray-600">
          <p>
            Enter the <strong>loan amount</strong> you want to borrow, the{" "}
            <strong>annual interest rate (APR)</strong> your lender quoted, and
            the <strong>loan term</strong> in years. The calculator instantly
            shows your estimated monthly payment, the total interest you will
            pay over the life of the loan, and a month-by-month amortization
            breakdown.
          </p>
          <p>
            The formula used is the standard amortization formula:{" "}
            <span className="font-mono text-sm">
              M = P × r(1+r)ⁿ / ((1+r)ⁿ − 1)
            </span>
            , where P is the principal, r is the monthly interest rate and n is
            the number of payments. This is the same method lenders use for
            fixed-rate loans.
          </p>
          <p>
            This calculator provides an <em>estimate</em> only. Your actual
            payment may differ based on lender fees, insurance, taxes and other
            charges. Always confirm final numbers with your lender.
          </p>
        </div>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          Frequently asked questions
        </h2>
        <div className="mt-4 space-y-4">
          {[
            {
              q: "How is the monthly payment calculated?",
              a: "Your monthly payment is calculated using the standard amortization formula, which spreads the principal and interest evenly across all payments so each one is identical over the loan term.",
            },
            {
              q: "What is APR?",
              a: "APR (Annual Percentage Rate) is the yearly interest rate including most lender fees. Using a realistic APR gives you a more accurate estimate of your true cost.",
            },
            {
              q: "Should I use this calculator for a mortgage?",
              a: "It gives a solid estimate for the principal-and-interest portion of a mortgage. Remember that real mortgage payments also include property taxes, insurance and possibly PMI.",
            },
            {
              q: "How much of my payment goes to interest?",
              a: "Early in the loan, most of each payment goes to interest. Over time the split reverses — the amortization schedule shows this month by month.",
            },
          ].map((f) => (
            <div
              key={f.q}
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <p className="font-medium text-gray-900">{f.q}</p>
              <p className="mt-1.5 text-gray-600">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
