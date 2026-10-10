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
  Formula,
  H2,
  P,
  UL,
} from "@/components/Prose";

export const metadata: Metadata = pageMetadata({
  path: "/how-much-home-equity-do-i-have",
  title: "How Much Home Equity Do I Have?",
  description:
    "$500,000 of house against a $320,000 mortgage is $180,000 of equity — but only $80,000 is borrowable, and a 20% price drop wipes that out entirely.",
  type: "article",
});

const PUBLISHED = "October 11, 2026";

/**
 * 全部数字由 src/lib/loan.ts 的 homeEquity / homeEquityStress 生成，并经
 * Python / Node 两套独立实现 + 站点内核三方逐位复算（175 个值逐字节一致）。
 *
 * 场景：房价 $500,000，贷款余额 $320,000（LTV 64%），CLTV 上限 80%，
 * 卖房成本 6%，借出成本 2%。
 *
 * ⚠️ 只建模「净值可以按三种口径测量」这一点，不暗示任何产品可用性。
 * 80% 上限、6% 卖房成本、2% 借出成本都是显式入参，不是内置经验值 ——
 * 真实项目里这三个数都由贷款方与市场决定。
 */

const MEASUREMENTS = [
  [
    <strong key="a" className="text-gray-900">
      Equity on paper
    </strong>,
    <strong key="a2" className="text-gray-900">
      $180,000
    </strong>,
    "36.00% of the $500,000 value — what you own if the mortgage vanished",
  ],
  [
    <strong key="b" className="text-gray-900">
      Borrowable at 80% CLTV
    </strong>,
    <strong key="b2" className="text-gray-900">
      $80,000
    </strong>,
    "44.44% of that equity — what a lender will actually release today",
  ],
  [
    <strong key="c" className="text-gray-900">
      Net if you sold
    </strong>,
    <strong key="c2" className="text-gray-900">
      $150,000
    </strong>,
    "After $30,000 of selling costs and the $320,000 balance is cleared",
  ],
];

const ROUTES = [
  [
    <strong key="a" className="text-gray-900">
      Borrow against it
    </strong>,
    <strong key="a2" className="text-gray-900">
      $80,000
    </strong>,
    "$100,000 — held back by the 80% ceiling",
    "$180,000",
  ],
  [
    <strong key="b" className="text-gray-900">
      Sell the house
    </strong>,
    <strong key="b2" className="text-gray-900">
      $150,000
    </strong>,
    "$30,000 — consumed by the cost of selling",
    "$180,000",
  ],
];

const STRESS = [
  [
    <strong key="a" className="text-gray-900">
      $400,000 — down 20%
    </strong>,
    "$80,000",
    "−55.56%",
    "80.00%",
    <strong key="a2" className="text-gray-900">
      $0
    </strong>,
    <strong key="a3" className="text-gray-900">
      −100%
    </strong>,
  ],
  ["$425,000 — down 15%", "$105,000", "−41.67%", "75.29%", "$20,000", "−75%"],
  [
    <strong key="b" className="text-gray-900">
      $450,000 — down 10%
    </strong>,
    "$130,000",
    "−27.78%",
    "71.11%",
    <strong key="b2" className="text-gray-900">
      $40,000
    </strong>,
    <strong key="b3" className="text-gray-900">
      −50%
    </strong>,
  ],
  ["$475,000 — down 5%", "$155,000", "−13.89%", "67.37%", "$60,000", "−25%"],
  ["$525,000 — up 5%", "$205,000", "+13.89%", "60.95%", "$100,000", "+25%"],
  ["$550,000 — up 10%", "$230,000", "+27.78%", "58.18%", "$120,000", "+50%"],
];

