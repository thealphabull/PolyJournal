'use server';

/**
 * @fileOverview Provides AI-driven feedback on trading theses.
 *
 * - reviewThesis - Analyzes a trading thesis and provides suggestions for improvement.
 * - ReviewThesisInput - The input type for the reviewThesis function.
 * - ReviewThesisOutput - The return type for the reviewThesis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewThesisInputSchema = z.object({
  thesis: z
    .string()
    .describe('The trading thesis to be reviewed. Include specific reasoning for the trade.'),
});
export type ReviewThesisInput = z.infer<typeof ReviewThesisInputSchema>;

const ReviewThesisOutputSchema = z.object({
  feedback: z
    .string()
    .describe('AI-generated feedback and suggestions for improving the trading thesis.'),
});
export type ReviewThesisOutput = z.infer<typeof ReviewThesisOutputSchema>;

export async function reviewThesis(input: ReviewThesisInput): Promise<ReviewThesisOutput> {
  return reviewThesisFlow(input);
}

const reviewThesisPrompt = ai.definePrompt({
  name: 'reviewThesisPrompt',
  input: {schema: ReviewThesisInputSchema},
  output: {schema: ReviewThesisOutputSchema},
  prompt: `You are an AI trading thesis reviewer, skilled at providing feedback and suggestions for improvement.

  Analyze the following trading thesis and provide constructive criticism, focusing on clarity, reasoning, and potential risks.

  Thesis: {{{thesis}}}

  Provide specific, actionable suggestions to refine the trader's thinking and improve their trading outcomes. Make sure to point out potential biases or assumptions.
  Limit response to 200 words.
  `,
});

const reviewThesisFlow = ai.defineFlow(
  {
    name: 'reviewThesisFlow',
    inputSchema: ReviewThesisInputSchema,
    outputSchema: ReviewThesisOutputSchema,
  },
  async input => {
    const {output} = await reviewThesisPrompt(input);
    return output!;
  }
);
