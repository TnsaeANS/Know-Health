import { getProviderById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import EditProviderFormClient from '@/components/providers/EditProviderFormClient';

// // Correct type for the props - do NOT use a Promise or any imported PageProps here!
// type EditProviderPageProps = {
//   params: {
//     id: string;
//   };
// };

export default async function EditProviderPage({
  params: paramsPromise, // Destructure as paramsPromise
}: {
  params: Promise<{ id: string }>; // The key fix: treat params as a Promise
}) {
  // Await the params promise
  const { id } = await paramsPromise;

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