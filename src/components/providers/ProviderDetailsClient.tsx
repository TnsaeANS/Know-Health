
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

  const handleReviewSubmitted = useCallback(() => {
    // This is a simplified optimistic update. 
    // In a real app, you might re-fetch reviews or update more intelligently.
    const newMockReview: Review = {
        id: `optimistic-${Date.now()}`,
        comment: "Thank you for your review! It's being processed.",
        date: new Date().toISOString(),
        userId: 'optimistic-user', 
        userName: 'Optimistic User',
        // Add dummy values for new rating fields or leave them undefined if optional
        bedsideManner: 0, 
        medicalAdherence: 0,
        specialtyCare: 0,
        waitTime: 0,
    };
    setReviews(prevReviews => [newMockReview, ...prevReviews]); // Add to top for visibility
    // Potentially trigger a re-fetch of reviews from the server here
  }, []);


  return (
    <div className="space-y-8">
      {/* <ReviewSummary summaryData={reviewSummary} isLoading={isLoadingSummary} /> Removed */}
      <ReviewForm entityId={providerId} entityType="provider" onReviewSubmitted={handleReviewSubmitted} />
      <ReviewList reviews={reviews} />
    </div>
  );
}

