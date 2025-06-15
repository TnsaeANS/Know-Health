"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Review, ReviewSummaryAI } from '@/lib/types';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewSummary } from '@/components/reviews/ReviewSummary';
import { getReviewSummary } from '@/actions/reviews';
import { mockReviews } from '@/lib/mockData';

interface FacilityDetailsClientProps {
  facilityId: string;
  initialReviews: Review[];
}

export default function FacilityDetailsClient({ facilityId, initialReviews }: FacilityDetailsClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummaryAI | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const fetchSummary = useCallback(async () => {
     if (reviews.length < 3) {
        setReviewSummary(null);
        return;
    }
    setIsLoadingSummary(true);
    try {
      const summary = await getReviewSummary(facilityId, 'facility');
      setReviewSummary(summary);
    } catch (error) {
      console.error("Failed to fetch review summary:", error);
      setReviewSummary(null);
    } finally {
      setIsLoadingSummary(false);
    }
  }, [facilityId, reviews.length]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleReviewSubmitted = () => {
    const newMockReview: Review = {
        ...mockReviews[1], 
        id: `optimistic-facility-${Date.now()}`,
        comment: "This is a new facility review added client side for testing summary refresh.",
        date: new Date().toISOString(),
    };
    setReviews(prevReviews => [...prevReviews, newMockReview]);
  };

  return (
    <div className="space-y-8">
      <ReviewSummary summaryData={reviewSummary} isLoading={isLoadingSummary} />
      <ReviewList reviews={reviews} />
      <ReviewForm entityId={facilityId} entityType="facility" onReviewSubmitted={handleReviewSubmitted} />
    </div>
  );
}
