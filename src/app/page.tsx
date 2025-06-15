import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { PageWrapper } from "@/components/ui/PageWrapper";

export default function Home() {
  return (
    <PageWrapper className="py-0 md:py-0 lg:py-0"> {/* Adjusted padding since HeroSection has its own */}
      <HeroSection />
      <FeaturedSection />
      {/* TODO: Add other sections like "How it Works", "Testimonials" if needed */}
    </PageWrapper>
  );
}
