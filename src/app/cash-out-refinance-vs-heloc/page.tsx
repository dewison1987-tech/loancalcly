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
  path: "/cash-out-refinance-vs-heloc",
  title: "Cash-Out Refinance vs HELOC",
  description:
    "A cash-out refinance is $28,350 cheaper on the $60,000 you want — and $138,756 more expensive on the $254,328 you already owe. Why the second number decides it.",
  type: "article",
});

const PUBLISHED = "October 9, 2026";

/**
 * 全部数字由 src/lib/loan.ts 的 cashOutVsHeloc 生成，
 * 并经 Python / Node 两套独立实现 + 站点内核三方逐位复算（263 个值逐字节一致）。
 * 场景：房价 $420,000；现有贷款余额 $254,328 @6.50%，剩 240 期；
 * 想取出 $60,000。cash-out 按 6.75%/360 期，HELOC 按 8.00%
 * （10 年只付息 + 20 年摊还）。
 */
const ROUTES = [
  [
    <strong key="a" className="text-gray-900">
      Cash-out refinance
    </strong>,
    "$314,328 at 6.75%",
    "$2,038.73",
    <strong key="a2" className="text-gray-900">
      $419,613
    </strong>,
  ],
  [
    <strong key="b" className="text-gray-900">
      Keep the loan, add a HELOC
    </strong>,
    "$254,328 at 6.50% + $60,000 at 8.00%",
    "$2,296.20",
    <strong key="b2" className="text-gray-900">
      $309,208
    </strong>,
  ],
];

const ATTRIBUTION = [
  [
    <strong key="n" className="text-gray-900">
      Interest on the $60,000 you want
    </strong>,
    "$80,097",
    "$108,447",
    "−$28,350",
  ],
  [
    <strong key="o" className="text-gray-900">
      Interest on the $254,328 you already owe
    </strong>,
    "$339,516",
    "$200,760",
    "+$138,756",
  ],
  [
    <strong key="t" className="text-gray-900">
      Total interest over 30 years
    </strong>,
    <strong key="t2" className="text-gray-900">
      $419,613
    </strong>,
    <strong key="t3" className="text-gray-900">
      $309,208
    </strong>,
    <strong key="t4" className="text-gray-900">
      +$110,405
    </strong>,
  ],
];

const FAQ = [
  {
    q: "Is a cash-out refinance cheaper than a HELOC?",
    a: "On the money you actually want, usually yes. On the money you already owe, usually no. Borrowing $60,000 against a $254,328 balance: through a cash-out refinance the $60,000 costs $80,097 in interest, while a HELOC on the same $60,000 costs $108,447 — so the refinance is $28,350 cheaper on the new money. But the refinance also reprices the $254,328 you already had, and that costs $138,756 more. The net is $110,405 against the refinance.",
  },
  {
    q: "Why does a cash-out refinance cost more if the rate is lower than a HELOC?",
    a: "Because the lower rate applies to the whole balance, not just the new money. A cash-out refinance replaces the existing loan, so the $254,328 that was on a 6.50% loan with 240 months left becomes part of a new 6.75% loan running 360 months. The rate on the new money is better; the rate and the term on the old money are both worse. On this example 80.91% of the new loan is money you already owed.",
  },
  {
    q: "Why is the cash-out payment lower if it costs more?",
    a: "Because payments and costs are different questions. The cash-out refinance payment is $2,038.73 against $2,296.20 for the loan-plus-HELOC route — $257.47 lower every month — and yet it costs $110,405 more in total. The payment is lower because the loan was stretched back to thirty years. That is the trade: a smaller monthly figure in exchange for a larger total, which is the same mechanism that makes ordinary refinances look attractive.",
  },
  {
    q: "What happens to a HELOC when the draw period ends?",
    a: "If you paid interest only, the balance is exactly where it started. On $60,000 at 8.00% the draw payment is $400.00 a month for ten years, after which you still owe $60,000 and repay it over the remaining term. Over a twenty-year repayment at the same rate the payment becomes $501.86 — 25.47% higher — with no change in what you owe. That reset date is the single most important thing to budget for in a line of credit.",
  },
  {
    q: "Which should I use for a renovation?",
    a: "The shape of the need usually decides it. A known cost paid to a contractor in stages fits a HELOC, because you can draw as the work proceeds and only pay interest on what you have drawn. A single fixed amount with a defined end date fits a fixed home equity loan better, because the payment does not reset. A cash-out refinance makes sense mainly when you also want to change the terms of the first loan — which is exactly the case where you must check what it does to the whole balance, not just to the new money.",
  },
];

export default function CashOutRefinanceVsHelocGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="Cash-Out Refinance vs HELOC"
        description="Two ways to take $60,000 out of a house, and why the cheaper option on the new money is the more expensive option overall."
        path="/cash-out-refinance-vs-heloc"
        siteUrl={SITE_URL}
        datePublished="2026-10-09"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Cash-out refinance vs HELOC
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          These two are usually compared on rate. A cash-out refinance is a
          first-lien mortgage and prices lower; a HELOC sits behind that mortgage
          and prices higher. The comparison looks settled before it starts, and
          on the money you are actually trying to borrow it usually is. What is
          missing is the rest of the balance.
        </P>
        <P>
          Here is one house: worth <strong>$420,000</strong>, with a{" "}
          <strong>$254,328</strong> balance left on a 6.50% loan and 240 months
          remaining. You want <strong>$60,000</strong>. There is $165,672 of
          equity to borrow against, so both routes are open.
        </P>

        <H2>Two ways to get the same $60,000</H2>
        <DataTable
          head={["Route", "What you end up owing", "Monthly payment now", "Total interest"]}
          align={["l", "l", "r", "r"]}
          rows={ROUTES}
          caption="Cash-out refinance priced at 6.75% over 360 months; the alternative keeps the 6.50% first lien for its remaining 240 months and adds a $60,000 line at 8.00% with a ten-year interest-only draw and a twenty-year repayment. Both are measured across the same thirty years, by which point both are fully repaid. Figures are rounded independently, so components may differ from a column total by a dollar. Produced by our calculator and independently recomputed."
        />
        <P>
          Before going further, one detail in the second row is worth pausing on.
          The $254,328 balance over its remaining 240 months has a payment of{" "}
          <strong>$1,896.20</strong> — identical to the payment on the original
          $300,000 loan over 360 months. That is not a coincidence and not a
          rounding artifact: the remaining 240 payments <em>are</em> the second
          half of that original schedule. The loan gets cheaper to service as the
          balance falls, and the effect is exactly offset by having fewer years
          left to spread it over.
        </P>

        <H2>The $60,000 is cheaper through the refinance</H2>
        <P>
          This part is unsurprising and the numbers confirm it. A cash-out
          refinance borrows the $60,000 at 6.75%; a HELOC borrows it at 8.00%;
          over the life of the borrowing, the difference is{" "}
          <strong>$28,350</strong> in favour of the refinance.
        </P>
        <P>
          That would be the end of the comparison if the refinance borrowed only
          the $60,000. It does not. It replaces the existing loan, which means the
          $254,328 that was on a 6.50% loan with twenty years to run becomes part
          of a 6.75% loan with thirty years to run.{" "}
          <strong>80.91% of the new loan is money you already owed</strong>, and
          all of it gets repriced.
        </P>

        <H2>Where the interest actually goes</H2>
        <P>
          Because both borrowings carry a single rate and amortise on a single
          schedule, the interest can be split exactly by principal share rather
          than estimated. That split is what makes the comparison visible:
        </P>
        <DataTable
          head={["Interest paid on", "Cash-out refinance", "Keep the loan, add a HELOC", "Difference"]}
          align={["l", "r", "r", "r"]}
          rows={ATTRIBUTION}
          caption="The split is exact rather than approximate: within one loan at one rate, principal and interest amortise in proportion, so interest divides by principal share. Thirty-year horizon. Figures are rounded independently, so components may differ from a column total by a dollar. Produced by our calculator and independently recomputed."
        />
        <Callout>
          <strong>The finding in one line:</strong> the cash-out refinance is{" "}
          <strong>$28,350 cheaper</strong> on the $60,000 you want and{" "}
          <strong>$138,756 more expensive</strong> on the $254,328 you already
          owe. The second number is nearly five times the first, and it is the
          one that is invisible in a rate comparison — no rate quote will show it
          to you, because it is not a rate question. It is a question of what
          happens to a balance with twenty years left when it is put on a
          thirty-year schedule at a higher rate.
        </Callout>
        <P>
          Two things make that number as large as it is, and both are in the
          terms rather than in the arithmetic. The rate goes up by a quarter of a
          point on the whole balance, because cash-out pricing is generally a
          little worse than rate-and-term pricing. And the term goes from 240
          months back to 360 — so the $254,328 is charged interest for ten
          additional years. Either one alone would be costly; together they are
          what produces $138,756.
        </P>

        <H2>And the payment is lower</H2>
        <P>
          The cash-out refinance costs <strong>$2,038.73</strong> a month against{" "}
          <strong>$2,296.20</strong> for the loan-plus-HELOC route. It is
          $257.47 cheaper every month and $110,405 more expensive overall, and
          those two facts are not in tension — they are the same fact. Stretching
          a balance over thirty years instead of twenty is precisely what makes a
          payment smaller and a total larger.
        </P>
        <P>
          The HELOC route borrows the payment problem in a different place. Its
          draw payment is only <strong>$400.00</strong> — cheaper than either
          — but it is interest only, so it reduces nothing. When the ten-year
          draw ends you still owe $60,000, and repaying it over the remaining
          twenty years at the same rate costs <strong>$501.86</strong>, an
          increase of <strong>25.47%</strong> for no change in the balance. That
          reset is a decade away at signing, which is exactly why it is easy to
          discount.
        </P>

        <H2>What to check before choosing</H2>
        <UL>
          <li>
            <strong>How much of the new loan is old debt.</strong> Divide the
            existing balance by the new loan amount. Here it is 80.91%, which is
            why repricing dominates. If you had a small balance and wanted a large
            cash amount, the same comparison would come out the other way.
          </li>
          <li>
            <strong>How many years are left on the first loan.</strong> A
            refinance resets the term. If the existing loan has 20 years to run
            and the new one runs 30, you are buying a lower payment with ten
            extra years of interest — the arithmetic in{" "}
            <A href="/how-to-refinance-a-mortgage">how to refinance a
            mortgage</A> applies to the cash-out version too.
          </li>
          <li>
            <strong>What the cash-out rate actually is.</strong> Cash-out pricing
            is often slightly worse than rate-and-term pricing on the same day,
            so the number to compare is the one quoted for the cash-out version
            rather than for a plain refinance.
          </li>
          <li>
            <strong>Whether the HELOC can be repaid on schedule.</strong> The
            HELOC route only wins if the draw period is used to pay principal or
            the repayment phase is genuinely affordable. An interest-only draw
            for ten years costs $48,000 and leaves the balance untouched;{" "}
            <A href="/heloc-vs-home-equity-loan">HELOC versus home equity
            loan</A> prices that same $60,000 three ways and the gap between them
            is almost four-fold.
          </li>
          <li>
            <strong>What secures each option.</strong> Both put your home behind
            the borrowing. That is why both are cheaper than an{" "}
            <A href="/personal-loan-calculator">unsecured personal loan</A>, and
            it is why the consequences of missing payments are larger.
          </li>
        </UL>

        <H2>Which one to pick</H2>
        <P>
          The useful question is not which product is cheaper in the abstract,
          but whether you also want to change the first loan. If you do — because
          you want a lower rate, or a different term, or to consolidate
          everything into one payment — then a cash-out refinance is doing two
          jobs at once, and the $138,756 is the price of the second job. If you
          are happy with the first loan and only want the $60,000, a second lien
          leaves the good loan alone, and the $28,350 premium you pay on the new
          money is the price of that restraint. Both are defensible; the failure
          mode is doing the first while believing you are doing the second.
        </P>
        <P>
          To see what the refinance does on your own balance,{" "}
          <A href="/mortgage-calculator">the mortgage calculator</A> prices any
          rate and term, and{" "}
          <A href="/amortization-schedule">the amortization schedule</A> shows
          how much of the new thirty years is spent on interest rather than
          principal. You can also check what cash-out does to your loan-to-value
          ratio with{" "}
          <A href="/home-affordability-calculator">the affordability
          calculator</A>.
        </P>

        <H2>The short version</H2>
        <P>
          Taking $60,000 out of a house with a $254,328 balance: a cash-out
          refinance at 6.75% over thirty years costs $419,613 in interest, and
          keeping the 6.50% loan while adding a HELOC at 8.00% costs $309,208.
          The refinance is $28,350 cheaper on the $60,000 and $138,756 more
          expensive on everything else, netting $110,405 against it — while
          showing a monthly payment $257.47 lower. The rate on the money you want
          is not the cost of the money you already owe.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="cash-out-refinance-vs-heloc" />
      </article>
    </main>
  );
}
