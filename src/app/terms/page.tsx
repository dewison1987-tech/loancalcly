import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets, Ext } from "@/components/LegalPage";
import { CONTACT_EMAIL, SITE_HOST } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of service",
  description:
    "The terms governing your use of the LoanCalcly loan calculator, including permitted use, intellectual property, disclaimers and limitation of liability.",
};

const LAST_UPDATED = "September 25, 2026";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service"
      updated={LAST_UPDATED}
      intro={
        <p>
          These terms govern your use of {SITE_HOST} and the calculator it
          provides. By using the site you agree to them. If you do not agree,
          please do not use the site.
        </p>
      }
    >
      <Section title="1. The service">
        <p>
          LoanCalcly provides free online financial calculators and explanatory
          content. The service is provided as-is for personal, informational
          use. We may add, change, suspend or remove any part of it at any time
          without notice.
        </p>
      </Section>

      <Section title="2. Permitted use">
        <p>You may use this site for lawful personal or professional purposes. You agree not to:</p>
        <Bullets
          items={[
            "scrape, crawl or bulk-download the site in a way that degrades service for other users;",
            "copy, republish or redistribute substantial portions of the site's content without written permission;",
            "attempt to gain unauthorised access to the site, its servers or any connected system;",
            "introduce malware, or interfere with the site's normal operation;",
            "misrepresent the calculator's output as an offer of credit, a quote, or advice from a licensed professional;",
            "use the site in any way that breaches applicable law or regulation.",
          ]}
        />
      </Section>

      <Section title="3. Intellectual property">
        <p>
          The site&apos;s design, code, text, structure, and the LoanCalcly name and
          logo are owned by us or our licensors and are protected by copyright
          and trademark law. You may link to any page, quote short excerpts with
          clear attribution and a link back, and use the calculator&apos;s output for
          your own personal decision-making. You may not republish our content
          wholesale, or present it as your own.
        </p>
        <p>
          Third-party names, logos and trademarks referenced on this site remain
          the property of their respective owners and appear for identification
          purposes only. Their appearance does not imply endorsement or
          affiliation.
        </p>
      </Section>

      <Section title="4. No financial, legal or tax advice">
        <p>
          LoanCalcly is not a lender, broker, credit counsellor, attorney,
          accountant or licensed financial adviser, and nothing on this site
          constitutes financial, legal, tax or investment advice, or a
          recommendation to enter into any loan or credit product. All figures
          are estimates for illustration. You are solely responsible for your
          borrowing decisions. Read the full{" "}
          <Link
            href="/disclaimer"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            Disclaimer
          </Link>
          , which forms part of these terms.
        </p>
      </Section>

      <Section title="5. Accuracy and availability">
        <p>
          We work to keep the calculator accurate and the site available, but we
          do not warrant that the site will be uninterrupted, error-free or free
          of harmful components, or that any calculation will match the figures
          quoted by a lender. Lenders may use different day-count conventions,
          rounding rules, fee structures and payment schedules. The terms in
          your loan agreement always govern.
        </p>
      </Section>

      <Section title="6. Third-party links and advertising">
        <p>
          The site contains links to third-party websites and displays
          third-party advertising. We do not control, endorse or take
          responsibility for third-party content, products, services or privacy
          practices. Any dealings you have with a third party found through this
          site are solely between you and that third party.
        </p>
      </Section>

      <Section title="7. Limitation of liability">
        <p>
          To the fullest extent permitted by law, LoanCalcly and the people
          behind it shall not be liable for any indirect, incidental, special,
          consequential or punitive damages, or for any loss of profits,
          revenue, data, or financial opportunity, arising out of or in
          connection with your use of — or inability to use — this site or its
          calculations. Where liability cannot be excluded, our total aggregate
          liability is limited to the greater of the amount you paid us to use
          the site (which is zero, because the site is free) or USD 50.
        </p>
        <p>
          Nothing in these terms limits any liability that cannot lawfully be
          limited or excluded, including for fraud or for death or personal
          injury caused by negligence.
        </p>
      </Section>

      <Section title="8. Indemnity">
        <p>
          You agree to indemnify and hold harmless LoanCalcly against claims,
          losses and reasonable costs arising from your misuse of the site or
          your breach of these terms.
        </p>
      </Section>

      <Section title="9. Changes to these terms">
        <p>
          We may update these terms from time to time. The revised version takes
          effect when posted, and the &ldquo;last updated&rdquo; date at the top
          of this page will change. Continued use of the site after that
          constitutes acceptance.
        </p>
      </Section>

      <Section title="10. Governing law">
        <p>
          These terms are governed by the laws applicable at our principal place
          of business, without regard to conflict-of-law rules. Nothing here
          removes any mandatory consumer protection rights you have under the
          law of your country of residence.
        </p>
      </Section>

      <Section title="11. Contact">
        <p>
          Questions about these terms:{" "}
          <Ext href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Ext>.
        </p>
      </Section>
    </LegalPage>
  );
}
