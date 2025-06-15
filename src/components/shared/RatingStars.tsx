import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  showText?: boolean;
}

export function RatingStars({
  rating,
  totalStars = 5,
  size = 20,
  className,
  showText = false,
}: RatingStarsProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="hsl(var(--primary))" strokeWidth={0} style={{ width: size, height: size }} className="text-primary" />
      ))}
      {hasHalfStar && <StarHalf key="half" fill="hsl(var(--primary))" strokeWidth={0} style={{ width: size, height: size }} className="text-primary" />}
      {[...Array(emptyStars < 0 ? 0 : emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} fill="hsl(var(--muted))" strokeWidth={0} style={{ width: size, height: size }} className="text-muted-foreground opacity-50" />
      ))}
      {showText && <span className="ml-2 text-sm text-muted-foreground">({rating.toFixed(1)})</span>}
    </div>
  );
}
