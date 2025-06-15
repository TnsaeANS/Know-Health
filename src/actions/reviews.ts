"use server";

import { z } from 'zod';
import { summarizeReviews } from '@/ai/flows/summarize-reviews'; // Import the AI flow
import type { ReviewSummaryAI } from '@/lib/types';

const reviewFormSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, { message: 'Comment must be at least 10 characters' }),
  providerId: z.string().optional(), // For provider reviews
  facilityId: z.string().optional(), // For facility reviews
  userId: z.string(), // Assuming userId is passed from authenticated context
});

export type ReviewFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
};

// This is a mock in-memory store for reviews. In a real app, use a database.
const mockReviewStore: { [key: string]: any[] } = { // Using `any` for simplicity of mock store
  providers: [],
  facilities: [],
};

export async function submitReviewAction(
  prevState: ReviewFormState,
  data: FormData
): Promise<ReviewFormState> {
  const formData = Object.fromEntries(data);
  const parsed = reviewFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: 'Invalid review data',
      fields: formData as Record<string, string>,
      issues: parsed.error.issues.map((issue) => issue.message),
      success: false,
    };
  }

  const { rating, comment, providerId, facilityId, userId } = parsed.data;
  const newReview = {
    id: `review-${Date.now()}`,
    userId,
    userName: "Mock User", // In real app, fetch user name based on userId
    rating,
    comment,
    date: new Date().toISOString(),
  };

  if (providerId) {
    mockReviewStore.providers.push({ ...newReview, providerId });
    console.log('Provider review submitted:', newReview, 'for provider:', providerId);
  } else if (facilityId) {
    mockReviewStore.facilities.push({ ...newReview, facilityId });
    console.log('Facility review submitted:', newReview, 'for facility:', facilityId);
  } else {
    return { message: 'Missing provider or facility ID', success: false };
  }
  
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    message: 'Review submitted successfully! Thank you for your feedback.',
    success: true,
  };
}


export async function getReviewSummary(entityId: string, entityType: 'provider' | 'facility'): Promise<ReviewSummaryAI | null> {
  let reviews: string[] = [];
  if (entityType === 'provider') {
    reviews = mockReviewStore.providers
      .filter(r => r.providerId === entityId)
      .map(r => r.comment);
  } else {
    reviews = mockReviewStore.facilities
      .filter(r => r.facilityId === entityId)
      .map(r => r.comment);
  }

  if (reviews.length < 3) { // Only summarize if there are enough reviews
    return null; 
  }

  try {
    const summaryResult = await summarizeReviews({ reviews });
    return summaryResult;
  } catch (error) {
    console.error("Error summarizing reviews:", error);
    return null;
  }
}
