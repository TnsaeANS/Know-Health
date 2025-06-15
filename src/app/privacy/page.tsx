import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';

export default function PrivacyPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Privacy Policy"
        description="Your privacy is important to us."
      />
      <div className="prose prose-lg max-w-none dark:prose-invert text-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2>Introduction</h2>
        <p>
          Welcome to Know Health. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We collect personal information that you voluntarily provide to us when you register on Know Health, express an interest in obtaining information about us or our products and services, when you participate in activities on Know Health or otherwise when you contact us.
        </p>
        <p>
          The personal information that we collect depends on the context of your interactions with us and Know Health, the choices you make and the products and features you use. The personal information we collect may include the following:
        </p>
        <ul>
          <li>Names</li>
          <li>Email addresses</li>
          <li>Usernames</li>
          <li>Passwords</li>
          <li>Contact preferences</li>
          <li>Contact or authentication data</li>
          <li>Other similar information</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>
          We use personal information collected via our Know Health for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
        </p>
        
        <h2>Sharing Your Information</h2>
        <p>
          We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
        </p>

        <h2>Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions or comments about this notice, you may email us at privacy@knowhealth.com or by post to:
        </p>
        <p>
          Know Health<br />
          [Your Company Address Here]<br />
          [City, Country]
        </p>
      </div>
    </PageWrapper>
  );
}
