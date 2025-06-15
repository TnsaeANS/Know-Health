import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactInfoDisplay } from '@/components/contact/ContactInfoDisplay';

export default function ContactPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Contact Us"
        description="Have questions or feedback? Reach out to us."
      />
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <ContactInfoDisplay />
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </PageWrapper>
  );
}
