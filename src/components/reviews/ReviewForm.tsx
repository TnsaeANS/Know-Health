
"use client";

import React, { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitReviewAction, type ReviewFormState } from '@/actions/reviews';
import { useAuth } from '@/context/AuthContext';
import type { Review } from '@/lib/types';
import { ReviewCard } from './ReviewCard';

const initialState: ReviewFormState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Submit Review
    </Button>
  );
}

interface StarRatingInputProps {
  criterionName: string;
  criterionKey: "bedsideManner" | "medicalAdherence" | "facilityQuality" | "waitTime" | "specialtyCare";
  rating: number;
  setRating: (value: number) => void;
  descriptions: string[]; // 5 descriptions, one for each star
  error?: string;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ criterionName, criterionKey, rating, setRating, descriptions, error }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="space-y-3 p-3 border rounded-md bg-secondary/30">
      <Label htmlFor={criterionKey} className="text-md font-semibold text-foreground">{criterionName}</Label>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-7 w-7 cursor-pointer transition-colors ${
              (hoverRating || rating) >= star ? 'text-primary fill-primary' : 'text-muted-foreground/50'
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${star} star`}
          />
        ))}
      </div>
      {rating > 0 && (
        <p className="text-xs text-muted-foreground italic h-8">
          {descriptions[rating - 1]}
        </p>
      )}
       {rating === 0 && hoverRating > 0 && (
         <p className="text-xs text-muted-foreground italic h-8">
          {descriptions[hoverRating - 1]}
        </p>
       )}
       {rating === 0 && hoverRating === 0 && (
         <p className="text-xs text-muted-foreground italic h-8">
          Select a star to see description.
        </p>
       )}
      <input type="hidden" name={criterionKey} value={rating > 0 ? rating : ""} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};


interface ReviewFormProps {
  entityId: string;
  entityType: 'provider' | 'facility';
  onReviewSubmitted?: (newReview: Review) => void;
  reviews?: Review[];
}

export function ReviewForm({ entityId, entityType, onReviewSubmitted, reviews }: ReviewFormProps) {
  const [state, formAction] = useActionState(submitReviewAction, initialState);
  const { toast } = useToast();
  const { user } = useAuth();

  const [ratings, setRatings] = useState({
    bedsideManner: 0,
    medicalAdherence: 0,
    specialtyCare: 0,
    facilityQuality: 0,
    waitTime: 0,
  });
  const [comment, setComment] = useState('');

  const handleRatingChange = (criterionKey: keyof typeof ratings, value: number) => {
    setRatings(prev => ({ ...prev, [criterionKey]: value }));
  };
  
  const userReview = reviews?.find(review => review.userId === user?.id);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Review Submitted!',
          description: state.message,
        });

        if (onReviewSubmitted && user) {
          const newReview: Review = {
            id: `optimistic-${Date.now()}`, // Temporary ID for React key prop
            userId: user.id,
            userName: user.name,
            userAvatarUrl: user.avatarUrl,
            comment: comment,
            date: new Date().toISOString(),
            bedsideManner: ratings.bedsideManner > 0 ? ratings.bedsideManner : undefined,
            medicalAdherence: ratings.medicalAdherence > 0 ? ratings.medicalAdherence : undefined,
            specialtyCare: ratings.specialtyCare > 0 ? ratings.specialtyCare : undefined,
            facilityQuality: ratings.facilityQuality > 0 ? ratings.facilityQuality : undefined,
            waitTime: ratings.waitTime > 0 ? ratings.waitTime : undefined,
          };
          onReviewSubmitted(newReview);
        }

        setRatings({ bedsideManner: 0, medicalAdherence: 0, specialtyCare: 0, facilityQuality: 0, waitTime: 0 });
        setComment('');
      } else {
        const description = state.issues ? state.issues.join('\n') : state.message;
        toast({
          title: state.issues ? 'Validation Error' : 'Error',
          description: description,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast, onReviewSubmitted, user, comment, ratings]);
  
  if (userReview) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Thank You for Your Feedback!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">You have already submitted a review for this {entityType}.</p>
          <ReviewCard review={userReview} />
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Leave a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please <Button variant="link" asChild className="p-0 h-auto"><a href={`/login?redirect=/` + (entityType === 'provider' ? 'providers' : 'facilities') + `/${entityId}`}>login</a></Button> to leave a review.</p>
        </CardContent>
      </Card>
    )
  }

  const getErrorForField = (fieldName: string) => {
    if (!state.issues || !state.fields) return undefined;
    const fieldIssue = state.issues.find(issue => issue.startsWith(`${fieldName}:`));
    return fieldIssue ? fieldIssue.substring(fieldName.length + 1) : undefined;
  };

  const bedsideMannerDescriptions = [
    "Rude, dismissive, didn’t listen",
    "Neutral, no strong positive/negative impression",
    "Polite but somewhat rushed",
    "Friendly, attentive, addressed concerns",
    "Extremely caring, compassionate, made you feel heard",
  ];
  const medicalAdherenceDescriptions = [
    "No improvement, condition worsened",
    "Slight improvement, but unclear if due to treatment",
    "Moderate improvement, but not fully resolved",
    "Significant improvement, mostly effective",
    "Fully recovered or major progress due to treatment",
  ];
  const facilityQualityDescriptions = [
    "Dirty, disorganized, poor hygiene",
    "Below average, some cleanliness issues",
    "Acceptable, nothing outstanding",
    "Clean, well-organized, comfortable",
    "Spotless, modern, easy to navigate",
  ];
  const waitTimeDescriptions = [
    "Extremely long (hours beyond appointment)",
    "Long wait (30+ mins past scheduled time)",
    "Moderate wait (~15-30 mins)",
    "Short wait (<15 mins)",
    "Seen immediately or on time",
  ];
  const specialtyCareDescriptions = [
    "General care only (no specialization)",
    "Basic specialty services (limited expertise)",
    "Moderate specialization (some advanced care)",
    "Highly specialized (expert in field)",
    "Top-tier specialist (recognized leader in field)",
  ];

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Leave a Review</CardTitle>
        <CardDescription>Share your experience to help others. Rate the criteria below and optionally leave a comment.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name={entityType === 'provider' ? 'providerId' : 'facilityId'} value={entityId} />
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="userName" value={user.name} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entityType === 'provider' && (
              <>
                <StarRatingInput
                  criterionName="Bedside Manner"
                  criterionKey="bedsideManner"
                  rating={ratings.bedsideManner}
                  setRating={(val) => handleRatingChange("bedsideManner", val)}
                  descriptions={bedsideMannerDescriptions}
                  error={getErrorForField('bedsideManner')}
                />
                <StarRatingInput
                  criterionName="Medical Adherence"
                  criterionKey="medicalAdherence"
                  rating={ratings.medicalAdherence}
                  setRating={(val) => handleRatingChange("medicalAdherence", val)}
                  descriptions={medicalAdherenceDescriptions}
                  error={getErrorForField('medicalAdherence')}
                />
                <StarRatingInput
                  criterionName="Specialty Care"
                  criterionKey="specialtyCare"
                  rating={ratings.specialtyCare}
                  setRating={(val) => handleRatingChange("specialtyCare", val)}
                  descriptions={specialtyCareDescriptions}
                  error={getErrorForField('specialtyCare')}
                />
              </>
            )}

            {entityType === 'facility' && (
              <StarRatingInput
                criterionName="Facility Quality"
                criterionKey="facilityQuality"
                rating={ratings.facilityQuality}
                setRating={(val) => handleRatingChange("facilityQuality", val)}
                descriptions={facilityQualityDescriptions}
                error={getErrorForField('facilityQuality')}
              />
            )}

            <StarRatingInput
              criterionName="Wait Time"
              criterionKey="waitTime"
              rating={ratings.waitTime}
              setRating={(val) => handleRatingChange("waitTime", val)}
              descriptions={waitTimeDescriptions}
              error={getErrorForField('waitTime')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Your Personal Comments (Optional)</Label>
            <Textarea 
              id="comment" 
              name="comment" 
              placeholder="Share your thoughts..." 
              rows={5} 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
             {getErrorForField('comment') && <p className="text-sm text-destructive">{getErrorForField('comment')}</p>}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
