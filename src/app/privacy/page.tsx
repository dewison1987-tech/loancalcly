import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets, Ext } from "@/components/LegalPage";
import { CONTACT_EMAIL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy policy",
  description:
    "How LoanCalcly handles data: what we collect, how cookies and third-party advertising work, and how you can opt out of personalised advertising.",
});

const LAST_UPDATED = "September 25, 2026";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      updated={LAST_UPDATED}
      intro={
        <p>
          This policy explains what happens to information when you use
          LoanCalcly. The short version: the calculator runs entirely in your
          browser, we do not ask you for personal details, and the only data
          collected is ordinary analytics and advertising data described below.
        </p>
      }
    >
      <Section title="1. What we collect">
        <p>
          <strong>Calculator inputs.</strong> The loan amount, interest rate and
          term you enter are processed in your browser. They are not
          transmitted to our servers and we do not store them.
        </p>
        <p>
          <strong>We do not require an account.</strong> There is no signup, no
          login and no form that asks for your name, address, phone number,
          income or Social Security number. If a site claiming to be us asks you
          for those things, it is not us.
        </p>
        <p>
          <strong>Automatically collected technical data.</strong> Like most
          websites, our hosting provider and analytics tools record standard
          technical information when a page is served: IP address, browser and
          device type, referring URL, pages viewed and timestamps. This is used
          in aggregate to understand traffic and keep the site working.
        </p>
      </Section>

      <Section title="2. Cookies and similar technologies">
        <p>
          Cookies are small text files placed on your device. This site and its
          third-party partners use them for three purposes:
        </p>
        <Bullets
          items={[
            <>
              <strong>Functionality.</strong> Remembering basic preferences so
              the site behaves consistently between pages.
            </>,
            <>
              <strong>Analytics.</strong> Understanding, in aggregate, which
              pages are useful and how visitors reach them.
            </>,
            <>
              <strong>Advertising.</strong> Serving ads and, where you have
              consented, making those ads more relevant.
            </>,
          ]}
        />
        <p>
          You can block or delete cookies at any time through your browser
          settings. Blocking cookies will not stop the calculator from working
          — the calculation is client-side and does not depend on them.
        </p>
      </Section>

      <Section title="3. Third-party advertising (including Google)">
        <p>
          We may display advertising served by third-party vendors, including
          Google. You should know the following, because it is required to be
          disclosed:
        </p>
        <Bullets
          items={[
            <>
              Third-party vendors, <strong>including Google</strong>, use
              cookies to serve ads based on your prior visits to this website
              and/or other websites on the internet.
            </>,
            <>
              Google&apos;s use of advertising cookies enables it and its partners to
              serve ads to you based on your visits to this site and/or other
              sites on the internet.
            </>,
            <>
              You may opt out of personalised advertising by visiting{" "}
              <Ext href="https://www.google.com/settings/ads">
                Google Ads Settings
              </Ext>
              .
            </>,
            <>
              You can also opt out of some third-party vendors&apos; use of cookies
              for personalised advertising at{" "}
              <Ext href="https://www.aboutads.info/choices/">
                www.aboutads.info
              </Ext>
              , and — if you are in the EU, UK or Switzerland — at{" "}
              <Ext href="https://www.youronlinechoices.com/">
                Your Online Choices
              </Ext>
              .
            </>,
            <>
              Details of how Google uses information from sites that use its
              services are published at{" "}
              <Ext href="https://policies.google.com/technologies/partner-sites">
                policies.google.com/technologies/partner-sites
              </Ext>
              .
            </>,
          ]}
        />
        <p>
          Advertisers may also use non-cookie technologies such as web beacons
          or device identifiers. We do not control third-party vendors&apos; data
          practices; their own privacy policies govern them.
        </p>
        <p>
          Where required by law, advertising cookies that rely on consent are
          only set after you consent, and you can change or withdraw that
          consent at any time.
        </p>
      </Section>

      <Section title="4. Analytics">
        <p>
          We use Google Analytics 4 to understand aggregate traffic patterns
          such as which pages are visited and roughly where visitors come from.
          We do not use analytics to identify you personally, and we do not
          combine analytics data with advertising data to build individual
          profiles. Google describes its analytics data practices at{" "}
          <Ext href="https://policies.google.com/technologies/partner-sites">
            policies.google.com/technologies/partner-sites
          </Ext>
          .
        </p>
      </Section>

      <Section title="5. Email you send us">
        <p>
          If you email us, we receive your address and whatever you write. We
          use it only to reply and to fix whatever you reported. We do not add
          you to a mailing list and we do not sell or rent it to anyone.
        </p>
      </Section>

      <Section title="6. Your rights (GDPR / UK GDPR)">
        <p>
          If you are in the European Economic Area, the United Kingdom or
          Switzerland, you have the right to:
        </p>
        <Bullets
          items={[
            "access the personal data we hold about you (in practice, this is usually limited to correspondence you have sent us);",
            "request correction or deletion of that data;",
            "object to or restrict certain processing, including processing for direct marketing;",
            "withdraw consent for cookie-based advertising at any time, without affecting the lawfulness of processing before withdrawal;",
            "lodge a complaint with your local data protection authority.",
          ]}
        />
        <p>
          Our legal bases for processing are consent (for advertising and
          analytics cookies) and legitimate interests (for keeping the site
          secure and working). To exercise any of these rights, email{" "}
          <Ext href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Ext>.
        </p>
      </Section>

      <Section title="7. Your rights (California — CCPA / CPRA)">
        <p>
          California residents have the right to know what personal information
          is collected, to request its deletion, to opt out of the sale or
          sharing of personal information, and not to be discriminated against
          for exercising those rights. We do not sell personal information. To
          make a request, email{" "}
          <Ext href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Ext>.
        </p>
      </Section>

      <Section title="8. Children's privacy">
        <p>
          This site is intended for adults making borrowing decisions and is not
          directed at children under 13 (or the equivalent minimum age in your
          jurisdiction). We do not knowingly collect personal information from
          children. If you believe a child has provided us information, contact
          us and we will delete it.
        </p>
      </Section>

      <Section title="9. Data retention and security">
        <p>
          Because we do not collect account data, there is very little to
          retain. Aggregate analytics data is retained according to our
          analytics configuration. Correspondence is kept only as long as
          needed to resolve the matter. We use HTTPS across the site and take
          reasonable technical measures to protect it, but no transmission over
          the internet can be guaranteed to be perfectly secure.
        </p>
      </Section>

      <Section title="10. External links">
        <p>
          Pages on this site may link to third-party websites, including
          lenders and financial-information resources. We are not responsible
          for their content or privacy practices. Read their policies before
          providing them with personal information.
        </p>
      </Section>

      <Section title="11. Changes to this policy">
        <p>
          If this policy changes materially — particularly anything affecting
          cookie or advertising disclosures — we will update the &ldquo;last
          updated&rdquo; date at the top of this page. Continued use of the site
          after a change means you accept the updated policy.
        </p>
      </Section>

      <Section title="12. Contact">
        <p>
          Privacy questions and data requests:{" "}
          <Ext href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Ext>.
          See also our{" "}
          <Link
            href="/terms"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            Terms of service
          </Link>{" "}
          and{" "}
          <Link
            href="/disclaimer"
            className="text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
          >
            Disclaimer
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
