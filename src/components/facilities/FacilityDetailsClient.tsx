
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { Review } from '@/lib/types';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
// import { ReviewSummary } from '@/components/reviews/ReviewSummary'; // Removed
// import { getReviewSummary } from '@/actions/reviews'; // Removed
import { mockReviews } from '@/lib/mockData';

interface FacilityDetailsClientProps {
  facilityId: string;
  initialReviews: Review[];
}

export default function FacilityDetailsClient({ facilityId, initialReviews }: FacilityDetailsClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  // const [reviewSummary, setReviewSummary] = useState<ReviewSummaryAI | null>(null); // Removed
  // const [isLoadingSummary, setIsLoadingSummary] = useState(false); // Removed

  // fetchSummary logic removed

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
      {/* <ReviewSummary summaryData={reviewSummary} isLoading={isLoadingSummary} /> Removed */}
      <ReviewForm 
        entityId={facilityId} 
        entityType="facility" 
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
