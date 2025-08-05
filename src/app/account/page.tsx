
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { auth } from '@/lib/firebase';
import { getReviewsByUserId } from '@/actions/users';
import AccountClientPage from '@/components/account/AccountClientPage';
import { getFacilitiesByUserId, getProvidersByUserId } from '@/lib/data';
import { redirect } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';

// This page must be dynamically rendered to check auth status on every request.
export const dynamic = 'force-dynamic';

export default async function AccountPage() {
    
  const getUser = (): Promise<{ uid: string } | null> => {
    return new Promise((resolve) => {
      if (!auth) {
        resolve(null);
        return;
      }
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user as { uid: string } | null);
      });
    });
  };

  const currentUser = await getUser();

  if (!currentUser?.uid) {
    redirect('/login?redirect=/account');
  }
  
  const userId = currentUser.uid;

  // Fetch all data in parallel
  const [reviews, providers, facilities] = await Promise.all([
    getReviewsByUserId(userId),
    getProvidersByUserId(userId),
    getFacilitiesByUserId(userId)
  ]);

  return (
    <PageWrapper>
      <PageHeader title="My Account" description="Manage your profile and view your activity." />
      <AccountClientPage 
        initialReviews={reviews} 
        initialProviders={providers}
        initialFacilities={facilities}
      />
    </PageWrapper>
  );
}
