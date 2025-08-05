
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import AccountClientPage from '@/components/account/AccountClientPage';

// The page is now simpler and only renders the client component.
export const dynamic = 'force-dynamic';

export default function AccountPage() {
  return (
    <PageWrapper>
      <PageHeader title="My Account" description="Manage your profile and view your activity." />
      {/* All logic is now handled in the client page for robust auth handling */}
      <AccountClientPage />
    </PageWrapper>
  );
}
