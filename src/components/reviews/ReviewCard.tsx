
"use client";

import type { Review } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RatingStars } from '@/components/shared/RatingStars';
import { formatDistanceToNow } from 'date-fns';
import { HeartHandshake, Stethoscope, Clock, ShieldCheck, Building, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useCallback } from 'react';
import ReportReviewDialog from './ReportReviewDialog';
import { useAuth } from '@/context/AuthContext';

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
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  // The key is used to force a re-mount of the dialog, resetting its internal state.
  const [dialogKey, setDialogKey] = useState(() => `dialog-${review.id}`);
  const { user } = useAuth();
  const timeAgo = review.date ? formatDistanceToNow(new Date(review.date), { addSuffix: true }) : '';

  const handleOpenReportDialog = () => {
    // By changing the key each time the dialog is opened, we ensure it's a fresh instance.
    setDialogKey(`dialog-${review.id}-${Date.now()}`);
    setIsReportDialogOpen(true);
  };

  const handleOpenChange = useCallback((open: boolean) => {
    setIsReportDialogOpen(open);
  }, []);

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-start space-x-3 pb-3">
          <Avatar className="h-10 w-10 mt-1">
            <AvatarImage alt={review.userName} data-ai-hint="user avatar" />
            <AvatarFallback>{review.userName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <p className="font-semibold text-foreground">{review.userName}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={handleOpenReportDialog}
              aria-label="Report review"
            >
              <Flag size={16} />
            </Button>
          )}
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
      <ReportReviewDialog 
        key={dialogKey}
        open={isReportDialogOpen} 
        onOpenChange={handleOpenChange}
        reviewId={review.id}
        reviewComment={review.comment}
      />
    </>
  );
}
