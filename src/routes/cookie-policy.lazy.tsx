import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { PolicyContainer } from "../components/common/PolicyContainer";
import { useAuthStore } from "../features/auth/useAuthStore";

export const Route = createLazyFileRoute("/cookie-policy")({
  component: CookiePolicy,
});

function CookiePolicy() {
  const { isAuthenticated } = useAuthStore();

  const sections = [
    {
      title: "What Are Cookies",
      content: (
        <p>
          Cookies are small text files stored on your device (computer, mobile,
          or tablet) when you visit a website. They help improve your experience
          and enable certain website functionalities.
        </p>
      ),
    },
    {
      title: "How We Use Cookies",
      content: (
        <div className="space-y-4">
          <p>We use cookies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ensure proper website functionality</li>
            <li>Remember user preferences and settings</li>
            <li>Improve website performance</li>
            <li>Analyze traffic and user behavior</li>
            <li>Enhance user experience</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Types of Cookies We Use",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-sm tracking-widest">
              Essential Cookies
            </h3>
            <p>
              Necessary for the website to function properly (e.g., login,
              security).
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-sm tracking-widest">
              Performance & Analytics Cookies
            </h3>
            <p>
              Used to understand how users interact with the website and improve
              performance.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-sm tracking-widest">
              Functional Cookies
            </h3>
            <p>Remember your preferences such as language and settings.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-white uppercase text-sm tracking-widest">
              Marketing Cookies
            </h3>
            <p>Used to deliver relevant ads and promotional content.</p>
          </div>
        </div>
      ),
    },
    {
      title: "Third-Party Cookies",
      content: (
        <p>
          We may use third-party services (such as analytics or payment
          providers) that may place cookies on your device. We do not control
          these cookies.
        </p>
      ),
    },
    {
      title: "Managing Cookies",
      content: (
        <div className="space-y-4">
          <p>
            You can control or disable cookies through your browser settings.
          </p>
          <p className="text-brand-blue-light italic">
            Please note: Disabling cookies may affect website functionality and
            your user experience.
          </p>
        </div>
      ),
    },
    {
      title: "Consent",
      content: (
        <p>
          By continuing to use our website, you agree to the use of cookies in
          accordance with this policy.
        </p>
      ),
    },
    {
      title: "Changes to This Policy",
      content: (
        <p>
          We may update this Cookie Policy at any time. Any changes will be
          posted on this page with the updated date.
        </p>
      ),
    },
    {
      title: "Contact Information",
      content: (
        <div className="space-y-4">
          <p>For any questions:</p>
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
                className="underline hover:text-text-secondary transition-colors"
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
      title="Cookie Policy"
      effectiveDate="13/02/2026"
      lastUpdated="28/02/2026"
      sections={sections}
    />
  );
}
