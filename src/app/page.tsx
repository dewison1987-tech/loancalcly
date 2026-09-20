import type { Metadata } from "next";
import Link from "next/link";
import LoanCalculator from "@/components/LoanCalculator";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Loan Calculator — Free Monthly Payment & Amortization Calculator",
  description:
    "Calculate your monthly loan payment, total interest and full amortization schedule. Free, instant and accurate for mortgages, car loans, personal loans and more.",
};

const REVIEWED = "September 20, 2026";

const FAQ = [
  {
    q: "How is the monthly payment calculated?",
    a: "Your monthly payment is calculated using the standard amortization formula, which spreads principal and interest evenly across every payment so each one is identical over the life of a fixed-rate loan.",
  },
  {
    q: "What is APR, and is it the same as the interest rate?",
    a: "Not quite. The interest rate determines the cost of borrowing the principal. APR (Annual Percentage Rate) also folds in most lender fees, so it is usually a little higher and is a better measure of your true annual cost. Entering the APR gives a more realistic estimate.",
  },
  {
    q: "Should I use this calculator for a mortgage?",
    a: "It gives an accurate figure for the principal-and-interest portion of a mortgage. A real monthly mortgage payment usually also includes property taxes, homeowners insurance and possibly mortgage insurance (PMI), so your actual payment will typically be higher.",
  },
  {
    q: "How much of my payment goes to interest?",
    a: "Early in the loan most of each payment covers interest and only a little reduces the balance. The split gradually reverses. Scroll the amortization schedule to see this month by month — it is the clearest illustration of why extra early payments save so much.",
  },
  {
    q: "Does a shorter term really save money?",
    a: "Yes, substantially. A 15-year mortgage typically carries a lower rate than a 30-year and is repaid twice as fast, so total interest falls dramatically — at the cost of a much higher monthly payment. Try both terms in the calculator and compare the Total interest figures.",
  },
  {
    q: "Are the results guaranteed?",
    a: "No — they are estimates. Lenders apply their own fees, rounding rules and day-count conventions, and may include escrow items. Your lender's Loan Estimate and Closing Disclosure are the authoritative documents. See the disclaimer for details.",
  },
];

const EXAMPLES = [
  { label: "30-year mortgage", amount: "$250,000", rate: "6.5%", monthly: "$1,580.17", interest: "$318,861" },
  { label: "15-year mortgage", amount: "$300,000", rate: "6.5%", monthly: "$2,613.32", interest: "$170,398" },
  { label: "20-year refinance", amount: "$200,000", rate: "5.75%", monthly: "$1,404.17", interest: "$137,000" },
  { label: "Car loan, 5 years", amount: "$35,000", rate: "7.5%", monthly: "$701.33", interest: "$7,080" },
  { label: "Personal loan, 3 years", amount: "$15,000", rate: "11%", monthly: "$491.08", interest: "$2,679" },
];

export default function Home() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "LoanCalcly Loan Calculator",
      url: SITE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      description:
        "Free loan payment calculator that returns monthly payment, total interest and a full amortization schedule.",
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
    <main className="mx-auto max-w-5xl px-4 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="pb-8 pt-12 text-center">
        <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Loan Calculator
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Enter your loan amount, interest rate and term to see your monthly
          payment, total interest and full amortization schedule — free and
          instant, with no signup.
        </p>
      </section>

      <LoanCalculator />

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          How to use this loan calculator
        </h2>
        <div className="mt-3 space-y-3 leading-relaxed text-gray-600">
          <p>
            Enter the <strong>loan amount</strong> you plan to borrow, the{" "}
            <strong>annual interest rate (APR)</strong> you have been quoted,
            and the <strong>loan term</strong> in years. The calculator updates
            as you type and shows three things: your estimated monthly payment,
            the total interest you will pay over the life of the loan, and a
            month-by-month amortization breakdown showing how each payment
            splits between interest and principal.
          </p>
          <p>
            The calculation uses the standard fixed-rate amortization formula:{" "}
            <span className="font-mono text-sm">
              M = P × r(1+r)ⁿ / ((1+r)ⁿ − 1)
            </span>
            , where P is the principal, r is the monthly interest rate (annual
            rate ÷ 12) and n is the number of payments. This is the same method
            lenders use for fixed-rate loans, which is why the output lines up
            closely with real Loan Estimates for the principal-and-interest
            portion.
          </p>
          <p>
            The results are an <em>estimate</em>. Your actual payment may differ
            because of lender fees, property taxes, insurance, mortgage
            insurance and other charges. Always confirm final numbers with your
            lender before committing.
          </p>
        </div>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          Worked examples
        </h2>
        <p className="mt-3 leading-relaxed text-gray-600">
          A quick sense of how amount, rate and term interact. Every figure below
          was produced by the calculator on this page and independently
          recomputed before publication.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm tabular-nums">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2.5 font-medium">Loan</th>
                <th className="px-4 py-2.5 font-medium">Amount</th>
                <th className="px-4 py-2.5 font-medium">Rate</th>
                <th className="px-4 py-2.5 text-right font-medium">Monthly</th>
                <th className="px-4 py-2.5 text-right font-medium">
                  Total interest
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {EXAMPLES.map((e) => (
                <tr key={e.label}>
                  <td className="px-4 py-2.5">{e.label}</td>
                  <td className="px-4 py-2.5">{e.amount}</td>
                  <td className="px-4 py-2.5">{e.rate}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-900">
                    {e.monthly}
                  </td>
                  <td className="px-4 py-2.5 text-right">{e.interest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Note how the 15-year mortgage costs far less interest in total despite
          a much larger monthly payment — the trade-off at the centre of most
          borrowing decisions. Our guide to{" "}
          <Link
            href="/how-loan-amortization-works"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            how loan amortization works
          </Link>{" "}
          explains the mechanics in detail.
        </p>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold text-gray-900">
          Frequently asked questions
        </h2>
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
      </section>

      <p className="mt-10 max-w-3xl border-t border-gray-200 pt-5 text-sm text-gray-500">
        Reviewed by{" "}
        <span className="font-medium text-gray-700">LoanCalcly Editorial</span>{" "}
        · Last reviewed {REVIEWED}. Spot an error?{" "}
        <Link
          href="/contact"
          className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
        >
          Tell us
        </Link>{" "}
        and we will correct it.
      </p>
    </main>
  );
}
