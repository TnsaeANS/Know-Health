import type { Review } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RatingStars } from '@/components/shared/RatingStars';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const timeAgo = review.date ? formatDistanceToNow(new Date(review.date), { addSuffix: true }) : '';

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.userAvatarUrl} alt={review.userName} data-ai-hint="user avatar" />
          <AvatarFallback>{review.userName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{review.userName}</p>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
        <div className="ml-auto">
           <RatingStars rating={review.rating} size={16} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
