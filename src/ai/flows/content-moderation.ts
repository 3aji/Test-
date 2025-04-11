// content-moderation.ts
'use server';

/**
 * @fileOverview A content moderation AI agent.
 *
 * - moderateContent - A function that handles the content moderation process.
 * - ModerateContentInput - The input type for the moderateContent function.
 * - ModerateContentOutput - The return type for the moderateContent function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ModerateContentInputSchema = z.object({
  text: z.string().describe('The text to be moderated.'),
});
export type ModerateContentInput = z.infer<typeof ModerateContentInputSchema>;

const ModerateContentOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the content is safe or not.'),
  reason: z.string().optional().describe('The reason why the content is not safe, if applicable.'),
});
export type ModerateContentOutput = z.infer<typeof ModerateContentOutputSchema>;

export async function moderateContent(input: ModerateContentInput): Promise<ModerateContentOutput> {
  return moderateContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderateContentPrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The text to be moderated.'),
    }),
  },
  output: {
    schema: z.object({
      isSafe: z.boolean().describe('Whether the content is safe or not.'),
      reason: z.string().optional().describe('The reason why the content is not safe, if applicable.'),
    }),
  },
  prompt: `You are a content moderation expert. Your job is to determine whether the given text is safe for use in a chat application. If the text is offensive, hateful, or otherwise inappropriate, you should mark it as unsafe and provide a reason.

Text: {{{text}}}
\nOutput the response in JSON format.
`,
});

const moderateContentFlow = ai.defineFlow<
  typeof ModerateContentInputSchema,
  typeof ModerateContentOutputSchema
>({
  name: 'moderateContentFlow',
  inputSchema: ModerateContentInputSchema,
  outputSchema: ModerateContentOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
