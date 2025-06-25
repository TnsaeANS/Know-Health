
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { getFacilities } from '@/lib/data';
import { FacilitiesList } from '@/components/facilities/FacilitiesList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function FacilitiesPage() {
  const facilities = await getFacilities();
  
  return (
    <PageWrapper>
      <div className="flex justify-between items-start mb-4">
        <PageHeader
          title="Find a Facility"
          description="Search for hospitals, clinics, and other healthcare facilities."
          className="mb-0"
        />
        <Button asChild className="mt-2">
          <Link href="/facilities/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Facility
          </Link>
        </Button>
      </div>
      <FacilitiesList initialFacilities={facilities} />
    </PageWrapper>
  );
}
