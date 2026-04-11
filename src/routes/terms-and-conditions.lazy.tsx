import { Link } from 'react-router-dom';
import { PolicyContainer } from "../components/common/PolicyContainer";
import { useAuthStore } from "../features/auth/useAuthStore";


export default function TermsAndConditions() {
  const { isAuthenticated } = useAuthStore();
  
  const sections = [
    {
      title: "Acceptance of Terms",
      content: (
        <div className="space-y-4">
          <p>
            By using our Services, you agree to comply with these Terms and all
            applicable laws.
          </p>
          <p>
            Violation of these Terms may result in suspension or termination of
            your account.
          </p>
        </div>
      ),
    },
    {
      title: "Services Provided",
      content: (
        <div className="space-y-4">
          <p>The Nova Digital Marketing Services FZC LLC provides:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Educational courses (Trading, Programming, Graphic Design, etc.)
            </li>
            <li>Trading signals (Forex & Gold)</li>
            <li>Learning resources based on selected packages</li>
          </ul>
          <p>
            Services vary depending on the package chosen by the user. We
            reserve the right to modify or discontinue any service at any time
            without prior notice.
          </p>
        </div>
      ),
    },
    {
      title: "Educational Purpose Only",
      content: (
        <div className="space-y-4">
          <p>
            All content, courses, and trading signals provided are for
            educational purposes only. We do NOT provide financial or investment
            advice.
          </p>
          <p className="font-semibold text-white">
            Signals and examples are intended to demonstrate market analysis and
            trading strategies only and should NOT be considered as direct
            trading instructions.
          </p>
        </div>
      ),
    },
    {
      title: "User Responsibility",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>You are fully responsible for your financial decisions</li>
          <li>You apply any information at your own risk</li>
          <li>We do NOT execute trades or manage accounts on your behalf</li>
        </ul>
      ),
    },
    {
      title: "Trading & Risk Disclaimer",
      content: (
        <div className="space-y-4">
          <p>Trading in financial markets involves a high level of risk.</p>
          <p>By using our Services, you acknowledge that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We do NOT guarantee any profits or returns</li>
            <li>You may lose part or all of your capital</li>
            <li>Past performance is NOT indicative of future results</li>
          </ul>
          <p className="text-brand-blue-light font-bold">
            The Nova Digital Marketing Services FZC LLC is NOT responsible for
            any financial losses.
          </p>
        </div>
      ),
    },
    {
      title: "Payments & Subscription",
      content: (
        <div className="space-y-4">
          <ul className="list-disc pl-6 space-y-2">
            <li>Users can purchase packages based on selected duration</li>
            <li>
              Subscription may be: Manual renewal or Auto-renewal (optional by
              user)
            </li>
          </ul>
          <p>Access to services is granted only after successful payment.</p>
        </div>
      ),
    },
    {
      title: "Refund Policy",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Refund requests are accepted within 7 days only</li>
          <li>After 7 days → no refunds</li>
          <li>Refunds are subject to review and approval</li>
        </ul>
      ),
    },
    {
      title: "Affiliate / Commission Program",
      content: (
        <div className="space-y-4">
          <p>Any registered user may promote our services.</p>
          <p>Commissions are paid only after confirmed purchases.</p>
          <p>
            We reserve the right to reject or cancel commissions in cases of:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fraud</li>
            <li>Misleading promotion</li>
            <li>System abuse</li>
          </ul>
          <p>
            Any unethical behavior may result in account suspension and loss of
            commissions.
          </p>
        </div>
      ),
    },
    {
      title: "User Accounts",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>You are responsible for your account credentials</li>
          <li>Account sharing is allowed for promotional purposes only</li>
          <li>Not allowed for usage without company approval</li>
        </ul>
      ),
    },
    {
      title: "Intellectual Property",
      content: (
        <div className="space-y-4">
          <p>
            All content belongs to The Nova Digital Marketing Services FZC LLC.
          </p>
          <p>
            You may NOT copy, share, resell, or distribute any materials without
            prior written consent.
          </p>
        </div>
      ),
    },
    {
      title: "Code of Conduct",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Engage in illegal or harmful behavior</li>
          <li>Misuse the platform</li>
          <li>Attempt hacking or unauthorized access</li>
        </ul>
      ),
    },
    {
      title: "Limitation of Liability",
      content: (
        <div className="space-y-4">
          <p>All services are provided “as is”.</p>
          <p>The Nova Digital Marketing Services FZC LLC is NOT liable for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Financial losses</li>
            <li>Indirect or consequential damages</li>
          </ul>
          <p>Maximum liability is limited to the amount paid.</p>
        </div>
      ),
    },
    {
      title: "Termination",
      content: (
        <p>
          We reserve the right to suspend or terminate any account that violates
          these Terms.
        </p>
      ),
    },
    {
      title: "Governing Law",
      content: (
        <p>
          These Terms are governed by the laws of the United Arab Emirates
          (UAE).
        </p>
      ),
    },
    {
      title: "Contact Information",
      content: (
        <div className="space-y-4">
          <p>For any inquiries or support:</p>
          <ul className="list-none space-y-2">
            <li>
              <span className="text-brand-blue-light font-bold">Email:</span>{" "}
              info@thenovagroupco.com
            </li>
            <li>
              <span className="text-brand-blue-light font-bold">WhatsApp:</span>{" "}
              +971 582 323 368
            </li>
            <li>
              <span className="text-brand-blue-light font-bold">Support:</span>{" "}
              <Link
                to={isAuthenticated ? "/support" : "/login"}
                search={isAuthenticated ? undefined : { redirect: "/support" }}
                className="underline hover:text-white transition-colors"
              >
                Ticket system
              </Link>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <PolicyContainer
      title="Terms & Conditions"
      effectiveDate="13/02/2026"
      lastUpdated="30/02/2026"
      sections={sections}
    />
  );
}
