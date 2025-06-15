// This should be a server component to fetch initial data
import { getProviderById } from '@/lib/mockData'; // Will be replaced by actual data fetching
import { PageWrapper } from '@/components/ui/PageWrapper';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { RatingStars } from '@/components/shared/RatingStars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, BriefcaseMedical, Languages, ShieldCheck, Stethoscope } from 'lucide-react';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewSummary } from '@/components/reviews/ReviewSummary';
import ProviderDetailsClient from '@/components/providers/ProviderDetailsClient'; // Client component for summary + form

export async function generateStaticParams() {
  // In a real app, fetch all provider IDs
  // For now, using mockData IDs
  const { mockProviders } = await import('@/lib/mockData');
  return mockProviders.map(provider => ({ id: provider.id }));
}


export default async function ProviderProfilePage({ params }: { params: { id: string } }) {
  const provider = getProviderById(params.id); // In real app, await fetchProviderById(params.id);

  if (!provider) {
    notFound();
  }
  
  const SpecialtyIcon = provider.specialtyIcon || Stethoscope;

  return (
    <PageWrapper>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Photo and Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-xl overflow-hidden">
            <div className="relative w-full aspect-square">
              <Image
                src={provider.photoUrl}
                alt={provider.name}
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint="doctor portrait professional"
              />
            </div>
            <CardContent className="p-6 text-center">
              <h1 className="font-headline text-2xl md:text-3xl font-semibold text-foreground">{provider.name}</h1>
              <div className="flex items-center justify-center text-lg text-primary my-2">
                <SpecialtyIcon className="h-5 w-5 mr-2" />
                <span>{provider.specialty}</span>
              </div>
              <RatingStars rating={provider.overallRating} size={22} showText className="justify-center" />
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {provider.contact.address && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <span>{provider.contact.address}</span>
                </div>
              )}
              {provider.contact.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <a href={`tel:${provider.contact.phone}`} className="hover:underline">{provider.contact.phone}</a>
                </div>
              )}
              {provider.contact.email && (
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <a href={`mailto:${provider.contact.email}`} className="hover:underline">{provider.contact.email}</a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tabs for Details */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="details">More Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">About {provider.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">{provider.bio}</p>
                  {provider.qualifications && provider.qualifications.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-md text-foreground mb-1">Qualifications:</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        {provider.qualifications.map((q, i) => <li key={i}>{q}</li>)}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              {/* Client component to handle review submission and AI summary display */}
              <ProviderDetailsClient providerId={provider.id} initialReviews={provider.reviews} />
            </TabsContent>
            
            <TabsContent value="details">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-md text-foreground mb-2 flex items-center">
                      <Languages className="h-5 w-5 mr-2 text-primary" /> Languages Spoken
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {provider.languagesSpoken.map(lang => (
                        <span key={lang} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">{lang}</span>
                      ))}
                    </div>
                  </div>
                   <div>
                    <h3 className="font-semibold text-md text-foreground mb-2 flex items-center">
                      <ShieldCheck className="h-5 w-5 mr-2 text-primary" /> Insurances Accepted
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {provider.insurancesAccepted.map(ins => (
                        <span key={ins} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">{ins}</span>
                      ))}
                      {provider.insurancesAccepted.length === 0 && <p className="text-sm text-muted-foreground">Contact provider for insurance details.</p>}
                    </div>
                  </div>
                  {/* Placeholder for map */}
                  <div>
                    <h3 className="font-semibold text-md text-foreground mb-2 flex items-center">
                       <MapPin className="h-5 w-5 mr-2 text-primary" /> Location Map
                    </h3>
                     <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Map placeholder for {provider.contact.address || provider.location}</p>
                     </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageWrapper>
  );
}
