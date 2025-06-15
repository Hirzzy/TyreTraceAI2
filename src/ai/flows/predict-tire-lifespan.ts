// src/ai/flows/predict-tire-lifespan.ts
'use server';
/**
 * @fileOverview Predicts the lifespan of a tire based on historical data and usage patterns.
 *
 * - predictTireLifespan - Predicts tire lifespan.
 * - PredictTireLifespanInput - The input type for the predictTireLifespan function.
 * - PredictTireLifespanOutput - The return type for the predictTireLifespan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictTireLifespanInputSchema = z.object({
  tireId: z.string().describe('The unique identifier of the tire.'),
  vehicleType: z.string().describe('The type of vehicle the tire is used on.'),
  usagePattern: z.string().describe('Description of how the vehicle is used (e.g., highway miles, city driving, off-road).'),
  historicalData: z.string().describe('JSON string of the tire historical performance data, including mileage, pressure, and wear.'),
  seasonalFactors: z.string().describe('Description of the seasonal factors affecting tire wear (e.g., temperature, road conditions).'),
});
export type PredictTireLifespanInput = z.infer<typeof PredictTireLifespanInputSchema>;

const PredictTireLifespanOutputSchema = z.object({
  predictedLifespanMiles: z.number().describe('The predicted lifespan of the tire in miles.'),
  confidenceLevel: z.number().describe('A measure of the confidence level in the prediction (0-1).'),
  reasoning: z.string().describe('Explanation of why the lifespan is predicted to be what it is.'),
});
export type PredictTireLifespanOutput = z.infer<typeof PredictTireLifespanOutputSchema>;

export async function predictTireLifespan(input: PredictTireLifespanInput): Promise<PredictTireLifespanOutput> {
  return predictTireLifespanFlow(input);
}

const predictTireLifespanPrompt = ai.definePrompt({
  name: 'predictTireLifespanPrompt',
  input: {
    schema: PredictTireLifespanInputSchema,
  },
  output: {
    schema: PredictTireLifespanOutputSchema,
  },
  prompt: `You are an expert in predicting tire lifespan based on usage and historical data. Given the following information, predict the remaining lifespan of the tire in miles.

Tire ID: {{{tireId}}}
Vehicle Type: {{{vehicleType}}}
Usage Pattern: {{{usagePattern}}}
Historical Data: {{{historicalData}}}
Seasonal Factors: {{{seasonalFactors}}}

Consider all factors to provide an accurate prediction. Provide also confidence level (0-1) and reasoning for your prediction.
`,
});

const predictTireLifespanFlow = ai.defineFlow(
  {
    name: 'predictTireLifespanFlow',
    inputSchema: PredictTireLifespanInputSchema,
    outputSchema: PredictTireLifespanOutputSchema,
  },
  async input => {
    const {output} = await predictTireLifespanPrompt(input);
    return output!;
  }
);
