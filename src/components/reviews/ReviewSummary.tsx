import type { Facility } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { RatingStars } from '@/components/shared/RatingStars'; // Overall rating removed
import { MapPin, Building } from 'lucide-react';

interface FacilityCardProps {
  facility: Facility;
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const IconComponent = facility.typeIcon || Building;
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={facility.photoUrl}
            alt={facility.name}
            layout="fill"
            objectFit="cover"
            data-ai-hint="hospital building"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl mb-1">{facility.name}</CardTitle>
        <div className="flex items-center text-sm text-primary mb-2">
          <IconComponent className="h-4 w-4 mr-1.5" />
          <span>{facility.type}</span>
        </div>
         <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1.5" />
          <span>{facility.location}</span>
        </div>
        {/* <RatingStars rating={facility.overallRating} size={18} showText /> Removed overall rating */}
        <p className="text-sm text-muted-foreground mt-1">See profile for detailed reviews.</p>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
          {facility.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={`/facilities/${facility.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}