import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { PageWrapper } from "@/components/ui/PageWrapper";

export default function Home() {
  return (
    <PageWrapper className="py-0 md:py-0 lg:py-0"> 
      <HeroSection />
      <ServicesSection />
      <FeaturedSection />
    </PageWrapper>
  );
}
