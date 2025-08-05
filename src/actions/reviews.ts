
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
  comment: z.string().optional(),
  providerId: z.string().optional(),
  facilityId: z.string().optional(),
  userId: z.string().min(1, { message: "User ID cannot be empty" }),
  userName: z.string().min(1, { message: "User name cannot be empty" }),
  bedsideManner: ratingSchema,
  medicalAdherence: ratingSchema,
  specialtyCare: ratingSchema,
  facilityQuality: ratingSchema,
  waitTime: ratingSchema,
});

const updateReviewFormSchema = reviewFormSchema.extend({
    reviewId: z.string().min(1, { message: "Review ID is required" }),
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
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
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
        user_id, user_name, comment,
        provider_id, facility_id,
        bedside_manner, medical_adherence, specialty_care,
        facility_quality, wait_time
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    await pool.query(insertQuery, [
      userId,
      userName,
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
    console.error('Database error on review submission:', error);

    if (error.code === '23505') { // Unique violation
        return {
            message: `You have already submitted a review for this ${providerId ? 'provider' : 'facility'}.`,
            success: false,
        };
    }
    
    const dbErrorMessage = error.message || 'An unknown database error occurred.';
    return {
      message: `Database Error: ${dbErrorMessage}. Please try again later.`,
      success: false,
    };
  }
}

export async function updateReviewAction(
    prevState: ReviewFormState,
    data: FormData
  ): Promise<ReviewFormState> {
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    if (!pool) {
      return { message: 'Database is not configured. Could not update review.', success: false };
    }
  
    const formData = Object.fromEntries(data);
    const parsed = updateReviewFormSchema.safeParse(formData);
  
    if (!parsed.success) {
      return {
        message: 'Invalid review data for update.',
        fields: formData as Record<string, string | number>,
        issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
        success: false,
      };
    }
  
    const {
      reviewId,
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
  
    try {
      // First, verify the user owns the review
      const ownerCheck = await pool.query('SELECT user_id FROM reviews WHERE id = $1', [reviewId]);
      if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].user_id !== userId) {
        return { message: 'Authorization error: You do not own this review.', success: false };
      }
  
      const updateQuery = `
        UPDATE reviews SET
          comment = $1,
          bedside_manner = $2,
          medical_adherence = $3,
          specialty_care = $4,
          facility_quality = $5,
          wait_time = $6,
          date = NOW()
        WHERE id = $7 AND user_id = $8
      `;
  
      await pool.query(updateQuery, [
        comment || null,
        bedsideManner || null,
        medicalAdherence || null,
        specialtyCare || null,
        facilityQuality || null,
        waitTime || null,
        reviewId,
        userId,
      ]);
  
      if (providerId) revalidatePath(`/providers/${providerId}`);
      if (facilityId) revalidatePath(`/facilities/${facilityId}`);
      revalidatePath('/account');
  
      return {
        message: 'Review updated successfully!',
        success: true,
      };
    } catch (error: any) {
      console.error('Database error on review update:', error);
      const dbErrorMessage = error.message || 'An unknown database error occurred.';
      return {
        message: `Database Error: ${dbErrorMessage}. Please try again later.`,
        success: false,
      };
    }
  }
  
  export async function deleteReviewAction(reviewId: string, userId: string): Promise<{ success: boolean; message: string; }> {
    if (!pool) {
      return { success: false, message: 'Database is not configured.' };
    }
  
    try {
      const ownerCheck = await pool.query('SELECT user_id, provider_id, facility_id FROM reviews WHERE id = $1', [reviewId]);
      if (ownerCheck.rows.length === 0) {
        return { success: false, message: 'Review not found.' };
      }
  
      const review = ownerCheck.rows[0];
      if (review.user_id !== userId) {
        return { success: false, message: 'You are not authorized to delete this review.' };
      }
  
      await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
  
      if (review.provider_id) revalidatePath(`/providers/${review.provider_id}`);
      if (review.facility_id) revalidatePath(`/facilities/${review.facility_id}`);
      revalidatePath('/account');
  
      return { success: true, message: 'Review deleted successfully.' };
    } catch (error: any) {
      console.error(`Database error deleting review ${reviewId}:`, error);
      return { success: false, message: `A database error occurred: ${error.message}.` };
    }
  }
