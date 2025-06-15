
"use server";

import { z } from 'zod';
// import { summarizeReviews } from '@/ai/flows/summarize-reviews'; // Removed AI summary
// import type { ReviewSummaryAI } from '@/lib/types'; // ReviewSummaryAI type removed

const reviewFormSchema = z.object({
  comment: z.string().min(10, { message: 'Comment must be at least 10 characters' }).optional().or(z.literal('')),
  providerId: z.string().optional(),
  facilityId: z.string().optional(),
  userId: z.string(),
  bedsideManner: z.coerce.number().min(1).max(5).optional(),
  medicalAdherence: z.coerce.number().min(1).max(5).optional(),
  specialtyCare: z.coerce.number().min(1).max(5).optional(),
  facilityQuality: z.coerce.number().min(1).max(5).optional(),
  waitTime: z.coerce.number().min(1).max(5).optional(),
});

export type ReviewFormState = {
  message: string;
  fields?: Record<string, string | number>; // Allow number for ratings
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
    const fieldErrors: Record<string, string | number> = {};
    for (const key in formData) {
        fieldErrors[key] = String(formData[key]);
    }
    return {
      message: 'Invalid review data',
      fields: fieldErrors,
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      success: false,
    };
  }

  const {
    comment,
    providerId,
    facilityId,
    userId,
    bedsideManner,
    medicalAdherence,
    specialtyCare,
    facilityQuality,
    waitTime
  } = parsed.data;

  // At least one rating criterion or a comment must be provided
  const hasProviderRatings = bedsideManner || medicalAdherence || specialtyCare || waitTime;
  const hasFacilityRatings = facilityQuality || waitTime;
  const hasContent = comment || (providerId && hasProviderRatings) || (facilityId && hasFacilityRatings);

  if (!hasContent) {
    return {
      message: 'Please provide a rating for at least one criterion or write a comment.',
      fields: formData as Record<string, string | number>,
      success: false,
    };
  }


  const newReview = {
    id: `review-${Date.now()}`,
    userId,
    userName: "Mock User", // In real app, fetch user name based on userId
    comment: comment || "",
    date: new Date().toISOString(),
    bedsideManner,
    medicalAdherence,
    specialtyCare,
    facilityQuality,
    waitTime,
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

// getReviewSummary is no longer needed as AI summary is removed
// export async function getReviewSummary(entityId: string, entityType: 'provider' | 'facility'): Promise<ReviewSummaryAI | null> {
//   // ... implementation removed ...
// }

