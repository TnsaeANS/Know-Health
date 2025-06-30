
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Review } from '@/lib/types';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
// import { ReviewSummary } from '@/components/reviews/ReviewSummary'; // Removed
// import { getReviewSummary } from '@/actions/reviews'; // Removed
import { mockReviews } from '@/lib/mockData'; 

interface ProviderDetailsClientProps {
  providerId: string;
  initialReviews: Review[];
}

export default function ProviderDetailsClient({ providerId, initialReviews }: ProviderDetailsClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  // const [reviewSummary, setReviewSummary] = useState<ReviewSummaryAI | null>(null); // Removed
  // const [isLoadingSummary, setIsLoadingSummary] = useState(false); // Removed

  // fetchSummary logic removed as ReviewSummary component is removed

  const handleReviewSubmitted = useCallback((newReview: Review) => {
    // Add the newly submitted review to the top of the list for immediate feedback.
    setReviews(prevReviews => [newReview, ...prevReviews]);
  }, []);


  return (
    <div className="space-y-8">
      {/* <ReviewSummary summaryData={reviewSummary} isLoading={isLoadingSummary} /> Removed */}
      <ReviewForm 
        entityId={providerId} 
        entityType="provider" 
        onReviewSubmitted={handleReviewSubmitted} 
        reviews={reviews}
      />
      <ReviewList reviews={reviews} />
    </div>
  );
}
