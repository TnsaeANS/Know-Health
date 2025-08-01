
"use client";
import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getFacilityById } from '@/lib/data';
import type { Facility } from '@/lib/types';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { NewFacilityForm } from '@/components/facilities/NewFacilityForm';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditFacilityPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(`/login?redirect=/facilities/${params.id}/edit`);
      return;
    }

    getFacilityById(params.id)
      .then(fetchedFacility => {
        if (!fetchedFacility) {
          setError('Facility not found.');
          return;
        }
        if (fetchedFacility.submitted_by_user_id !== user.id) {
          setError('You do not have permission to edit this facility.');
          return;
        }
        setFacility(fetchedFacility);
      })
      .catch(() => setError('Failed to load facility data.'))
      .finally(() => setLoading(false));

  }, [params.id, user, authLoading, router]);

  if (loading || authLoading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.32))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </PageWrapper>
    );
  }

  if (error) {
     return (
      <PageWrapper className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.32))] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button asChild><Link href="/account">Go to My Account</Link></Button>
      </PageWrapper>
    );
  }

  if (!facility) {
    return notFound();
  }

  return (
    <PageWrapper>
      <PageHeader
        title={`Edit ${facility.name}`}
        description="Update the details for this healthcare facility."
      />
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <NewFacilityForm existingFacility={facility} />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
