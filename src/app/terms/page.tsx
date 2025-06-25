"use client";

import { useState, useEffect } from 'react';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';

export default function TermsPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // Set date on client-side to avoid hydration mismatch
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <PageWrapper>
      <PageHeader
        title="Terms of Service"
        description="Please read these terms carefully before using our service."
      />
      <div className="prose prose-lg max-w-none dark:prose-invert text-foreground">
        {lastUpdated && <p>Last updated: {lastUpdated}</p>}

        <h2>Agreement to Terms</h2>
        <p>
          By using Know Health (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
        </p>

        <h2>Accounts</h2>
        <p>
          When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </p>
        <p>
          You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
        </p>

        <h2>Content</h2>
        <p>
          Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
        </p>
        <p>
          By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.
        </p>

        <h2>User Conduct</h2>
        <p>
          You agree not to use the Service to:
        </p>
        <ul>
          <li>Violate any local, state, national, or international law or regulation.</li>
          <li>Transmit any material that is abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</li>
          <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
        </ul>

        <h2>Intellectual Property</h2>
        <p>
          The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Know Health and its licensors.
        </p>

        <h2>Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          In no event shall Know Health, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
        
        <h2>Disclaimer</h2>
        <p>
          Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
        </p>
        <p>
          Know Health does not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.
        </p>
        <p>
          The information provided on Know Health is for general informational purposes only and does not constitute medical advice. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>

        <h2>Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at terms@knowhealth.com.
        </p>
      </div>
    </PageWrapper>
  );
}
