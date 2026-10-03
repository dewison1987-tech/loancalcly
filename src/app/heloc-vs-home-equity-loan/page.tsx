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
  path: "/heloc-vs-home-equity-loan",
  title: "HELOC vs Home Equity Loan",
  description:
    "The same $60,000 at the same 8.00% costs $27,356 or $108,447 in interest. Why the draw period matters far more than which of the two products you pick.",
  type: "article",
});

const PUBLISHED = "October 3, 2026";

/**
 * 全部数字由 src/lib/loan.ts 生成（runAmortization），
 * 并经 Python / Node 两套独立实现 + 站点内核三方逐位复算。
 */
const THREE_WAYS = [
  [
    <strong key="a" className="text-gray-900">
      HELOC, interest-only, 10-year draw then 20-year repayment
    </strong>,
    "$400.00 → $501.86",
    <strong key="a2" className="text-gray-900">
      $108,447
    </strong>,
  ],
  ["HELOC, principal paid down over the 10-year draw", "$727.97", "$27,356"],
  ["Home equity loan, fixed, repaid over 15 years", "$573.39", "$43,210"],
];

const SHOCK = [
  ["7.00%", "$465.18", "+16.29%"],
  [
    <strong key="r8" className="text-gray-900">
      8.00%
    </strong>,
    <strong key="r8v" className="text-gray-900">
      $501.86
    </strong>,
    <strong key="r8p" className="text-gray-900">
      +25.47%
    </strong>,
  ],
  ["9.00%", "$539.84", "+34.96%"],
  ["10.00%", "$579.01", "+44.75%"],
  ["11.00%", "$619.31", "+54.83%"],
];

const FAQ = [
  {
    q: "Is a HELOC cheaper than a home equity loan?",
    a: "Not as a product — it is cheaper or much more expensive depending on whether you pay down principal during the draw. Borrowing $60,000 at 8.00%: a HELOC repaid over its ten-year draw costs $27,356 in interest. The same HELOC drawn interest-only for ten years and then repaid over twenty years costs $108,447. A fixed home equity loan over fifteen years costs $43,210. The product names explain none of that difference.",
  },
  {
    q: "What is the payment shock at the end of a draw period?",
    a: "During an interest-only draw you pay interest and nothing else, so the balance is exactly where it started. On $60,000 at 8.00% that is $400 a month for ten years, after which you still owe $60,000 and have to repay it over the remaining term. Over a twenty-year repayment at 8.00% the payment becomes $501.86 — 25.47% higher — and at 11.00% it becomes $619.31, which is 54.83% higher.",
  },
  {
    q: "What happens if rates rise during the draw period?",
    a: "On a variable-rate line, the interest-only payment rises immediately while the balance does not move at all. At 8.00% the payment is $400 a month; at 11.00% it is $550, a 37.5% increase for no reduction in what you owe. A fixed home equity loan cannot do that — the trade for that certainty is that you cannot benefit if rates fall either.",
  },
  {
    q: "Which one should I choose?",
    a: "The question is really whether you will pay principal during the draw, and whether you can absorb a payment that resets upwards. If the use is a defined one-off cost and you want the payment fixed and finished, a home equity loan matches the shape of the need. If you need a revolving line you draw on repeatedly, a HELOC fits — but budget for the repayment phase from the beginning, because that is where the cost is decided.",
  },
  {
    q: "Is the interest tax deductible?",
    a: "It can be, in some jurisdictions and for some uses, and it commonly is not for others. This is a question about your tax position and your local rules rather than about the loan, it has changed more than once, and it should be checked with someone qualified before it is treated as a reason to borrow. Nothing on this page assumes any deduction.",
  },
];

export default function HelocVsHomeEquityLoanGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="HELOC vs Home Equity Loan"
        description="The same $60,000 borrowed at the same rate, priced three ways — and why the draw period rather than the product name decides what it costs."
        path="/heloc-vs-home-equity-loan"
        siteUrl={SITE_URL}
        datePublished="2026-10-03"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          HELOC vs home equity loan
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          Both products let you borrow against the part of your home you own.
          Both are secured on the property. They are usually compared on the
          things that differ on the surface — a variable rate against a fixed
          one, a line you draw on against a lump sum — and that comparison
          misses where the money actually goes.
        </P>
        <P>
          Below, <strong>$60,000</strong> borrowed three ways. To keep the
          comparison honest, every version carries the{" "}
          <strong>same 8.00% rate</strong>: the only things that change are the
          structure of the draw and how long the repayment runs.
        </P>

        <H2>The same $60,000, three ways</H2>
        <DataTable
          head={["Strategy", "Monthly payment", "Interest over the life of the borrowing"]}
          align={["l", "r", "r"]}
          rows={THREE_WAYS}
          caption="All three at 8.00% on $60,000. Horizons are matched at 30 years: the home equity loan is repaid in 15 and then costs nothing for the remaining 15, while both HELOC paths run the full 30. Produced by our calculator and independently recomputed."
        />
        <P>
          The two HELOC rows are the same product, at the same rate, on the same
          balance — and they differ by a factor of{" "}
          <strong>almost four</strong>. The interest-only line costs{" "}
          <strong>$108,447</strong>; the amortising line costs{" "}
          <strong>$27,356</strong>. Nothing about which product you chose
          explains that gap. What explains it is whether the balance went down
          while you were making payments.
        </P>
        <Callout>
          <strong>The finding in one line:</strong> the interest-only HELOC costs{" "}
          <strong>2.51 times</strong> what the fixed home equity loan costs, and
          the amortising HELOC costs less than two thirds of it. The expensive
          choice is not the line of credit — it is the ten years of paying
          interest and reducing nothing.
        </Callout>

        <H2>Why interest-only costs that much</H2>
        <P>
          An interest-only draw does exactly what the name says. On $60,000 at
          8.00% the monthly charge is <strong>$400</strong>, and after ten years
          of paying it you have paid{" "}
          <strong>$48,000</strong> in interest and still owe{" "}
          <strong>$60,000</strong>. The second phase then repays that untouched
          balance over whatever term remains, so you pay interest on the full
          amount for the whole thirty years rather than on a shrinking balance.
        </P>
        <P>
          The comparison with the amortising version is not about discipline
          being rewarded. It is arithmetic: in the amortising case the
          outstanding balance falls every month, so every month&apos;s interest
          charge is smaller than the last. In the interest-only case the charge
          never falls, because the thing it is charged on never falls.
        </P>
        <P>
          The fixed home equity loan sits between the two because it amortises
          from day one — but on a longer schedule than the amortising HELOC, and
          with a payment that is lower than that HELOC&apos;s precisely because
          it takes longer to clear the balance. On a $60,000 balance the fixed
          loan costs <strong>$43,210</strong> and the ten-year amortising HELOC
          costs <strong>$27,356</strong>, and the difference is the term rather
          than the product.
        </P>

        <H2>The payment shock at the end of the draw</H2>
        <P>
          This is the number worth knowing before signing, because it arrives
          on a date that is usually a decade away when the paperwork is signed.
          At the end of a ten-year interest-only draw you owe $60,000 and must
          repay it over the twenty years that remain. What that does to the
          payment depends on where rates are by then:
        </P>
        <DataTable
          head={["Rate when the draw ends", "Payment over 20 years", "Change from $400"]}
          align={["l", "r", "r"]}
          rows={SHOCK}
          caption="$60,000 repaid over 240 months, so the balance is unchanged and the entire increase is the amortisation plus the rate. The 8.00% row is the unchanged-rate case. Produced by our calculator and independently recomputed."
        />
        <P>
          Even with rates exactly where they started, the payment rises by{" "}
          <strong>25.47%</strong> — from $400 to $501.86 — because you now have
          to clear the balance as well as service it. If rates are three points
          higher at that moment, the payment is <strong>$619.31</strong>, up
          from $400. A decade of paying $400 a month is a poor preparation for a
          $619.31 obligation.
        </P>
        <P>
          Nothing about this is hidden; it is in the terms. It is simply easy to
          discount when it is ten years away, and it lands at the same time as
          whatever the money was borrowed for has finished being useful.
        </P>

        <H2>If rates move during the draw</H2>
        <P>
          A variable-rate line moves before that. On the same $60,000, an
          interest-only payment at 8.00% is $400; at 11.00% it is{" "}
          <strong>$550</strong> — a <strong>37.5% increase</strong> in the
          monthly cost, with the balance still exactly $60,000 either way. The
          fixed home equity loan cannot do that to you, and in exchange it
          cannot do you the favour either if rates fall.
        </P>
        <P>
          That asymmetry is the actual decision. A fixed loan converts a rate
          you cannot control into one you can plan around; a line keeps both
          possibilities open. If the borrowing has a specific end date and a
          known amount, the fixed shape usually matches it. If you genuinely
          need to draw, repay and redraw — a staged renovation, for instance —
          the line is the only structure that fits, and the repayment phase
          should be budgeted for from the start rather than discovered later.
        </P>

        <H2>Two things worth checking before either one</H2>
        <UL>
          <li>
            <strong>What secures the debt.</strong> Both of these put your home
            behind the borrowing. That is why the rates are lower than an{" "}
            <A href="/personal-loan-calculator">unsecured personal loan</A>, and
            it is also why the consequences of not paying are larger. Compare
            the unsecured alternative before deciding that the cheaper rate is
            the whole story.
          </li>
          <li>
            <strong>What the repayment phase costs you.</strong> Run the
            interest-only version on paper before accepting it: $48,000 of
            interest over ten years and a balance that has not moved is the
            outcome, and it is worth seeing that number before it is contractual
            rather than after.
          </li>
        </UL>
        <P>
          If the reason for borrowing is a renovation or an extension, the
          improvement may also change what the property is worth — which affects
          both your loan-to-value ratio and, on a mortgage, whether{" "}
          <A href="/how-to-remove-pmi">mortgage insurance</A> can be removed.
          The <A href="/mortgage-calculator">mortgage calculator</A> handles the
          interaction between the two loan payments, and{" "}
          <A href="/how-to-pay-off-a-loan-early">how to pay off a loan early</A>{" "}
          covers what happens if you decide to attack the balance rather than
          the schedule.
        </P>

        <H2>The short version</H2>
        <P>
          On $60,000 at 8.00%, an interest-only HELOC costs $108,447 in interest
          — 2.51 times what a fixed home equity loan costs, and almost four
          times what the same HELOC costs if you amortise it over the draw.
          Interest-only for ten years means paying $48,000 and still owing
          $60,000, and the payment then rises to $501.86 even if rates have not
          moved. The product names decide very little. Whether the balance falls
          during the draw decides almost everything.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="heloc-vs-home-equity-loan" />
      </article>
    </main>
  );
}
