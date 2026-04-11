import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { PolicyContainer } from "../components/common/PolicyContainer";
import { useAuthStore } from "../features/auth/useAuthStore";

export const Route = createLazyFileRoute("/disclaimer")({
  component: Disclaimer,
});

function Disclaimer() {
  const { isAuthenticated } = useAuthStore();

  const sections = [
    {
      title: "No Financial Advice",
      content: (
        <div className="space-y-4">
          <p>
            The Nova Digital Marketing Services FZC LLC does NOT provide
            financial, investment, or trading advice.
          </p>
          <p>
            All content is intended solely to educate users about market
            concepts, trading strategies, and analysis techniques.
          </p>
          <p>
            Nothing on this website should be considered as a recommendation to
            buy, sell, or trade any financial instrument.
          </p>
        </div>
      ),
    },
    {
      title: "Educational Purpose Only",
      content: (
        <div className="space-y-4">
          <p>
            All trading signals and examples are provided strictly for
            educational purposes only.
          </p>
          <p>
            They are intended to demonstrate how markets move and how strategies
            are applied, not to serve as direct trading instructions.
          </p>
        </div>
      ),
    },
    {
      title: "Risk Warning",
      content: (
        <div className="space-y-4">
          <p>
            Trading in financial markets (including Forex and Gold) involves a
            high level of risk.
          </p>
          <p>You acknowledge that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You may lose part or all of your invested capital</li>
            <li>Trading is not suitable for everyone</li>
            <li>Market conditions can change rapidly</li>
          </ul>
        </div>
      ),
    },
    {
      title: "No Profit Guarantee",
      content: (
        <div className="space-y-4">
          <p>We do NOT guarantee:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Profits</li>
            <li>Income</li>
            <li>Successful trades</li>
          </ul>
          <p>Past performance is NOT indicative of future results.</p>
        </div>
      ),
    },
    {
      title: "User Responsibility",
      content: (
        <div className="space-y-4">
          <p>By using our Services, you agree that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are fully responsible for your trading decisions</li>
            <li>You understand all risks involved</li>
            <li>You use the information at your own risk</li>
          </ul>
        </div>
      ),
    },
    {
      title: "No Liability",
      content: (
        <div className="space-y-4">
          <p>
            The Nova Digital Marketing Services FZC LLC shall NOT be held liable
            for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Any financial losses</li>
            <li>Any direct or indirect damages</li>
            <li>Any decisions made based on our content</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Third-Party Platforms",
      content: (
        <p>
          We are not responsible for any third-party platforms, brokers, or
          tools used by users. All interactions with third parties are at your
          own risk.
        </p>
      ),
    },
    {
      title: "Acceptance of Disclaimer",
      content: (
        <p>
          By using our website or Services, you confirm that you have read,
          understood, and agreed to this Disclaimer.
        </p>
      ),
    },
    {
      title: "Contact Information",
      content: (
        <div className="space-y-4">
          <p>For any inquiries:</p>
          <ul className="list-none space-y-2 text-brand-blue-light font-bold">
            <li>
              <span className="text-white font-normal underline">Email:</span>{" "}
              info@thenovagroupco.com
            </li>
            <li>
              <span className="text-white font-normal underline">
                WhatsApp:
              </span>{" "}
              +971 55 456 2343
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
      title="Disclaimer"
      effectiveDate="13/02/2026"
      lastUpdated="28/02/2026"
      sections={sections}
    />
  );
}