const FAQ = [
  {
    q: "Why can’t I borrow all my equity?",
    a: "Because the ceiling is set against the value of the house, not against what you own. A lender working to an 80% combined loan-to-value limit will let total borrowing reach 80% of the value and no further. On a $500,000 house that ceiling is $400,000; if $320,000 of that is already in use by the first mortgage, the remaining room is $80,000. The $100,000 between that and your $180,000 of equity is not withheld by anyone — it exists, it is simply above the line the lender is prepared to lend against.",
  },
  {
    q: "Does paying down the mortgage increase what I can borrow?",
    a: "Yes, and pound for pound. Every dollar of principal repaid frees a dollar of room under the ceiling, because the ceiling is a fixed dollar figure that depends only on the value. This is why the two levers are different in character: paying down the balance raises your borrowing room one-for-one, while a rise in the house price raises the ceiling by 80% of the increase and leaves 20% for you. Neither is fast, but they are not symmetric.",
  },
  {
    q: "Why does selling leave me less than the equity figure?",
    a: "Because selling costs money, and no loan product reimburses it. Commission, transfer taxes, title work and the other items on a sale typically run to a percentage of the price — 6% here, so $30,000 on a $500,000 house. That money comes out of the proceeds before the mortgage is cleared, which is why the cash that reaches you is smaller than the equity on paper even though nothing has gone wrong.",
  },
  {
    q: "How can my borrowing room fall faster than my equity?",
    a: "Because the two are measured from different starting points. Equity is the difference between value and balance, so a fall in value hits it directly. Borrowing room is the gap between a ceiling that moves with value and a balance that does not move at all. When the gap was narrow to begin with, the same percentage fall in value removes a much larger share of it. In the table above a 10% fall in value costs 27.78% of the equity but 50% of the borrowing room.",
  },
  {
    q: "Is equity the same as being able to afford something?",
    a: "No, and the distinction matters more than it sounds. Equity is a stake in an asset; borrowing against it converts that stake into a debt secured on your home. The lender’s decision will turn on your income and credit as much as on the house, and a second loan on the property changes what happens if you cannot pay. A large equity figure is a real asset and not a spending limit.",
  },
];

