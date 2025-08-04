"use client";

import { useEffect, useState } from "react";
import { getProviders, getFacilities } from "@/lib/data";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { FacilityCard } from "@/components/facilities/FacilityCard";
import Link from "next/link";
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Group,
  Anchor,
  Divider,
  Paper,
  Stack,
  Loader,
  Center,
} from "@mantine/core";

export function FeaturedSection() {
  const [providers, setProviders] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [allProviders, allFacilities] = await Promise.all([
          getProviders(),
          getFacilities(),
        ]);
        setProviders(allProviders.slice(0, 2));
        setFacilities(allFacilities.slice(0, 2));
      } catch (error) {
        console.error("Error fetching featured data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <Center py="xl">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Paper py="xl" radius="md" shadow="sm" withBorder mt="xl" mb="xl">
      <Container size="lg">
        {/* Section Header */}
        <Stack align="center" gap="sm" mb="xl">
          <Title order={2} fw={700} size="h2" ta="center">
            Featured Healthcare Options
          </Title>
          <Text size="lg" c="dimmed" ta="center" maw={600}>
            Discover some of the top-rated doctors and well-equipped facilities
            in our network.
          </Text>
          <Divider w={80} size="sm" />
        </Stack>

        {/* Top Doctors */}
        <Stack gap="md" mb="xl">
          <Group justify="space-between" mb="md">
            <Title order={3} size="h3" fw={600}>
              Top Doctors
            </Title>
            <Anchor component={Link} href="/providers" underline="hover">
              View All Doctors →
            </Anchor>
          </Group>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </SimpleGrid>
        </Stack>

        {/* Facilities */}
        <Stack gap="md">
          <Group justify="space-between" mb="md">
            <Title order={3} size="h3" fw={600}>
              Leading Facilities
            </Title>
            <Anchor component={Link} href="/facilities" underline="hover">
              View All Facilities →
            </Anchor>
          </Group>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {facilities.map((facility) => (
              <FacilityCard key={facility.id} facility={facility} />
            ))}
          </SimpleGrid>
        </Stack>
      </Container>
    </Paper>
  );
}
