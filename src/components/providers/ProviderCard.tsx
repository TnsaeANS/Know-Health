
import type { Provider, Review } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/shared/RatingStars';
import { MapPin, Stethoscope, HeartHandshake, ShieldCheck, Clock, MessageSquarePlus } from 'lucide-react';
import { SPECIALTY_ICONS } from '@/lib/constants';

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const IconComponent = SPECIALTY_ICONS[provider.specialty.toLowerCase()] || Stethoscope;

  const calculateAverageRating = (reviews: Provider['reviews'], criterion: keyof Review) => {
    const validReviews = reviews.filter(review => typeof review[criterion] === 'number' && (review[criterion] as number) > 0);
    if (validReviews.length === 0) return 0;
    const totalRating = validReviews.reduce((sum, review) => sum + (review[criterion] as number), 0);
    return totalRating / validReviews.length;
  };

  const avgBedsideManner = calculateAverageRating(provider.reviews, 'bedsideManner');
  const avgMedicalAdherence = calculateAverageRating(provider.reviews, 'medicalAdherence');
  const avgSpecialtyCare = calculateAverageRating(provider.reviews, 'specialtyCare');
  const avgWaitTime = calculateAverageRating(provider.reviews, 'waitTime');

  const hasRatings = avgBedsideManner > 0 || avgMedicalAdherence > 0 || avgSpecialtyCare > 0 || avgWaitTime > 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={provider.photoUrl}
            alt={provider.name}
            fill
            className="object-cover"
            data-ai-hint="doctor portrait"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl mb-1">{provider.name}</CardTitle>
        <div className="flex items-center text-sm text-primary mb-2">
          <IconComponent className="h-4 w-4 mr-1.5" />
          <span>{provider.specialty}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1.5" />
          <span>{provider.location}</span>
        </div>

        {/* Average Ratings Section */}
        {hasRatings && (
          <div className="my-3 space-y-1.5 border-t border-b border-border/50 py-2.5">
            {avgBedsideManner > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center"><HeartHandshake className="mr-1.5 h-3.5 w-3.5" />Bedside Manner:</span>
                <RatingStars rating={avgBedsideManner} size={12} showText />
              </div>
            )}
            {avgMedicalAdherence > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center"><Stethoscope className="mr-1.5 h-3.5 w-3.5" />Medical Adherence:</span>
                <RatingStars rating={avgMedicalAdherence} size={12} showText />
              </div>
            )}
            {avgSpecialtyCare > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center"><ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Specialty Care:</span>
                <RatingStars rating={avgSpecialtyCare} size={12} showText />
              </div>
            )}
            {avgWaitTime > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground flex items-center"><Clock className="mr-1.5 h-3.5 w-3.5" />Wait Time:</span>
                <RatingStars rating={avgWaitTime} size={12} showText />
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-muted-foreground mt-1">See profile for detailed reviews.</p>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
          {provider.bio}
        </p>
      </CardContent>
      <CardFooter className="p-4 border-t grid grid-cols-2 gap-2">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/providers/${provider.id}`}>View Profile</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
            <Link href={`/providers/${provider.id}#leave-review`}>
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Leave a review
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
