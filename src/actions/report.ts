
"use server";

import { z } from 'zod';
import { type User } from '@/lib/types'; // Assuming User type is available for reporter info

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

  // In a real app, you would save this report to a database
  // and potentially trigger a moderation workflow.
  console.log('Review reported:', parsed.data);

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate potential server error (uncomment to test)
  // if (Math.random() > 0.8) {
  //   return {
  //     message: "Failed to submit report due to a server error. Please try again later.",
  //     success: false,
  //   };
  // }

  return {
    message: 'Report submitted successfully. Our team will review it shortly.',
    success: true,
  };
}
