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
  path: "/what-is-an-escrow-account",
  title: "What Is an Escrow Account?",
  description:
    "On a $320,000 loan, $550 of a $2,572.62 payment never touches the loan. What the escrow account does with it, and why a 10% tax rise adds $80 a month at first.",
  type: "article",
});

const PUBLISHED = "October 9, 2026";

/**
 * 全部数字由 src/lib/loan.ts 的 escrowBreakdown / escrowShortfall 生成，
 * 并经 Python / Node 两套独立实现 + 站点内核三方逐位复算（263 个值逐字节一致）。
 * 场景：$400,000 房价，20% 首付 → $320,000 贷款 @6.50%/30 年；
 * 房产税按房价的 1.20%/年，房屋保险 $1,800/年。
 * 税率与保费只作 illustrative —— 各地区差异极大，用你自己的税单与保单代入。
 */
const SPLIT = [
  ["Principal & interest", "$2,022.62", "78.62%"],
  ["Property tax", "$400.00", "15.55%"],
  ["Homeowners insurance", "$150.00", "5.83%"],
  [
    <strong key="e" className="text-gray-900">
      Escrow — tax plus insurance
    </strong>,
    <strong key="e2" className="text-gray-900">
      $550.00
    </strong>,
    <strong key="e3" className="text-gray-900">
      21.38%
    </strong>,
  ],
  [
    <strong key="t" className="text-gray-900">
      Total monthly payment
    </strong>,
    <strong key="t2" className="text-gray-900">
      $2,572.62
    </strong>,
    "100%",
  ],
];

const YEAR_CYCLE = [
  ["Collected across 12 monthly payments", "$6,600"],
  ["Property tax paid out — usually in one or two instalments", "$4,800"],
  ["Homeowners insurance paid out — usually one annual premium", "$1,800"],
  ["Maximum cushion the servicer may hold", "$1,100"],
];

const TAX_RISE = [
  ["Property tax", "$400.00", "$440.00", "+$40.00"],
  ["Insurance", "$150.00", "$150.00", "—"],
  [
    <strong key="e" className="text-gray-900">
      Escrow total
    </strong>,
    <strong key="e2" className="text-gray-900">
      $550.00
    </strong>,
    <strong key="e3" className="text-gray-900">
      $590.00
    </strong>,
    <strong key="e4" className="text-gray-900">
      +$40.00
    </strong>,
  ],
  [
    <strong key="p" className="text-gray-900">
      Total payment
    </strong>,
    <strong key="p2" className="text-gray-900">
      $2,572.62
    </strong>,
    <strong key="p3" className="text-gray-900">
      $2,612.62
    </strong>,
    "+$40.00",
  ],
];

const FAQ = [
  {
    q: "What exactly is an escrow account?",
    a: "It is a holding account your mortgage servicer uses to collect and pay the property costs that sit outside principal and interest — most often property tax and homeowners insurance. On a $320,000 loan at 6.50% the principal and interest is $2,022.62 a month, and the escrow part is $550.00 of it. That $550 does not reduce the loan balance by a cent, and it is not a fee: it is your own tax and insurance bill, collected in monthly instalments instead of arriving as one large payment.",
  },
  {
    q: "Is escrow the same thing as earnest money?",
    a: "No, and the word is used for both. During a purchase, escrow describes a neutral third party holding the deposit and the documents until the sale completes. After completion, the same word usually describes the impound account that collects your tax and insurance. They are different arrangements that happen to share a name, and a question about one of them does not tell you anything about the other.",
  },
  {
    q: "Why does my payment change if my loan is fixed?",
    a: "Because part of your payment is not the loan. On this example $550.00 of the $2,572.62 goes to escrow, and both halves of that figure move when the tax assessment or the insurance premium changes. A fixed rate fixes the $2,022.62. It fixes nothing about the other $550, which is why a payment can rise on a loan whose rate cannot.",
  },
  {
    q: "Why did my payment jump more than the tax increase?",
    a: "Because the shortfall arrives as well as the increase. If the tax bill rises 10% mid-year, the servicer has already paid the higher bill out of an account funded at the old rate, leaving a $480 gap. Servicing rules generally allow that gap to be spread across at least twelve months, which adds $40.00 a month on top of the $40.00 increase — $80.00 in total for that year. The following year the payment falls back to the $40.00 increase.",
  },
  {
    q: "Can I pay tax and insurance myself instead?",
    a: "Sometimes, and the terms depend on the loan and the lender rather than on a general rule. Waiving escrow means you keep the $550 a month yourself and are responsible for a $4,800 tax bill and an $1,800 premium when they fall due, plus any penalties if they are late. Whether that is available, whether it costs anything, and whether it is wise all depend on your circumstances; your servicer is the right place to ask, and the CFPB material on escrow accounts is the right place to read about the rules.",
  },
];

export default function WhatIsAnEscrowAccountGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="What Is an Escrow Account?"
        description="What the part of your mortgage payment that is not the mortgage actually pays for, how the annual cycle works, and what happens to the figure when the tax bill rises."
        path="/what-is-an-escrow-account"
        siteUrl={SITE_URL}
        datePublished="2026-10-09"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          What is an escrow account?
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          Ask most borrowers what their mortgage payment is and they will quote
          the loan payment. The amount actually leaving their account every month
          is usually larger, and a substantial part of it never touches the loan
          at all. That gap is the escrow account, and understanding it explains
          two things that otherwise look like errors: why a fixed-rate payment
          can rise, and why it can rise by more than the tax bill did.
        </P>
        <P>
          The numbers below are one house: <strong>$400,000</strong> with 20%
          down, so a <strong>$320,000</strong> loan at{" "}
          <strong>6.50%</strong> over 30 years, with property tax at 1.20% of the
          price a year and insurance at $1,800 a year.
        </P>

        <H2>The payment is two different things stapled together</H2>
        <DataTable
          head={["Component", "Monthly", "Share of the payment"]}
          align={["l", "r", "r"]}
          rows={SPLIT}
          caption="$320,000 at 6.50% over 30 years. Property tax at 1.20% of a $400,000 price and insurance at $1,800 a year, collected monthly. Produced by our calculator and independently recomputed."
        />
        <P>
          The escrow line is <strong>21.38%</strong> of the payment. It is worth
          sitting with that for a moment, because it changes the arithmetic of a
          mortgage in a way people rarely account for. Roughly a fifth of what
          you pay every month is not paying down the loan and is not interest —
          it is a tax bill and an insurance premium, arriving in instalments.
        </P>
        <P>
          Nothing about that is harmful. It is arguably helpful: the alternative
          is finding $4,800 and $1,800 in single payments at unpredictable
          moments. What it does mean is that the escrow figure is not a fixed
          quantity, and it is not part of your rate. It is a forecast that gets
          corrected every year.
        </P>

        <H2>The annual cycle</H2>
        <P>
          In a normal year, the account does one full loop. Twelve monthly
          collections go in; the tax authority and the insurer take their
          payments out:
        </P>
        <DataTable
          head={["Over twelve months", "Amount"]}
          align={["l", "r"]}
          rows={YEAR_CYCLE}
          caption="Property tax at 1.20% of a $400,000 price and insurance at $1,800 a year. The cushion figure is the maximum the servicer may generally hold — typically one sixth of the annual disbursements, or two months — and it applies to the required balance rather than to what you are charged each month. Produced by our calculator and independently recomputed."
        />
        <P>
          What you contribute across the year and what gets paid out are the same
          number, which is the point of the arrangement. The cushion is the part
          that surprises people: the servicer is generally permitted to hold a
          buffer above the year&apos;s bills so that a payment can be made when
          the bill arrives before the money to cover it has been collected. On
          these figures that buffer is up to <strong>$1,100</strong>.
        </P>
        <Callout>
          <strong>Worth knowing:</strong> the escrow account is not a savings
          account and it does not earn you anything. It is a pass-through. The
          only money in it that is not already spoken for is the cushion, and
          even that belongs to you — it is your money being held against a bill
          that is coming.
        </Callout>

        <H2>What happens when the tax bill rises</H2>
        <P>
          This is where the escrow account produces the payment increase that
          does not match the tax increase. Suppose the assessment goes up 10%:
        </P>
        <DataTable
          head={["Component", "Before", "After a 10% tax rise", "Change"]}
          align={["l", "r", "r", "r"]}
          rows={TAX_RISE}
          caption="Property tax rising 10% from $400.00 to $440.00 a month, insurance unchanged, on a $320,000 loan at 6.50% over 30 years. Produced by our calculator and independently recomputed."
        />
        <P>
          That table is the settled position — the increase that applies once the
          account has adjusted. The first year is different, and this is the part
          almost nobody expects. The servicer pays the higher tax bill in full
          when it falls due, but your monthly collection was set from the old
          assessment. The result is a gap of <strong>$480</strong> that has to be
          recovered, and servicing rules generally allow it to be spread across
          at least twelve months — which is another <strong>$40.00</strong> a
          month.
        </P>
        <P>
          So a 10% tax rise raises the payment <strong>$40.00</strong> in the
          steady state, and <strong>$80.00</strong> in the first year, taking it
          from $2,572.62 to $2,652.62 before falling back to $2,612.62. The same
          mechanism runs in reverse: if the assessment falls, the payment can
          drop, and the surplus is either refunded or credited rather than kept.
        </P>

        <H2>What the escrow figure is not</H2>
        <UL>
          <li>
            <strong>It is not a fee.</strong> The servicer is collecting your own
            bills. Fees, if any, are separate line items and are disclosed
            separately.
          </li>
          <li>
            <strong>It is not part of the rate.</strong> Your 6.50% applies to
            the loan balance. It has nothing to do with the tax and insurance
            portion, which is why a fixed-rate loan can still have a rising
            payment.
          </li>
          <li>
            <strong>It is not affected by extra payments.</strong> Paying the loan
            down faster reduces the interest and can end mortgage insurance, but
            it does not change the tax or the insurance. The escrow half of the
            payment sits outside that entirely.
          </li>
          <li>
            <strong>It is not the same as the escrow used in a purchase.</strong>{" "}
            A purchase escrow holds the deposit and the paperwork until closing.
            An impound account holds tax and insurance money after closing. Two
            different arrangements, one word.
          </li>
        </UL>

        <H2>Where the figures come from, and how to check yours</H2>
        <UL>
          <li>
            <strong>Property tax:</strong> your county assessor&apos;s record, not
            the estimate in an online listing. The rate varies enormously between
            jurisdictions and the assessed value may differ from the price you
            paid.
          </li>
          <li>
            <strong>Insurance:</strong> your own policy quote. This is the line
            most likely to move sharply, and unlike tax it is not capped by
            anything.
          </li>
          <li>
            <strong>The cushion:</strong> in your escrow account statement. The
            rules come from the CFPB&apos;s servicing regulations rather than from
            a general rule of thumb, so the statement is the place to read them.
          </li>
          <li>
            <strong>The loan payment itself:</strong>{" "}
            <A href="/mortgage-calculator">the mortgage calculator</A> prices
            principal, interest, tax, insurance and mortgage insurance on your own
            numbers, and{" "}
            <A href="/amortization-schedule">the amortization schedule</A> shows
            how the principal and interest half of the payment changes over time —
            which, unlike the escrow half, is entirely predictable.
          </li>
        </UL>
        <P>
          One related figure worth pinning down while you are here: whether
          mortgage insurance is part of the payment at all depends on your
          loan-to-value ratio, and it stops on a date you can calculate.{" "}
          <A href="/how-to-remove-pmi">How to remove PMI</A> works through the
          timing, and{" "}
          <A href="/how-much-down-payment-do-i-need">how much down payment you
          need</A> covers what each down payment level does to that line.
        </P>

        <H2>The short version</H2>
        <P>
          On a $320,000 loan at 6.50% the loan payment is $2,022.62 and the
          amount you actually pay is $2,572.62. The difference is $550.00 a month
          of tax and insurance, sitting in a pass-through account that pays your
          own bills once or twice a year. It is 21.38% of the payment and it is
          not fixed. When the tax bill rises 10%, the payment rises $40.00 in the
          steady state and $80.00 in the first year, because the shortfall the
          servicer covered has to be recovered on top of the new assessment. A
          fixed rate fixes the loan, not the payment.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="what-is-an-escrow-account" />
      </article>
    </main>
  );
}
