
"use server";

import { pool } from '@/lib/db';
import { type Review } from '@/lib/types';

const mapDbRowToReview = (row: any): Review => {
  return {
    id: String(row.id),
    userId: row.user_id,
    userName: row.user_name,
    userAvatarUrl: row.user_avatar_url,
    comment: row.comment || "",
    date: new Date(row.date).toISOString(),
    bedsideManner: row.bedside_manner,
    medicalAdherence: row.medical_adherence,
    specialtyCare: row.specialty_care,
    facilityQuality: row.facility_quality,
    waitTime: row.wait_time,
  };
};

export async function getReviewsByUserId(userId: string): Promise<Review[]> {
  if (!pool) {
    console.warn('Database not configured. Cannot fetch user reviews.');
    return [];
  }

  try {
    const query = 'SELECT * FROM reviews WHERE user_id = $1 ORDER BY date DESC';
    const result = await pool.query(query, [userId]);
    return result.rows.map(mapDbRowToReview);
  } catch (error) {
    console.error('Failed to fetch reviews by user ID:', error);
    return [];
  }
}
