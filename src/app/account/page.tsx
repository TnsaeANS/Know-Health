
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { auth } from '@/lib/firebase';
import { getReviewsByUserId } from '@/actions/users';
import AccountClientPage from '@/components/account/AccountClientPage';
import { getFacilitiesByUserId, getProvidersByUserId } from '@/lib/data';

// This page must be dynamically rendered to check auth status on every request.
export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const userId = auth?.currentUser?.uid;

  if (!userId) {
    // This will be caught by the client page, but as a safeguard:
    return (
      <PageWrapper>
        <PageHeader title="My Account" description="Manage your profile and view your activity." />
        <AccountClientPage initialReviews={[]} initialProviders={[]} initialFacilities={[]} />
      </PageWrapper>
    );
  }

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
