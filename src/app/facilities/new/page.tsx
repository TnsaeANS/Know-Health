"use client";

import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { NewFacilityForm } from '@/components/facilities/NewFacilityForm';
import { Card, CardContent } from '@/components/ui/card';

export default function NewFacilityPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Add a New Facility"
        description="Contribute to our community by adding a new healthcare facility."
      />
      <Card className="shadow-lg">
        <CardContent className="p-6">
          {/* All auth logic is now handled inside NewFacilityForm */}
          <NewFacilityForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
