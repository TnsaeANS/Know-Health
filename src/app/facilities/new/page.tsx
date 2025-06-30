
"use client";

import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { NewFacilityForm } from '@/components/facilities/NewFacilityForm';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewFacilityPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/facilities/new');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.32))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </PageWrapper>
    );
  }

  if (!user) {
    // Fallback UI in case redirect takes time or fails.
    return (
      <PageWrapper className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.32))] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You must be logged in to add a new facility.</p>
        <Button asChild><Link href="/login?redirect=/facilities/new">Login</Link></Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Add a New Facility"
        description="Contribute to our community by adding a new healthcare facility."
      />
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <NewFacilityForm />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
