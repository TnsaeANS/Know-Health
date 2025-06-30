import { LoginForm } from "@/components/auth/LoginForm";
import { PageWrapper } from "@/components/ui/PageWrapper";

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <PageWrapper className="flex min-h-[calc(100vh-theme(spacing.32))] flex-col items-center justify-center">
      <LoginForm />
    </PageWrapper>
  );
}
