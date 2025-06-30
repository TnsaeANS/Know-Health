
import { getProviders, getFacilities } from '@/lib/data';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { ProviderCard } from '@/components/providers/ProviderCard';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, Hospital, SearchX } from 'lucide-react';
import type { Provider, Facility } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q.trim() : '';

  if (!query) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
            <SearchX className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Please Enter a Search Term</h1>
            <p className="text-muted-foreground mb-4">
              Go back to the homepage to start a new search.
            </p>
            <Button asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
      </PageWrapper>
    );
  }

  const [allProviders, allFacilities] = await Promise.all([
    getProviders(),
    getFacilities(),
  ]);

  const lowerCaseQuery = query.toLowerCase();

  const filteredProviders = allProviders.filter(provider => 
    provider.name.toLowerCase().includes(lowerCaseQuery) ||
    provider.specialty.toLowerCase().includes(lowerCaseQuery) ||
    provider.location.toLowerCase().includes(lowerCaseQuery) ||
    (provider.bio && provider.bio.toLowerCase().includes(lowerCaseQuery))
  );

  const filteredFacilities = allFacilities.filter(facility =>
    facility.name.toLowerCase().includes(lowerCaseQuery) ||
    facility.type.toLowerCase().includes(lowerCaseQuery) ||
    facility.location.toLowerCase().includes(lowerCaseQuery) ||
    (facility.description && facility.description.toLowerCase().includes(lowerCaseQuery))
  );
  
  const hasResults = filteredProviders.length > 0 || filteredFacilities.length > 0;
  const defaultTab = filteredProviders.length > 0 ? 'doctors' : (filteredFacilities.length > 0 ? 'facilities' : 'doctors');

  return (
    <PageWrapper>
      <PageHeader
        title={`Search Results for "${query}"`}
        description={`Found ${filteredProviders.length} doctor(s) and ${filteredFacilities.length} facility(ies).`}
      />
      
      {hasResults ? (
        <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="doctors" disabled={filteredProviders.length === 0}>
                    <Stethoscope className="mr-2 h-4 w-4" />
                    Doctors ({filteredProviders.length})
                </TabsTrigger>
                <TabsTrigger value="facilities" disabled={filteredFacilities.length === 0}>
                    <Hospital className="mr-2 h-4 w-4" />
                    Facilities ({filteredFacilities.length})
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="doctors" className="mt-6">
                {filteredProviders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredProviders.map(provider => (
                            <ProviderCard key={provider.id} provider={provider} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-10">
                        <p>No doctors found matching your search.</p>
                    </div>
                )}
            </TabsContent>
            
            <TabsContent value="facilities" className="mt-6">
                {filteredFacilities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredFacilities.map(facility => (
                            <FacilityCard key={facility.id} facility={facility} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center text-muted-foreground py-10">
                        <p>No facilities found matching your search.</p>
                    </div>
                )}
            </TabsContent>
        </Tabs>
      ) : (
        <div className="text-center py-12">
            <SearchX className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-semibold mb-2">No Results Found</h1>
            <p className="text-muted-foreground">
                We couldn't find any doctors or facilities matching your search for "{query}".
            </p>
        </div>
      )}
    </PageWrapper>
  );
}
