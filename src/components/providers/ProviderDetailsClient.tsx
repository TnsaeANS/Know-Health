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

  const handleReviewSubmitted = () => {
    // This is a simplified refresh. In a real app, you might re-fetch reviews
    // or optimistically update the list. For now, we'll add a mock review to trigger re-summary.
    // This part assumes the review list would be updated through another mechanism or re-fetched.
    // For this mock, let's just add one to the local state to see if summary re-fetches.
    // In a real app, you'd likely have a more robust state management or server-driven update.
    const newMockReview: Review = {
        ...mockReviews[0], // Use a base mock review
        id: `optimistic-${Date.now()}`,
        comment: "This is a new review added client side for testing summary refresh.",
        date: new Date().toISOString(),
    };
    setReviews(prevReviews => [...prevReviews, newMockReview]);
    // The useEffect for fetchSummary will pick up the change in reviews.length.
  };


  return (
    <div className="space-y-8">
      <ReviewSummary summaryData={reviewSummary} isLoading={isLoadingSummary} />
      <ReviewList reviews={reviews} />
      <ReviewForm entityId={providerId} entityType="provider" onReviewSubmitted={handleReviewSubmitted} />
    </div>
  );
}
