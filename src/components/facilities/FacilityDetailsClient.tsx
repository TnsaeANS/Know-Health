
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

  const handleReviewSubmitted = useCallback(() => {
    // Simplified optimistic update
    const newMockReview: Review = {
        id: `optimistic-facility-${Date.now()}`,
        comment: "Thank you for your review! It's being processed.",
        date: new Date().toISOString(),
        userId: 'optimistic-user',
        userName: 'Optimistic User',
        facilityQuality: 0,
        waitTime: 0,
    };
    setReviews(prevReviews => [newMockReview, ...prevReviews]); // Add to top
    // Potentially trigger a re-fetch of reviews from the server here
  }, []);

  return (
    <div className="space-y-8">
      {/* <ReviewSummary summaryData={reviewSummary} isLoading={isLoadingSummary} /> Removed */}
      <ReviewForm entityId={facilityId} entityType="facility" onReviewSubmitted={handleReviewSubmitted} />
      <ReviewList reviews={reviews} />
    </div>
  );
}

