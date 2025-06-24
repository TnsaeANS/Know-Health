
"use server";

import { z } from 'zod';
import { pool } from '@/lib/db';
import type { Review } from '@/lib/types';

const reviewFormSchema = z.object({
  comment: z.string().min(10, { message: 'Comment must be at least 10 characters' }).optional().or(z.literal('')),
  providerId: z.string().optional(),
  facilityId: z.string().optional(),
  userId: z.string().min(1, { message: "User ID cannot be empty" }),
  userName: z.string().min(1, { message: "User name cannot be empty" }),
  bedsideManner: z.coerce.number().min(1).max(5).optional(),
  medicalAdherence: z.coerce.number().min(1).max(5).optional(),
  specialtyCare: z.coerce.number().min(1).max(5).optional(),
  facilityQuality: z.coerce.number().min(1).max(5).optional(),
  waitTime: z.coerce.number().min(1).max(5).optional(),
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
    userName,
    bedsideManner,
    medicalAdherence,
    specialtyCare,
    facilityQuality,
    waitTime
  } = parsed.data;

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

  const insertQuery = `
    INSERT INTO reviews (
      user_id, user_name, comment, date,
      provider_id, facility_id,
      bedside_manner, medical_adherence, specialty_care,
      facility_quality, wait_time
    )
    VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, $10)
  `;

  try {
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

    return {
      message: 'Review submitted successfully! Thank you for your feedback.',
      success: true,
    };
  } catch (error) {
    console.error('Database error on review submission:', error);
    return {
      message: 'A database error occurred. Please try again later.',
      success: false,
    };
  }
}
