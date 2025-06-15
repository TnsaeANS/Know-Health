import { SignupForm } from "@/components/auth/SignupForm";
import { PageWrapper } from "@/components/ui/PageWrapper";

export default function SignupPage() {
  return (
    <PageWrapper className="flex min-h-[calc(100vh-theme(spacing.32))] flex-col items-center justify-center">
      <SignupForm />
    </PageWrapper>
  );
}
