
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { getProviders } from '@/lib/data';
import { ProvidersList } from '@/components/providers/ProvidersList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function ProvidersPage() {
  const providers = await getProviders();
  
  return (
    <PageWrapper>
      <div className="flex justify-between items-start mb-4">
        <PageHeader
            title="Find a Doctor"
            description="Search for doctors by name, specialty, location, and more."
            className="mb-0"
        />
        <Button asChild className="mt-2">
            <Link href="/providers/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Doctor
            </Link>
        </Button>
      </div>
      <ProvidersList initialProviders={providers} />
    </PageWrapper>
  );
}
