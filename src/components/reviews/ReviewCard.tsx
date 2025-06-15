
import type { Review } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RatingStars } from '@/components/shared/RatingStars'; // Still useful for individual criteria
import { formatDistanceToNow } from 'date-fns';
import { HeartHandshake, Stethoscope, Clock, ShieldCheck, Building } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

const CriterionDisplay: React.FC<{ label: string; rating?: number; icon?: React.ReactNode }> = ({ label, rating, icon }) => {
  if (rating === undefined || rating === 0) return null;
  return (
    <div className="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-b-0">
      <div className="flex items-center text-muted-foreground">
        {icon && <span className="mr-2">{icon}</span>}
        {label}:
      </div>
      <RatingStars rating={rating} size={14} />
    </div>
  );
};

export function ReviewCard({ review }: ReviewCardProps) {
  const timeAgo = review.date ? formatDistanceToNow(new Date(review.date), { addSuffix: true }) : '';

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start space-x-3 pb-3">
        <Avatar className="h-10 w-10 mt-1">
          <AvatarImage src={review.userAvatarUrl} alt={review.userName} data-ai-hint="user avatar" />
          <AvatarFallback>{review.userName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="font-semibold text-foreground">{review.userName}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </CardHeader>
      <CardContent>
        {review.comment && (
          <p className="text-sm text-foreground leading-relaxed mb-4 whitespace-pre-line">{review.comment}</p>
        )}
        
        <div className="space-y-1 mt-2 border-t pt-3">
            <CriterionDisplay label="Bedside Manner" rating={review.bedsideManner} icon={<HeartHandshake size={16} />} />
            <CriterionDisplay label="Medical Adherence" rating={review.medicalAdherence} icon={<Stethoscope size={16} />} />
            <CriterionDisplay label="Specialty Care" rating={review.specialtyCare} icon={<ShieldCheck size={16} />} />
            <CriterionDisplay label="Facility Quality" rating={review.facilityQuality} icon={<Building size={16} />} />
            <CriterionDisplay label="Wait Time" rating={review.waitTime} icon={<Clock size={16} />} />
        </div>
      </CardContent>
    </Card>
  );
}

