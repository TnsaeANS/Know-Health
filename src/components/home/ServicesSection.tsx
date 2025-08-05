import {
  Stethoscope,
  Hospital,
  Users,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SERVICES = [
  {
    icon: Stethoscope,
    title: "Find Trusted Doctors",
    description:
      "Browse verified profiles of doctors across specialties, complete with reviews from real patients.",
  },
  {
    icon: Hospital,
    title: "Discover Hospitals & Clinics",
    description:
      "Explore healthcare facilities near you, including ratings, services, and patient experiences.",
  },
  {
    icon: Users,
    title: "Verified Patient Reviews",
    description:
      "Make informed decisions through transparent feedback from other patients in your community.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted & Secure Platform",
    description:
      "Your data and privacy are always protected, ensuring a safe and reliable healthcare search.",
  },
  {
    icon: MessageSquare,
    title: "24/7 Support",
    description:
      "Get assistance anytime with our dedicated support team, ready to guide you through your search.",
  },
];

interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
}

function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <Card className="text-center shadow-lg hover:shadow-xl transition-shadow h-full">
      <CardHeader className="items-center">
        <div className="p-3 bg-primary/10 rounded-full">
            <Icon className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-lg mt-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

export function ServicesSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-4xl font-semibold text-foreground">
                Services We Provide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                 At KnowHealth, we make it easy to find the right doctors and
                healthcare facilities through trusted reviews and reliable
                information.
            </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {SERVICES.map((feature, index) => (
                <Feature {...feature} key={index} />
            ))}
        </div>
      </div>
    </section>
  );
}
