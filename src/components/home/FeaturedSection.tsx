import { getProviders, getFacilities } from '@/lib/data';
import { ProviderCard } from '@/components/providers/ProviderCard';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Provider, Facility, Review } from '@/lib/types';

// Helper function to calculate average rating for a provider
const calculateProviderAverage = (reviews: Review[]): number => {
  if (!reviews  reviews.length === 0) return 0;
  let totalScore = 0;
  let ratingCount = 0;
  reviews.forEach(review => {
    const ratings = [review.bedsideManner, review.medicalAdherence, review.specialtyCare, review.waitTime];
    ratings.forEach(rating => {
      if (typeof rating === 'number') {
        totalScore += rating;
        ratingCount++;
      }
    });
  });
  return ratingCount > 0 ? totalScore / ratingCount : 0;
};

// Helper function to calculate average rating for a facility
const calculateFacilityAverage = (reviews: Review[]): number => {
    if (!reviews  reviews.length === 0) return 0;
    let totalScore = 0;
    let ratingCount = 0;
    reviews.forEach(review => {
        const ratings = [review.facilityQuality, review.waitTime];
        ratings.forEach(rating => {
            if (typeof rating === 'number') {
                totalScore += rating;
                ratingCount++;
            }
        });
    });
    return ratingCount > 0 ? totalScore / ratingCount : 0;
};

export async function FeaturedSection() {
  const allProviders = await getProviders();
  const allFacilities = await getFacilities();

  // Sort providers by average rating and take the top 3
  const featuredProviders = allProviders
    .map(provider => ({ ...provider, avgRating: calculateProviderAverage(provider.reviews) }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 3);

  // Sort facilities by average rating and take the top 3
  const featuredFacilities = allFacilities
    .map(facility => ({ ...facility, avgRating: calculateFacilityAverage(facility.reviews) }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 3);

  return (
    <section className="py-12 md:py-16 bg-secondary/50 rounded-lg my-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Featured Healthcare Options
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Discover some of the top-rated doctors and well-equipped facilities in our network.
          </p>
        </div>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-2xl font-medium text-foreground">Top Doctors</h3>
            <Button variant="link" asChild>
              <Link href="/providers">View All Doctors &rarr;</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline text-2xl font-medium text-foreground">Leading Facilities</h3>
            <Button variant="link" asChild>
              <Link href="/facilities">View All Facilities &rarr;</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredFacilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}