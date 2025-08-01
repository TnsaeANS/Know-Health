
"use server";

import { pool } from '@/lib/db';
import { type Review } from '@/lib/types';

const mapDbRowToReview = (row: any): Review => {
  return {
    id: String(row.id),
    userId: row.user_id,
    userName: row.user_name,
    comment: row.comment || "",
    date: new Date(row.date).toISOString(),
    status: row.status || 'published',
    bedsideManner: row.bedside_manner ?? undefined,
    medicalAdherence: row.medical_adherence ?? undefined,
    specialtyCare: row.specialty_care ?? undefined,
    facilityQuality: row.facility_quality ?? undefined,
    waitTime: row.wait_time ?? undefined,
  };
};

export async function getReviewsByUserId(userId: string): Promise<Review[]> {
  if (!pool) {
    console.warn('Database not configured. Cannot fetch user reviews.');
    return [];
  }

  try {
    // Fetches all reviews by user, regardless of status, so they can see their own reported reviews
    const query = 'SELECT * FROM reviews WHERE user_id = $1 ORDER BY date DESC';
    const result = await pool.query(query, [userId]);
    return result.rows.map(mapDbRowToReview);
  } catch (error) {
    console.error('Failed to fetch reviews by user ID:', error);
    return [];
  }
}
