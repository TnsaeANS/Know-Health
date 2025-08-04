import {
  Stethoscope,
  Hospital,
  Users,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import {
  Container,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  rem,
} from "@mantine/core";

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
    <div
      style={{
        background: "white",
        padding: rem(24),
        borderRadius: rem(16),
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
        textAlign: "center",
        height: "100%",
      }}
    >
      <ThemeIcon variant="light" size={50} radius={40} mb="md">
        <Icon size={28} strokeWidth={1.8} />
      </ThemeIcon>
      <Text mt="md" mb={10} fw={600} size="lg">
        {title}
      </Text>
      <Text size="md" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </div>
  );
}

export function ServicesSection() {
  const features = SERVICES.map((feature, index) => (
    <Feature {...feature} key={index} />
  ));

  return (
    <Container pt="xl" pb="xl" size="100%">
      <Title
        ta="center"
        fw={700}
        mb="md"
        style={{
          fontFamily: "Outfit, var(--mantine-font-family)",
          fontSize: "36px",
        }}
      >
        Services We Provide
      </Title>
      <Container size="sm" p={0} mb="lg">
        <Text
          size="lg"
          ta="center"
          style={{
            lineHeight: 1.7,
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          At KnowHealth, we make it easy to find the right doctors and
          healthcare facilities through trusted reviews and reliable
          information.
        </Text>
      </Container>
      <SimpleGrid
        mt={60}
        cols={{ base: 1, sm: 2, md: 3, lg: 5 }}
        spacing={{ base: "xl", sm: 40, md: 60 }}
        verticalSpacing={{ base: "xl", sm: 50, md: 80 }}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
}
