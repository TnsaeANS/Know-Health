
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Review } from '@/lib/types';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';

interface ProviderDetailsClientProps {
  providerId: string;
  initialReviews: Review[];
}

export default function ProviderDetailsClient({ providerId, initialReviews }: ProviderDetailsClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const handleReviewSubmitted = useCallback((newReview: Review) => {
    // Add the newly submitted review to the top of the list for immediate feedback.
    setReviews(prevReviews => [newReview, ...prevReviews]);
  }, []);

  const handleReviewDeleted = useCallback((reviewId: string) => {
    setReviews(prevReviews => prevReviews.filter(r => r.id !== reviewId));
  }, []);
  
  const handleReviewUpdated = useCallback((updatedReview: Review) => {
    setReviews(prevReviews => prevReviews.map(r => r.id === updatedReview.id ? updatedReview : r));
  }, []);


  return (
    <div className="space-y-8">
      <ReviewForm 
        entityId={providerId} 
        entityType="provider" 
        onReviewSubmitted={handleReviewSubmitted} 
        reviews={reviews}
      />
      <ReviewList 
        reviews={reviews} 
        onReviewDeleted={handleReviewDeleted}
        onReviewUpdated={handleReviewUpdated}
      />
    </div>
  );
}
