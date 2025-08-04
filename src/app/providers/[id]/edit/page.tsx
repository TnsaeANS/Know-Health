
import { getProviderById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import EditProviderFormClient from '@/components/providers/EditProviderFormClient';

export default async function EditProviderPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const provider = await getProviderById(id);

  if (!provider) {
    notFound();
  }
  return (
    <PageWrapper>
      <PageHeader
        title={`Edit ${provider.name}`}
        description="Update the details for this healthcare provider."
      />
      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* The client logic is now encapsulated in this component */}
          <EditProviderFormClient provider={provider} />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
