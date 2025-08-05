
// This should be a server component to fetch initial data
import { getFacilityById, getProviders } from '@/lib/data';
import { PageWrapper } from '@/components/ui/PageWrapper';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, Building, ListChecks, ConciergeBell, Users } from 'lucide-react';
import FacilityDetailsClient from '@/components/facilities/FacilityDetailsClient';
import { ProviderCard } from '@/components/providers/ProviderCard';
import { FACILITY_TYPE_ICONS } from '@/lib/constants';

// These pages are dynamic and should not be statically generated.
export const dynamic = 'force-dynamic';

export default async function FacilityProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  
  const facility = await getFacilityById(id);
  if (!facility) {
    notFound();
  }
  const TypeIcon = FACILITY_TYPE_ICONS[facility.type.toLowerCase()] || Building;
  
  const allProviders = await getProviders();
  const affiliatedProviders = facility.affiliatedProviderIds
    ? allProviders.filter(provider => facility.affiliatedProviderIds!.includes(provider.id))
    : [];
  
  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.743953258832!2d38.76178331526685!3d8.99473599354146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x84f747402c89283b!2sAddis%20Ababa!5e0!3m2!1sen!2set!4v1628527233372!5m2!1sen!2set";
  const displayMapUrl = facility.mapUrl || defaultMapUrl;


  return (
    <PageWrapper>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Photo and Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-xl overflow-hidden">
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={facility.imageUrl}
                alt={facility.name}
                fill
                className="object-cover"
                priority
                data-ai-hint="hospital building modern"
              />
            </div>
            <CardContent className="p-6 text-center">
              <h1 className="font-headline text-2xl md:text-3xl font-semibold text-foreground">{facility.name}</h1>
              <div className="flex items-center justify-center text-lg text-primary my-2">
                <TypeIcon className="h-5 w-5 mr-2" />
                <span>{facility.type}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">View reviews for detailed ratings.</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Contact & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {facility.contact.address && (
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <span>{facility.contact.address}</span>
                </div>
              )}
              {facility.contact.phone && (
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <a href={`tel:${facility.contact.phone}`} className="hover:underline">{facility.contact.phone}</a>
                </div>
              )}
              {facility.contact.email && (
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <a href={`mailto:${facility.contact.email}`} className="hover:underline">{facility.contact.email}</a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tabs for Details */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full" key={id}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="services">Services & More</TabsTrigger>
              <TabsTrigger value="doctors">Affiliated Doctors</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">About {facility.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed whitespace-pre-line">{facility.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <FacilityDetailsClient facilityId={facility.id} initialReviews={facility.reviews} />
            </TabsContent>
            
            <TabsContent value="services">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">Services & Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {facility.servicesOffered && facility.servicesOffered.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-md text-foreground mb-2 flex items-center">
                        <ListChecks className="h-5 w-5 mr-2 text-primary" /> Services Offered
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {facility.servicesOffered.map(service => (
                          <span key={service} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">{service}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {facility.amenities && facility.amenities.length > 0 && (
                     <div>
                      <h3 className="font-semibold text-md text-foreground mb-2 flex items-center">
                        <ConciergeBell className="h-5 w-5 mr-2 text-primary" /> Amenities
                      </h3>
                       <div className="flex flex-wrap gap-2">
                        {facility.amenities.map(amenity => (
                          <span key={amenity} className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full">{amenity}</span>
                        ))}
                      </div>
                    </div>
                  )}
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

            <TabsContent value="doctors">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" /> Affiliated Doctors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {affiliatedProviders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {affiliatedProviders.map(provider => (
                        <ProviderCard key={provider.id} provider={provider} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No affiliated doctors listed for this facility at the moment.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </PageWrapper>
  );
}
