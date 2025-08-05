
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { auth } from '@/lib/firebase';
import { getReviewsByUserId } from '@/actions/users';
import AccountClientPage from '@/components/account/AccountClientPage';
import { getFacilitiesByUserId, getProvidersByUserId } from '@/lib/data';
import { redirect } from 'next/navigation';

// This page must be dynamically rendered to check auth status on every request.
export const dynamic = 'force-dynamic';

export default async function AccountPage() {
    
  // The auth object might not be immediately available on the server.
  // The actual redirect logic for non-authenticated users is now handled in AccountClientPage.
  const userId = auth?.currentUser?.uid;

  if (!userId) {
    // This is a server-side guard. If for any reason the user is not available at all,
    // we can redirect. However, the more robust check is on the client.
    // A better pattern is to fetch data only if userId exists, and let the client handle redirects.
    // For now, we will let it pass through and the client will redirect.
  }
  
  // Fetch all data in parallel, but only if we have a user ID.
  const [reviews, providers, facilities] = userId ? await Promise.all([
    getReviewsByUserId(userId),
    getProvidersByUserId(userId),
    getFacilitiesByUserId(userId)
  ]) : [[], [], []];

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
