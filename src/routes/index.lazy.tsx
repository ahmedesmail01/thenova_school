import { createLazyFileRoute } from "@tanstack/react-router";
import { HeroSection } from "../components/sections/HeroSection";
import { FocusSection } from "../components/sections/FocusSection";
import {
  StorySection,
  EventsSection,
} from "../components/sections/OtherSections";
import OurScannersSection from "../components/sections/OurScannersSection";
import TradeAlertSection from "../components/sections/TradeAlertSection";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FocusSection />
      <StorySection />
      <OurScannersSection />
      <TradeAlertSection />
      <EventsSection />
    </div>
  );
}
