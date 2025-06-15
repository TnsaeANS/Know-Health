
"use client";

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitReviewAction, type ReviewFormState } from '@/actions/reviews';
import { useAuth } from '@/context/AuthContext';

const initialState: ReviewFormState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Submit Review
    </Button>
  );
}

interface ReviewFormProps {
  entityId: string; // providerId or facilityId
  entityType: 'provider' | 'facility';
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ entityId, entityType, onReviewSubmitted }: ReviewFormProps) {
  const [state, formAction] = useActionState(submitReviewAction, initialState);
  const { toast } = useToast();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Review Submitted!',
          description: state.message,
        });
        setRating(0);
        setComment('');
        if (onReviewSubmitted) onReviewSubmitted();
      } else if (state.issues) {
         toast({
          title: 'Validation Error',
          description: state.issues.join('\n'),
          variant: 'destructive',
        });
      } else {
         toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast, onReviewSubmitted]);

  if (!user) {
    return (
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Leave a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please <Button variant="link" asChild className="p-0 h-auto"><a href="/login">login</a></Button> to leave a review.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Leave a Review</CardTitle>
        <CardDescription>Share your experience to help others.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <input type="hidden" name={entityType === 'provider' ? 'providerId' : 'facilityId'} value={entityId} />
          <input type="hidden" name="userId" value={user.id} />
          
          <div className="space-y-2">
            <Label htmlFor="rating">Your Rating</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-7 w-7 cursor-pointer transition-colors ${
                    (hoverRating || rating) >= star ? 'text-primary fill-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            <input type="hidden" name="rating" value={rating} />
            {state.issues && state.fields?.rating && state.issues.find(issue => issue.toLowerCase().includes('rating')) && (
                 <p className="text-sm text-destructive">{state.issues.find(issue => issue.toLowerCase().includes('rating'))}</p>
              )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea 
              id="comment" 
              name="comment" 
              placeholder="Tell us about your experience..." 
              rows={5} 
              required 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {state.issues && state.fields?.comment && state.issues.find(issue => issue.toLowerCase().includes('comment')) && (
                 <p className="text-sm text-destructive">{state.issues.find(issue => issue.toLowerCase().includes('comment'))}</p>
              )}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
