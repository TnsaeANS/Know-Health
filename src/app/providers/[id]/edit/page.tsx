
"use client";
import { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProviderById } from '@/lib/data';
import type { Provider } from '@/lib/types';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { NewProviderForm } from '@/components/providers/NewProviderForm';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditProviderPage({ params }: { params: { id: string } }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(`/login?redirect=/providers/${params.id}/edit`);
      return;
    }

    getProviderById(params.id)
      .then(fetchedProvider => {
        if (!fetchedProvider) {
          setError('Provider not found.');
          return;
        }
        if (fetchedProvider.submitted_by_user_id !== user.id) {
          setError('You do not have permission to edit this provider.');
          return;
        }
        setProvider(fetchedProvider);
      })
      .catch(() => setError('Failed to load provider data.'))
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
  
  if (!provider) {
    // This will be caught by notFound() in a server component, but client-side needs a return
    return notFound();
  }

  return (
    <PageWrapper>
      <PageHeader
        title={`Edit ${provider.name}`}
        description="Update the details for this healthcare provider."
      />
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <NewProviderForm existingProvider={provider} />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

