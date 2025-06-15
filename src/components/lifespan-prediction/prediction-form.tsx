"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { predictTireLifespan, PredictTireLifespanInput, PredictTireLifespanOutput } from "@/ai/flows/predict-tire-lifespan";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  tireId: z.string().min(1, "Tire ID is required."),
  vehicleType: z.string().min(1, "Vehicle type is required."),
  usagePattern: z.string().min(1, "Usage pattern is required."),
  historicalData: z.string().min(1, "Historical data is required. Should be a JSON string."),
  seasonalFactors: z.string().min(1, "Seasonal factors are required."),
});

interface PredictionFormProps {
  onPredictionResult: (data: PredictTireLifespanOutput | null) => void;
}

export function PredictionForm({ onPredictionResult }: PredictionFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tireId: "",
      vehicleType: "",
      usagePattern: "e.g., Highway miles, city driving, off-road",
      historicalData: JSON.stringify({ mileage: [10000, 20000, 30000], pressure: [100, 98, 95], wear: [1, 2, 3] }, null, 2),
      seasonalFactors: "e.g., Hot summers, cold winters with snow",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onPredictionResult(null); // Clear previous results
    try {
      const input: PredictTireLifespanInput = values;
      const result = await predictTireLifespan(input);
      onPredictionResult(result);
    } catch (error) {
      console.error("Error predicting lifespan:", error);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
      onPredictionResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Predict Tire Lifespan</CardTitle>
        <CardDescription>Enter tire details to get an AI-powered lifespan prediction.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tireId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tire ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., TIRE-001A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Semi-trailer truck, Forklift" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="usagePattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Pattern</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe how the vehicle is typically used..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    E.g., Long-haul highway driving, frequent stop-start city delivery, off-road construction site.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="historicalData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Performance Data (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{ "mileage": [10000, 20000], "pressure": [100, 98], "wear": [1, 2] }'
                      className="resize-y min-h-[100px] font-code"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a JSON string of historical data, including mileage, pressure, and wear.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seasonalFactors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seasonal Factors</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe seasonal impacts..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    E.g., Extreme summer heat leading to increased wear, icy winter roads requiring specific tire compounds.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Predict Lifespan"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
