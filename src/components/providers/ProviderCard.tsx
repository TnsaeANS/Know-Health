
import type { Provider } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { RatingStars } from '@/components/shared/RatingStars'; // Overall rating removed
import { MapPin, Stethoscope } from 'lucide-react';

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const IconComponent = provider.specialtyIcon || Stethoscope;
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={provider.photoUrl}
            alt={provider.name}
            layout="fill"
            objectFit="cover"
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
        {/* <RatingStars rating={provider.overallRating} size={18} showText /> Removed overall rating */}
        <p className="text-sm text-muted-foreground mt-1">See profile for detailed reviews.</p>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
          {provider.bio}
        </p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/providers/${provider.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

