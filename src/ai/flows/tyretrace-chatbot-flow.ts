
'use server';
/**
 * @fileOverview A Genkit flow for the TyreTrace AI chatbot.
 *
 * - tyreTraceChat - Handles chatbot interaction.
 * - TyreTraceChatInput - The input type for the tyreTraceChat function.
 * - TyreTraceChatOutput - The return type for the tyreTraceChat function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const TyreTraceChatInputSchema = z.object({
  userMessage: z.string().describe("The user's message to the chatbot."),
});
export type TyreTraceChatInput = z.infer<typeof TyreTraceChatInputSchema>;

const TyreTraceChatOutputSchema = z.object({
  botResponse: z.string().describe("The chatbot's response."),
});
export type TyreTraceChatOutput = z.infer<typeof TyreTraceChatOutputSchema>;

export async function tyreTraceChat(input: TyreTraceChatInput): Promise<TyreTraceChatOutput> {
  return tyreTraceChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'tyreTraceChatPrompt',
  input: {schema: TyreTraceChatInputSchema},
  output: {schema: TyreTraceChatOutputSchema},
  prompt: `En tant qu'assistant IA expert de la plateforme TyreTrace AI, réponds à la question suivante d'un gestionnaire de flotte de manière concise et professionnelle. Question: "{{{userMessage}}}"`,
});

const tyreTraceChatFlow = ai.defineFlow(
  {
    name: 'tyreTraceChatFlow',
    inputSchema: TyreTraceChatInputSchema,
    outputSchema: TyreTraceChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
