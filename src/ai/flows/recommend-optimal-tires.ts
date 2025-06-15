// src/ai/flows/recommend-optimal-tires.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for recommending optimal tire profiles for different vehicles and roles.
 *
 * - recommendOptimalTires - A function that recommends optimal tire profiles based on historical data.
 * - RecommendOptimalTiresInput - The input type for the recommendOptimalTires function.
 * - RecommendOptimalTiresOutput - The output type for the recommendOptimalTires function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendOptimalTiresInputSchema = z.object({
  vehicleType: z.string().describe('The type of vehicle (e.g., truck, forklift).'),
  role: z.string().describe('The role of the vehicle (e.g., transportation, loading).'),
  historicalTirePerformanceData: z.string().describe('Historical data about tire performance, including tire profiles, lifespan, and cost.'),
});

export type RecommendOptimalTiresInput = z.infer<typeof RecommendOptimalTiresInputSchema>;

const RecommendOptimalTiresOutputSchema = z.object({
  recommendedTireProfile: z.string().describe('The recommended tire profile for the given vehicle type and role.'),
  expectedLifespan: z.string().describe('The expected lifespan of the recommended tire profile.'),
  estimatedCostSavings: z.string().describe('The estimated cost savings from using the recommended tire profile.'),
  reasoning: z.string().describe('The AI reasoning behind the recommendation.'),
});

export type RecommendOptimalTiresOutput = z.infer<typeof RecommendOptimalTiresOutputSchema>;

export async function recommendOptimalTires(input: RecommendOptimalTiresInput): Promise<RecommendOptimalTiresOutput> {
  return recommendOptimalTiresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendOptimalTiresPrompt',
  input: {schema: RecommendOptimalTiresInputSchema},
  output: {schema: RecommendOptimalTiresOutputSchema},
  prompt: `You are an expert in tire performance and cost optimization. Based on the historical tire performance data provided for the specified vehicle type and role, recommend the optimal tire profile. Explain your reasoning.

Vehicle Type: {{{vehicleType}}}
Role: {{{role}}}
Historical Tire Performance Data: {{{historicalTirePerformanceData}}}

Provide the recommended tire profile, expected lifespan, estimated cost savings, and the reasoning behind the recommendation. Focus especially on data related to seasonal factors and usage.

Output in JSON format:
{ 
  recommendedTireProfile: string,
  expectedLifespan: string,
  estimatedCostSavings: string,
  reasoning: string
}`,
});

const recommendOptimalTiresFlow = ai.defineFlow(
  {
    name: 'recommendOptimalTiresFlow',
    inputSchema: RecommendOptimalTiresInputSchema,
    outputSchema: RecommendOptimalTiresOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
