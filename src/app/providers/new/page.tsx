
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { NewProviderForm } from '@/components/providers/NewProviderForm';
import { Card, CardContent } from '@/components/ui/card';

export default function NewProviderPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Add a New Doctor"
        description="Help others find trusted healthcare by adding a new provider."
      />
      <Card>
        <CardContent className="p-6">
            <NewProviderForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
