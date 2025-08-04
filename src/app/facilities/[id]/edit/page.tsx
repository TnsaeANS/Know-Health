import { getFacilityById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import EditFacilityFormClient from '@/components/facilities/EditFacilityFormClient';

export default async function FacilityPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ The key fix: treat params as a Promise
}) {
  const { id } = await params;

  const facility = await getFacilityById(id);
  if (!facility) {
    notFound();
  }

  return (
    <PageWrapper>
      <PageHeader
        title={`View ${facility.name}`}
        description="Details for this healthcare facility."
      />
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <EditFacilityFormClient facility={facility} />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
