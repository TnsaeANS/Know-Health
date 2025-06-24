import { PageWrapper } from '@/components/ui/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Users, Target, Eye } from 'lucide-react';

export default function AboutPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="About Know Health"
        description="Connecting you to better healthcare."
      />

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <h2 className="font-headline text-2xl text-foreground mb-4">Our Story</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Know Health was founded with a simple mission: to make healthcare more accessible and transparent for everyone. We believe that finding the right doctor or facility shouldn't be a daunting task. Our platform empowers you with the information you need to make informed decisions about your health.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We are a team of passionate individuals dedicated to leveraging technology to solve real-world health challenges. We are committed to building a trustworthy and user-friendly service that connects patients with qualified healthcare providers seamlessly.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Team working together"
            width={600}
            height={400}
            className="w-full h-auto object-cover"
            data-ai-hint="team collaboration"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center font-headline text-xl">
              <Target className="h-6 w-6 mr-2 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To simplify access to healthcare information and services, enabling individuals to find trusted providers and make informed health decisions.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center font-headline text-xl">
              <Eye className="h-6 w-6 mr-2 text-primary" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be the leading digital health platform, fostering a healthier nation through accessible, reliable, and patient-centric healthcare connections.
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center font-headline text-xl">
              <Users className="h-6 w-6 mr-2 text-primary" />
              Our Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Trust & Transparency</li>
              <li>Patient-Centricity</li>
              <li>Innovation & Excellence</li>
              <li>Accessibility & Inclusivity</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="font-headline text-2xl text-foreground mb-4 text-center">Join Us on Our Journey</h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto">
          We are continuously working to improve Know Health. Your feedback and participation are invaluable as we strive to build a healthier future.
        </p>
      </div>
    </PageWrapper>
  );
}
