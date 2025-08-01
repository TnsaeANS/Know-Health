
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { auth } from '@/lib/firebase';
import { getReviewsByUserId } from '@/actions/users';
import AccountClientPage from '@/components/account/AccountClientPage';

// This page must be dynamically rendered to check auth status on every request.
export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const reviews = auth?.currentUser ? await getReviewsByUserId(auth.currentUser.uid) : [];

  return (
    <PageWrapper>
      <PageHeader title="My Account" description="Manage your profile and view your activity." />
      <AccountClientPage initialReviews={reviews} />
    </PageWrapper>
  );
}
