
"use client";

import type { Review } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { RatingStars } from '@/components/shared/RatingStars';
import { formatDistanceToNow } from 'date-fns';
import { HeartHandshake, Stethoscope, Clock, ShieldCheck, Building, Flag, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useCallback } from 'react';
import ReportReviewDialog from './ReportReviewDialog';
import { useAuth } from '@/context/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { deleteReviewAction } from '@/actions/reviews';
import { ReviewForm } from './ReviewForm';


interface ReviewCardProps {
  review: Review;
  onReviewDeleted?: (reviewId: string) => void;
  onReviewUpdated?: (updatedReview: Review) => void;
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

export function ReviewCard({ review, onReviewDeleted, onReviewUpdated }: ReviewCardProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dialogKey, setDialogKey] = useState(`dialog-${review.id}`);
  const { user } = useAuth();
  const { toast } = useToast();
  const timeAgo = review.date ? formatDistanceToNow(new Date(review.date), { addSuffix: true }) : '';
  
  const isAuthor = user?.id === review.userId;
  const isUnderReview = review.status === 'under_review';

  const handleOpenReportDialog = useCallback(() => {
    setDialogKey(`dialog-${review.id}-${Date.now()}`);
    setIsReportDialogOpen(true);
  }, [review.id]);
  
  const handleReportDialogChange = useCallback((open: boolean) => {
    setIsReportDialogOpen(open);
  }, []);

  const handleDelete = async () => {
    if (!isAuthor) return;
    setIsDeleting(true);
    const result = await deleteReviewAction(review.id, user.id);
    setIsDeleting(false);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      if (onReviewDeleted) {
        onReviewDeleted(review.id);
      }
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
  };

  const handleReviewUpdated = (updatedReview: Review) => {
    setIsEditing(false);
    if (onReviewUpdated) {
        onReviewUpdated(updatedReview);
    }
  };
  
  if (isEditing) {
    return (
        <ReviewForm
            entityId={review.providerId || review.facilityId!}
            entityType={review.providerId ? 'provider' : 'facility'}
            existingReview={review}
            onReviewSubmitted={handleReviewUpdated}
            onCancel={() => setIsEditing(false)}
        />
    )
  }

  return (
    <>
      <Card className={`shadow-sm ${isUnderReview ? 'bg-yellow-50 border-yellow-200' : ''}`}>
        <CardHeader className="flex flex-row items-start space-x-3 pb-3">
          <Avatar className="h-10 w-10 mt-1">
            <AvatarFallback>{review.userName?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <p className="font-semibold text-foreground">{review.userName}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
          {isAuthor ? (
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setIsEditing(true)}
                disabled={isUnderReview}
              >
                <Edit size={16} />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" disabled={isDeleting}>
                        <Trash2 size={16} />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your review.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Continue
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : user && !isUnderReview && (
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
           {isUnderReview && (
            <div className="mb-4 rounded-md border border-yellow-300 bg-yellow-100 p-3 text-sm text-yellow-800 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              This review is currently under review by our moderation team.
            </div>
          )}
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
      {user && <ReportReviewDialog 
        key={dialogKey}
        open={isReportDialogOpen} 
        onOpenChange={handleReportDialogChange}
        reviewId={review.id}
        reviewComment={review.comment}
      />}
    </>
  );
}
