// This should be a server component to fetch initial data
import { getProviderById } from '@/lib/data'; 
import { PageWrapper } from '@/components/ui/PageWrapper';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, Languages, Stethoscope } from 'lucide-react';
import ProviderDetailsClient from '@/components/providers/ProviderDetailsClient';
import { SPECIALTY_ICONS } from '@/lib/constants';

// These pages are dynamic and should not be statically generated.
export const dynamic = 'force-dynamic';

export default async function ProviderProfilePage({
  params: paramsPromise, // Destructure as Promise
}: {
  params: Promise<{ id: string }>; // Type as Promise
}) {
  // Await the params promise
  const { id } = await paramsPromise;
  
  const provider = await getProviderById(id);

  if (!provider) {
    notFound();
  }


  const SpecialtyIcon = SPECIALTY_ICONS[provider.specialty.toLowerCase()] || Stethoscope;
  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.743953258832!2d38.76178331526685!3d8.99473599354146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x84f747402c89283b!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1628527233372!5m2!1sen!2set";
  const displayMapUrl = provider.mapUrl || defaultMapUrl;

  return (
    <PageWrapper>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Photo and Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-xl overflow-hidden">
            <div className="relative w-full aspect-square">
              <Image
                src={provider.imageUrl}
                alt={provider.name}
                fill
                className="object-cover"
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
              <p className="text-sm text-muted-foreground mt-1">View reviews for detailed ratings.</p>
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
          <Tabs defaultValue="overview" className="w-full" key={id}>
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
                       <MapPin className="h-5 w-5 mr-2 text-primary" /> Location Map
                    </h3>
                    <div className="aspect-video bg-muted rounded-md overflow-hidden">
                      <iframe
                        src={displayMapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
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
