// src/ai/flows/recommend-optimal-tires.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for recommending optimal tire profiles for different vehicles and roles,
 * considering details and an optional photo of a reference tire.
 *
 * - recommendOptimalTires - A function that recommends optimal tire profiles.
 * - RecommendOptimalTiresInput - The input type for the recommendOptimalTires function.
 * - RecommendOptimalTiresOutput - The output type for the recommendOptimalTires function.
 */

import {ai} from '../genkit';
import {z} from 'genkit';

const ReferenceTireSchema = z.object({
  profile: z.string().describe("The profile of the reference tire (e.g., Michelin X Multi Z)."),
  lifespanKm: z.coerce.number().optional().describe("Average lifespan in kilometers of the reference tire."),
  costEuro: z.coerce.number().optional().describe("Cost per unit in Euro for the reference tire."),
  usageConditions: z.string().optional().describe("Typical usage conditions for the reference tire."),
  photoDataUri: z.string().optional().describe(
    "A photo of the reference tire, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});

const OperationalContextSchema = z.object({
  region: z.string().optional().describe("Operational region."),
  annualMileagePerVehicleKm: z.coerce.number().optional().describe("Average annual mileage per vehicle in km."),
  fleetPriorities: z.array(z.string()).optional().describe("Key priorities for the fleet (e.g., Longevity, All-season Safety, TCO)."),
});

const RecommendOptimalTiresInputSchema = z.object({
  vehicleType: z.string().describe('The type of vehicle (e.g., truck, forklift).'),
  role: z.string().describe('The role of the vehicle (e.g., transportation, loading).'),
  referenceTire: ReferenceTireSchema.optional().describe("Details of a reference tire for comparison, including an optional photo."),
  operationalContext: OperationalContextSchema.optional().describe("Operational context of the fleet."),
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
  prompt: `You are an expert in tire performance and cost optimization. Based on the information provided for the specified vehicle type and role, recommend the optimal tire profile. Explain your reasoning.

Vehicle Type: {{{vehicleType}}}
Role: {{{role}}}

{{#if referenceTire}}
Reference Tire Details:
  Profile: {{{referenceTire.profile}}}
  {{#if referenceTire.lifespanKm}}Average Lifespan: {{{referenceTire.lifespanKm}}} km{{/if}}
  {{#if referenceTire.costEuro}}Cost: {{{referenceTire.costEuro}}} EUR{{/if}}
  {{#if referenceTire.usageConditions}}Usage Conditions: {{{referenceTire.usageConditions}}}{{/if}}
  {{#if referenceTire.photoDataUri}}
Photo of reference tire: {{media url=referenceTire.photoDataUri}}
  {{/if}}
{{else}}
No specific reference tire data provided.
{{/if}}

{{#if operationalContext}}
Operational Context:
  {{#if operationalContext.region}}Region: {{{operationalContext.region}}}{{/if}}
  {{#if operationalContext.annualMileagePerVehicleKm}}Average Annual Mileage: {{{operationalContext.annualMileagePerVehicleKm}}} km{{/if}}
  {{#if operationalContext.fleetPriorities.length}}
Fleet Priorities:
    {{#each operationalContext.fleetPriorities}}
    - {{{this}}}
    {{/each}}
  {{/if}}
{{else}}
No specific operational context provided.
{{/if}}

Provide the recommended tire profile, expected lifespan, estimated cost savings, and the reasoning behind the recommendation. Focus especially on data related to seasonal factors and usage if available from context.

Output in JSON format:
{ 
  "recommendedTireProfile": "string",
  "expectedLifespan": "string",
  "estimatedCostSavings": "string",
  "reasoning": "string"
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
