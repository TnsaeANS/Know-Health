import { getProviders, getFacilities } from '@/lib/data';
import { ProviderCard } from '@/components/providers/ProviderCard';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export async function FeaturedSection() {
  const allProviders = await getProviders();
  const allFacilities = await getFacilities();

  // A real app might have a more sophisticated "featured" logic, but for now we'll take the first two.
  const featuredProviders = allProviders.slice(0, 2);
  const featuredFacilities = allFacilities.slice(0, 2);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredFacilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
