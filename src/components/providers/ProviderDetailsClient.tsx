
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Review, ReviewSummaryAI } from '@/lib/types';
import { ReviewList } from '@/components/reviews/ReviewList';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewSummary } from '@/components/reviews/ReviewSummary';
import { getReviewSummary } from '@/actions/reviews'; // Assuming server action lives here
import { mockReviews } from '@/lib/mockData'; // For optimistic updates or local state if not using server state for reviews

interface ProviderDetailsClientProps {
  providerId: string;
  initialReviews: Review[];
}

export default function ProviderDetailsClient({ providerId, initialReviews }: ProviderDetailsClientProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [reviewSummary, setReviewSummary] = useState<ReviewSummaryAI | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const fetchSummary = useCallback(async () => {
    if (reviews.length < 3) { // Only fetch summary if there are enough reviews. Min 3 for AI.
        setReviewSummary(null); // Clear summary if not enough reviews
        return;
    }
    setIsLoadingSummary(true);
    try {
      const summary = await getReviewSummary(providerId, 'provider');
      setReviewSummary(summary);
    } catch (error) {
      console.error("Failed to fetch review summary:", error);
      setReviewSummary(null); // Clear summary on error
    } finally {
      setIsLoadingSummary(false);
    }
  }, [providerId, reviews.length]);


  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleReviewSubmitted = useCallback(() => {
    const newMockReview: Review = {
        ...mockReviews[0], 
        id: `optimistic-${Date.now()}`,
        comment: "This is a new review added client side for testing summary refresh.",
        date: new Date().toISOString(),
        userId: 'optimistic-user', 
        userName: 'Optimistic User',
    };
    setReviews(prevReviews => [...prevReviews, newMockReview]);
  }, []);


  return (
    <div className="space-y-8">
      <ReviewSummary summaryData={reviewSummary} isLoading={isLoadingSummary} />
      <ReviewList reviews={reviews} />
      <ReviewForm entityId={providerId} entityType="provider" onReviewSubmitted={handleReviewSubmitted} />
    </div>
  );
}
