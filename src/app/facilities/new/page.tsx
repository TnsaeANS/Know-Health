
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { NewFacilityForm } from '@/components/facilities/NewFacilityForm';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';

export default function NewFacilityPage() {
  // Although the form might not require auth to submit, 
  // this pattern is a good way to encourage user sign-in.
  // For now, we allow anonymous submission.

  return (
    <PageWrapper>
      <PageHeader
        title="Add a New Facility"
        description="Contribute to our community by adding a new healthcare facility."
      />
      <Card>
        <CardContent className="p-6">
          <NewFacilityForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
