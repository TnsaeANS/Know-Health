
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import type { Facility } from '@/lib/types';
import { NewFacilityForm } from '@/components/facilities/NewFacilityForm';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PageWrapper } from '../ui/PageWrapper';

// This is a new Client Component to handle the client-side logic
export default function EditFacilityFormClient({ facility }: { facility: Facility }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/facilities/${facility.id}/edit`);
    }
  }, [facility.id, user, authLoading, router]);

  if (authLoading) {
    return (
      <PageWrapper className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </PageWrapper>
    );
  }

  // Final authorization check on the client
  if (user && facility.submitted_by_user_id !== user.id) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You do not have permission to edit this facility.</p>
        <Button asChild><Link href="/account">Go to My Account</Link></Button>
      </div>
    );
  }

  return <NewFacilityForm existingFacility={facility} />;
}
