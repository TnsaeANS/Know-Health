
import { getFacilityById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import EditFacilityFormClient from '@/components/facilities/EditFacilityFormClient';

export default async function EditFacilityPage({
  params: paramsPromise, // Destructure as Promise
}: {
  params: Promise<{ id: string }>; // Type as Promise
}) {
  // Await the params promise
  const { id } = await paramsPromise;
  
  const facility = await getFacilityById(id);
  if (!facility) {
    notFound();
  }

  return (
    <PageWrapper>
      <PageHeader
        title={`Edit ${facility.name}`}
        description="Update the details for this healthcare facility."
      />
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <EditFacilityFormClient facility={facility} />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
