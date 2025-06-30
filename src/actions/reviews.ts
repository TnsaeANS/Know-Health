
"use server";

import { z } from 'zod';
import { pool } from '@/lib/db';
import type { Review } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const ratingSchema = z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.coerce.number().min(1).max(5).optional()
);

const reviewFormSchema = z.object({
  comment: z.string().min(10, { message: 'Comment must be at least 10 characters' }).or(z.literal('')).optional(),
  providerId: z.string().optional(),
  facilityId: z.string().optional(),
  userId: z.string().min(1, { message: "User ID cannot be empty" }),
  userName: z.string().min(1, { message: "User name cannot be empty" }),
  userAvatarUrl: z.string().url().optional(),
  bedsideManner: ratingSchema,
  medicalAdherence: ratingSchema,
  specialtyCare: ratingSchema,
  facilityQuality: ratingSchema,
  waitTime: ratingSchema,
});

export type ReviewFormState = {
  message: string;
  fields?: Record<string, string | number>;
  issues?: string[];
  success: boolean;
};

export async function submitReviewAction(
  prevState: ReviewFormState,
  data: FormData
): Promise<ReviewFormState> {
  if (!pool) {
    return { message: 'Database is not configured. Could not submit review.', success: false };
  }

  const formData = Object.fromEntries(data);
  const parsed = reviewFormSchema.safeParse(formData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string | number> = {};
    for (const key in formData) {
        fieldErrors[key] = String(formData[key]);
    }
    return {
      message: 'Invalid review data. Please check the fields.',
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
    userName,
    userAvatarUrl,
    bedsideManner,
    medicalAdherence,
    specialtyCare,
    facilityQuality,
    waitTime
  } = parsed.data;

  const hasProviderRatings = bedsideManner || medicalAdherence || specialtyCare;
  const hasFacilityRatings = facilityQuality;
  const hasCommonRatings = waitTime; 
  
  const hasContent = (comment && comment.length > 0) || hasProviderRatings || hasFacilityRatings || hasCommonRatings;

  if (!hasContent) {
    return {
      message: 'Please provide a rating for at least one criterion or write a comment.',
      fields: formData as Record<string, string | number>,
      success: false,
    };
  }
  
  try {
    const insertQuery = `
      INSERT INTO reviews (
        user_id, user_name, user_avatar_url, comment,
        provider_id, facility_id,
        bedside_manner, medical_adherence, specialty_care,
        facility_quality, wait_time
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    await pool.query(insertQuery, [
      userId,
      userName,
      userAvatarUrl || null,
      comment || null,
      providerId || null,
      facilityId || null,
      bedsideManner || null,
      medicalAdherence || null,
      specialtyCare || null,
      facilityQuality || null,
      waitTime || null,
    ]);
    
    if (providerId) revalidatePath(`/providers/${providerId}`);
    if (facilityId) revalidatePath(`/facilities/${facilityId}`);
    revalidatePath('/account');

    return {
      message: 'Thank you for your review!',
      success: true,
    };
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
        return {
            message: `You have already submitted a review for this ${providerId ? 'provider' : 'facility'}.`,
            success: false,
        };
    }

    console.error('Database error on review submission:', error);
    return {
      message: 'A database error occurred. Please try again later.',
      success: false,
    };
  }
}
