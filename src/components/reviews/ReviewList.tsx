
"use client";

import type { Review } from '@/lib/types';
import { ReviewCard } from './ReviewCard';
import { useState, useEffect } from 'react';

interface ReviewListProps {
  reviews: Review[];
  onReviewDeleted?: (reviewId: string) => void;
  onReviewUpdated?: (updatedReview: Review) => void;
}

export function ReviewList({ reviews: initialReviews, onReviewDeleted, onReviewUpdated }: ReviewListProps) {
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);


  const handleReviewDeleted = (reviewId: string) => {
    setReviews(currentReviews => currentReviews.filter(r => r.id !== reviewId));
    if (onReviewDeleted) {
        onReviewDeleted(reviewId);
    }
  };

  const handleReviewUpdated = (updatedReview: Review) => {
    setReviews(currentReviews => 
        currentReviews.map(r => r.id === updatedReview.id ? updatedReview : r)
    );
    if (onReviewUpdated) {
        onReviewUpdated(updatedReview);
    }
  }

  if (!reviews || reviews.length === 0) {
    return <p className="text-muted-foreground py-8 text-center">No reviews yet. Be the first to leave a review!</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard 
            key={review.id} 
            review={review}
            onReviewDeleted={handleReviewDeleted}
            onReviewUpdated={handleReviewUpdated}
        />
      ))}
    </div>
  );
}
