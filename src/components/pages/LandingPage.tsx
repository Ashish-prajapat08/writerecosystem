import { AnimatedBackgroundSection } from "../sections/animated-background";
import { EbookSection } from "../sections/ebooks";
import { FeaturesSection } from "../sections/features";
import { JobPortalSection } from "../sections/job-portal";
import { MissionSection } from "../sections/mission";
import { Footerdemo } from "../ui/footer-section";
import { HeroSection } from "../ui/hero-odyssey";


const LandingPage = () => {
  return (
    <div className="flex flex-col w-full ">
      <HeroSection />
      <MissionSection />
      <FeaturesSection />
      <EbookSection />
      <JobPortalSection/>
      <AnimatedBackgroundSection/>
      <Footerdemo />
    </div>
  );
};

export { LandingPage };