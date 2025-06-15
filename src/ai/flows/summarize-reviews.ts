// SummarizeReviews.ts
'use server';
/**
 * @fileOverview Summarizes reviews for a doctor or facility.
 *
 * - summarizeReviews - A function that summarizes reviews.
 * - SummarizeReviewsInput - The input type for the summarizeReviews function.
 * - SummarizeReviewsOutput - The return type for the summarizeReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReviewsInputSchema = z.object({
  reviews: z.array(z.string()).describe('An array of reviews to summarize.'),
});
export type SummarizeReviewsInput = z.infer<typeof SummarizeReviewsInputSchema>;

const SummarizeReviewsOutputSchema = z.object({
  summary: z.string().describe('A summary of the reviews.'),
  positiveThemes: z.string().describe('Common positive themes in the reviews.'),
  negativeThemes: z.string().describe('Common negative themes in the reviews.'),
});
export type SummarizeReviewsOutput = z.infer<typeof SummarizeReviewsOutputSchema>;

export async function summarizeReviews(input: SummarizeReviewsInput): Promise<SummarizeReviewsOutput> {
  return summarizeReviewsFlow(input);
}

const summarizeReviewsPrompt = ai.definePrompt({
  name: 'summarizeReviewsPrompt',
  input: {schema: SummarizeReviewsInputSchema},
  output: {schema: SummarizeReviewsOutputSchema},
  prompt: `You are an AI expert in sentiment analysis and theme extraction from customer reviews.

You will receive a list of reviews for a doctor or facility. Your task is to provide a concise summary of the reviews, identify common positive themes, and identify common negative themes.

Reviews:
{{#each reviews}}{{{this}}}
{{/each}}

Summary Instructions:
*   Provide a brief overview of the general sentiment expressed in the reviews.
*   Focus on the key aspects that are frequently mentioned.

Positive Themes Instructions:
*   Identify and list the recurring positive aspects highlighted in the reviews.
*   Provide specific examples or keywords that represent these themes.

Negative Themes Instructions:
*   Identify and list the recurring negative aspects highlighted in the reviews.
*   Provide specific examples or keywords that represent these themes.

Output the summary, positive themes, and negative themes as strings.
`,
});

const summarizeReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeReviewsFlow',
    inputSchema: SummarizeReviewsInputSchema,
    outputSchema: SummarizeReviewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeReviewsPrompt(input);
    return output!;
  }
);