export default function HomeEquityGuide() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-12">
      <ArticleSchema
        headline="How Much Home Equity Do I Have?"
        description="Home equity measured three ways — what you own, what a lender will release, and what a sale would leave — and why the third number is the one that drives decisions."
        path="/how-much-home-equity-do-i-have"
        siteUrl={SITE_URL}
        datePublished="2026-10-11"
      />

      <article>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          How much home equity do I have?
        </h1>
        <Byline published={PUBLISHED} />

        <P>
          The question sounds like it has one answer, and the number most people
          arrive at — value minus mortgage balance — is a real figure and a
          perfectly honest one. It is also the least useful of the three numbers
          that get called equity, because it is not the number any decision is
          actually made against. A lender lends against a ceiling. A sale returns
          proceeds. Neither of those is the same as your stake, and the gap
          between them is where the surprises live.
        </P>
        <P>
          The example used throughout is a <strong>$500,000</strong> house with a{" "}
          <strong>$320,000</strong> mortgage balance. There is{" "}
          <strong>$180,000</strong> of equity on paper. Only{" "}
          <strong>$80,000</strong> of it is reachable by borrowing, and only{" "}
          <strong>$150,000</strong> would reach you through a sale.
        </P>

        <H2>Three measurements, one house</H2>
        <P>
          These three figures are usually quoted as though they were
          interchangeable, and at the point of decision they are not:
        </P>
        <DataTable
          head={["Measurement", "Amount", "What it answers"]}
          align={["l", "r", "l"]}
          rows={MEASUREMENTS}
          caption="A $500,000 house with a $320,000 mortgage. The 36.00% and 44.44% shares are calculated from the same figures in the table. Produced by our calculator and independently recomputed."
        />
        <P>
          The middle row is the one worth pausing on. Borrowable room is{" "}
          <strong>44.44%</strong> of the equity — less than half. That is not a
          fee or a penalty, and nothing has been taken from you. It is the
          consequence of a lending rule and a number that does not move, and the
          rest of this page is about how those two interact.
        </P>

        <H2>The ceiling is set by the house, not by you</H2>
        <P>
          Every equity-secured loan is written against a maximum combined
          loan-to-value ratio: the total of all borrowing secured on the property,
          divided by its value, cannot exceed some limit. At 80% on a $500,000
          house, total secured debt tops out at $400,000. The first mortgage
          already occupies $320,000 of that:
        </P>
        <Formula>
          80% × $500,000 = $400,000 ceiling; $400,000 − $320,000 = $80,000
          available
        </Formula>
        <P>
          Everything about the borrowing figures follows from that one line. The
          remaining $100,000 of equity is above the line the lender is prepared to
          lend against — it is not lost, but no product on the standard menu will
          hand it to you without either the value rising or the balance falling.
        </P>
        <Callout>
          <strong>The finding in one line:</strong> $180,000 of equity sounds like
          $180,000 of spending power. Borrowing releases{" "}
          <strong>44.44%</strong> of it and a sale returns <strong>83.33%</strong>{" "}
          — and neither route removes the other route’s obstacle.
        </Callout>

        <H2>Two routes, two very different numbers</H2>
        <P>
          Put the two usable routes side by side. Both start from the same
          $180,000 — they just part company over what stands between you and it:
        </P>
        <DataTable
          head={["Route", "Reaches you", "Does not reach you", "Equity"]}
          align={["l", "r", "l", "r"]}
          rows={ROUTES}
          caption="The $100,000 and the $30,000 overlap: selling does not release the ceiling, and borrowing does not pay the selling costs. Both columns account for the same $180,000 in full. Produced by our calculator and independently recomputed."
        />
        <P>
          The borrowing route leaves <strong>$100,000</strong> behind and the
          selling route leaves <strong>$30,000</strong> behind, and the two
          withheld amounts are not alternatives — they are different obstacles
          that happen to sit on different routes. Borrowing against the house does
          nothing about the cost of selling it, and selling it does not make the
          ceiling disappear. A household with $180,000 of equity who needs
          $120,000 in cash has neither route open, and that is the whole point of
          separating the figures.
        </P>
        <P>
          There is also a cost to the borrowing route that the table does not
          show. Releasing $80,000 is not free — at 2% in origination and closing
          charges, the cash actually in hand is <strong>$78,400</strong>, so the
          amount that reaches you is smaller again.{" "}
          <A href="/heloc-vs-home-equity-loan">
            HELOC versus home equity loan
          </A>{" "}
          works through what those charges look like across the two main product
          shapes.
        </P>

        <H2>Equity does not hold still, and neither does the ceiling</H2>
        <P>
          Everything above is a snapshot. House prices move, and because the
          borrowing room is a narrow gap between a moving ceiling and a fixed
          balance, it moves far more violently than the equity figure does:
        </P>
        <DataTable
          head={[
            "Home value",
            "Equity",
            "Change in equity",
            "Loan-to-value",
            "Borrowable",
            "Change in room",
          ]}
          align={["l", "r", "r", "r", "r", "r"]}
          rows={STRESS}
          caption="Only the home value changes; the $320,000 balance and the 80% ceiling rule are held fixed. Change columns are measured against the $500,000 base case. Produced by our calculator and independently recomputed."
        />
        <P>
          Read the last two columns down the table and the shape of the risk
          becomes clear. A <strong>10%</strong> fall in the house price costs{" "}
          <strong>27.78%</strong> of the equity but <strong>50%</strong> of the
          borrowing room. At <strong>20%</strong> the equity is still a healthy
          $80,000 and the borrowing room is <strong>zero</strong> — the balance
          exactly fills the ceiling, so there is no product that can lend against
          the house at all, regardless of income or credit.
        </P>
        <P>
          This asymmetry is not a quirk of the numbers chosen here. It follows
          from the structure: equity is a difference in which both terms move,
          while borrowing room is the distance between a moving ceiling and a
          balance that does not move at all. The narrower that distance, the
          larger the percentage of it a given fall in value removes.
        </P>

        <H2>Why the 80% figure matters more than the balance</H2>
        <P>
          The two levers that restore borrowing room are unequal, and the
          difference is worth internalising. Repaying principal frees room
          one-for-one: each dollar repaid is a dollar of headroom. A rise in the
          house price frees room at 80 cents on the dollar, because the ceiling
          rises by 80% of the gain while the balance is untouched. And a fall in
          the price destroys room at 80 cents on the dollar as well — which is
          why the downside comes faster than the upside feels.
        </P>
        <P>
          If the house falls to $450,000 the ceiling falls with it, to
          $360,000 — so restoring the original $80,000 of borrowing room would
          then require the balance down to $280,000, $40,000 further repaid than
          the $320,000 balance implies. A price fall and a repayment plan attack
          the same problem from opposite directions, and an owner who experiences
          both is not simply back where they started.
        </P>

        <H2>What this arithmetic leaves out, on purpose</H2>
        <UL>
          <li>
            <strong>Whether a lender will approve you.</strong> The ceiling is a
            limit, not an entitlement. Approval turns on income, credit history
            and existing obligations, and this page deliberately computes none of
            those. A household with $80,000 of borrowing room and no room in its
            budget has $80,000 of room on paper only.
          </li>
          <li>
            <strong>Where the ceiling actually sits.</strong> The 80% used here
            is a common convention rather than a universal rule, and the figure
            differs by programme, product and lender. The arithmetic is driven
            entirely by that input — change it and every number on the page
            changes — which is why the real number belongs in the loan documents,
            not in an example.
          </li>
          <li>
            <strong>What selling would actually cost.</strong> The 6% used here
            is one illustrative figure for commission, transfer taxes, title work
            and the rest. It varies by market and by how the sale is arranged, and
            in some markets it is materially higher or lower. The point is that it
            is a percentage of the price, which is why it scales with the house
            rather than with your equity.
          </li>
          <li>
            <strong>That the money is borrowed, not withdrawn.</strong> A second
            loan secured on the home is still a loan. It has a payment, it has a
            term, and it makes the house the collateral. That changes what happens
            if circumstances turn, and no table of equity figures captures it.
          </li>
        </UL>

        <H2>How to use this</H2>
        <UL>
          <li>
            <strong>Work out the borrowing room before shopping,</strong> not
            after. Take the ceiling you expect — say 80% of your home value — and
            subtract the balance. What remains is the absolute most any
            equity-secured product can release, before costs.{" "}
            <A href="/mortgage-calculator">The mortgage calculator</A> prices what
            the resulting payment would be.
          </li>
          <li>
            <strong>Decide which figure your plan actually depends on.</strong> A
            renovation funded by borrowing needs the $80,000. A plan to downsize
            depends on the $150,000. Confusing the two leads to plans that do not
            survive contact with the paperwork, and{" "}
            <A href="/cash-out-refinance-vs-heloc">
              cash-out refinance versus HELOC
            </A>{" "}
            compares the two main ways of reaching the borrowing figure.
          </li>
          <li>
            <strong>If the goal is to clear other debts,</strong> compare the
            secured route against an unsecured one before assuming the lower
            headline rate wins.{" "}
            <A href="/debt-consolidation-vs-home-equity-loan">
              Debt consolidation versus a home equity loan
            </A>{" "}
            shows a case where the cheaper-looking rate costs more overall.
          </li>
          <li>
            <strong>If the plan needs more room than exists,</strong> the honest
            options are to wait, to repay principal, or to choose a different
            plan. Refinancing can restructure the borrowing but does not create
            headroom against a fixed ceiling —{" "}
            <A href="/how-to-refinance-a-mortgage">how to refinance a mortgage</A>{" "}
            covers what it does and does not change.
          </li>
          <li>
            <strong>Model the payment, not just the amount.</strong> An amortising{" "}
            <A href="/personal-loan-calculator">personal loan calculator</A> and
            an{" "}
            <A href="/amortization-schedule">amortization schedule</A> both show
            how a given balance behaves over time, which is the part a single
            equity figure always hides.
          </li>
        </UL>

        <H2>The short version</H2>
        <P>
          A $500,000 house with a $320,000 mortgage has{" "}
          <strong>$180,000</strong> of equity on paper, but only{" "}
          <strong>$80,000</strong> is reachable by borrowing and only{" "}
          <strong>$150,000</strong> by selling — 44.44% and 83.33% of the headline
          figure respectively. The borrowing limit is set by the house rather than
          by what you own, so a 10% fall in value costs 27.78% of the equity but
          50% of the borrowing room, and a 20% fall leaves the equity intact at
          $80,000 while the borrowing room goes to zero. Equity is a real asset.
          It is not a spending limit, and it is not one number.
        </P>

        <Faq items={FAQ} />

        <ArticleFooter currentSlug="how-much-home-equity-do-i-have" />
      </article>
    </main>
  );
}
