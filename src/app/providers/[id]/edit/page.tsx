
import { getProviderById } from '@/lib/data'; 
import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import EditProviderFormClient from '@/components/providers/EditProviderFormClient';

// This is now a Server Component responsible for data fetching
export default async function EditProviderPage({ params }: { params: { id: string } }) {
    const provider = await getProviderById(params.id);

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
