import { Link } from 'react-router-dom';
import { PolicyContainer } from "../components/common/PolicyContainer";
import { useAuthStore } from "../features/auth/useAuthStore";


export default function PrivacyPolicy() {
  const { isAuthenticated } = useAuthStore();

  const sections = [
    {
      title: "Information We Collect",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-sm tracking-widest">
              Personal Information
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>
                Payment information (processed securely through third-party
                providers)
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-sm tracking-widest">
              Account Information
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Username and password</li>
              <li>Subscription details</li>
              <li>Purchased packages</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-sm tracking-widest">
              Technical Data
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Device type</li>
              <li>Browser type</li>
              <li>Website usage data</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "How We Use Your Information",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide access to courses and services</li>
          <li>Deliver educational content and trading signals</li>
          <li>Process payments and subscriptions</li>
          <li>Improve user experience</li>
          <li>Communicate with you (updates, offers, support)</li>
          <li>Prevent fraud or misuse</li>
        </ul>
      ),
    },
    {
      title: "Data Sharing",
      content: (
        <div className="space-y-4">
          <p>We do NOT sell your personal data.</p>
          <p>We may share your data with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Payment processors (to complete transactions)</li>
            <li>Service providers (hosting, email systems, analytics tools)</li>
            <li>Legal authorities (if required by law)</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Data Security",
      content: (
        <p>
          We implement appropriate security measures to protect your data.
          However, no system is completely secure, and we cannot guarantee
          absolute security.
        </p>
      ),
    },
    {
      title: "Cookies & Tracking",
      content: (
        <div className="space-y-4">
          <p>We may use cookies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Improve website functionality</li>
            <li>Analyze user behavior</li>
            <li>Enhance user experience</li>
          </ul>
          <p>You can disable cookies through your browser settings.</p>
        </div>
      ),
    },
    {
      title: "User Responsibility",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>
            You are responsible for maintaining the confidentiality of your
            account
          </li>
          <li>Do not share your login credentials without permission</li>
        </ul>
      ),
    },
    {
      title: "Data Retention",
      content: (
        <ul className="list-disc pl-6 space-y-2">
          <li>As long as your account is active</li>
          <li>As necessary to comply with legal obligations</li>
        </ul>
      ),
    },
    {
      title: "Your Rights",
      content: (
        <div className="space-y-4">
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Request correction</li>
            <li>Request deletion (where applicable)</li>
          </ul>
          <p>
            To make any request, please contact us through our support channels.
          </p>
        </div>
      ),
    },
    {
      title: "Third-Party Services",
      content: (
        <p>
          Our website may contain links or integrations with third-party
          services. We are not responsible for their privacy practices.
        </p>
      ),
    },
    {
      title: "Children’s Privacy",
      content: (
        <p>
          Our services are educational in nature and may be accessed by users
          under 18. Parental guidance is recommended.
        </p>
      ),
    },
    {
      title: "Changes to This Policy",
      content: (
        <p>
          We may update this Privacy Policy at any time. Updates will be posted
          on this page with the effective date.
        </p>
      ),
    },
    {
      title: "Contact Information",
      content: (
        <div className="space-y-4">
          <p>For any questions or requests:</p>
          <ul className="list-none space-y-2 text-brand-blue-light font-bold">
            <li>
              <span className="text-white font-normal underline">Email:</span>{" "}
              info@thenovagroupco.com
            </li>
            <li>
              <span className="text-white font-normal underline">
                WhatsApp:
              </span>{" "}
              +971 582 323 368
            </li>
            <li>
              <span className="text-white font-normal underline">Support:</span>{" "}
              <Link
                to={isAuthenticated ? "/support" : "/login"}
                search={isAuthenticated ? undefined : { redirect: "/support" }}
                className="underline hover:text-brand-blue-light transition-colors"
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
      title="Privacy Policy"
      effectiveDate="13/02/2026"
      lastUpdated="28/02/2026"
      sections={sections}
    />
  );
}
