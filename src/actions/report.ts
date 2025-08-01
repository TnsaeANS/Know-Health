
"use server";

import { z } from 'zod';
import { pool } from '@/lib/db';
import { revalidatePath } from 'next/cache';

const reportFormSchema = z.object({
  reviewId: z.string().min(1, { message: 'Review ID is required' }),
  reason: z.string().min(10, { message: 'Reason must be at least 10 characters' }).max(500, { message: 'Reason cannot exceed 500 characters' }),
  userId: z.string().min(1, { message: 'User ID is required' }), // Reporter's ID
});

export type ReportFormState = {
  message: string;
  fields?: {
    reviewId?: string;
    reason?: string;
    userId?: string;
  };
  issues?: string[];
  success: boolean;
};

export async function submitReportAction(
  prevState: ReportFormState,
  data: FormData
): Promise<ReportFormState> {
  if (!pool) {
    return { message: 'Database is not configured. Could not submit report.', success: false };
  }
  
  const formData = Object.fromEntries(data);
  const parsed = reportFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: 'Invalid report data. Please check the fields.',
      fields: formData as Record<string, string>,
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      success: false,
    };
  }
  
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Insert the report into the reports table
    const insertReportQuery = `
      INSERT INTO reports (review_id, reporter_user_id, reason)
      VALUES ($1, $2, $3)
    `;
    await client.query(insertReportQuery, [Number(parsed.data.reviewId), parsed.data.userId, parsed.data.reason]);

    // 2. Update the review's status to 'under_review'
    const updateReviewQuery = `
      UPDATE reviews SET status = 'under_review' WHERE id = $1
    `;
    await client.query(updateReviewQuery, [Number(parsed.data.reviewId)]);

    await client.query('COMMIT');
    
    // Revalidate paths to reflect changes
    revalidatePath('/admin/dashboard');

    return {
      message: 'Report submitted successfully. Our team will review it shortly.',
      success: true,
    };
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Database error on report submission:', error);
    return {
      message: `A database error occurred: ${error.message}. Please try again later.`,
      success: false,
    };
  } finally {
    client.release();
  }
}

export type ModerationResult = {
  success: boolean;
  message: string;
}

export async function approveReviewAction(reviewId: number): Promise<ModerationResult> {
    if (!pool) {
        return { success: false, message: 'Database is not configured.' };
    }

    try {
        await pool.query("UPDATE reviews SET status = 'published' WHERE id = $1", [reviewId]);
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Review approved and is now public.' };
    } catch (error: any) {
        console.error('Error approving review:', error);
        return { success: false, message: `Database Error: ${error.message}` };
    }
}

// Note: This is a hard delete. The review will be gone permanently.
export async function deleteReportedReviewAction(reviewId: number): Promise<ModerationResult> {
     if (!pool) {
        return { success: false, message: 'Database is not configured.' };
    }

    try {
        // The ON DELETE CASCADE constraint on the reports table will auto-delete associated reports.
        await pool.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
        revalidatePath('/admin/dashboard');
        return { success: true, message: 'Review permanently deleted.' };
    } catch (error: any) {
        console.error('Error deleting review:', error);
        return { success: false, message: `Database Error: ${error.message}` };
    }
}
