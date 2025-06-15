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
import { recommendOptimalTires, RecommendOptimalTiresInput, RecommendOptimalTiresOutput } from "@/ai/flows/recommend-optimal-tires";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle type is required."),
  role: z.string().min(1, "Vehicle role is required."),
  historicalTirePerformanceData: z.string().min(1, "Historical data is required. Should be a JSON string."),
});

interface RecommendationFormProps {
  onRecommendationResult: (data: RecommendOptimalTiresOutput | null) => void;
}

export function RecommendationForm({ onRecommendationResult }: RecommendationFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleType: "",
      role: "",
      historicalTirePerformanceData: JSON.stringify({ 
        "data": [
          {"tireProfile": "A", "lifespan": 50000, "cost": 300, "vehicleType": "Truck", "role": "Long Haul", "seasonalPerformance": {"summer": "good", "winter": "fair"}},
          {"tireProfile": "B", "lifespan": 40000, "cost": 250, "vehicleType": "Truck", "role": "Long Haul", "seasonalPerformance": {"summer": "excellent", "winter": "poor"}}
        ]
      }, null, 2),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onRecommendationResult(null); // Clear previous results
    try {
      const input: RecommendOptimalTiresInput = values;
      const result = await recommendOptimalTires(input);
      onRecommendationResult(result);
    } catch (error) {
      console.error("Error recommending tires:", error);
      toast({
        variant: "destructive",
        title: "Recommendation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
      onRecommendationResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Recommend Optimal Tires</CardTitle>
        <CardDescription>Provide vehicle and historical data to get AI-powered tire recommendations.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Truck, Forklift, Van" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Transportation, Loading, Delivery" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="historicalTirePerformanceData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Historical Tire Performance Data (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{ "data": [{ "tireProfile": "A", "lifespan": 50000, ... }] }'
                      className="resize-y min-h-[150px] font-code"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a JSON string of historical tire performance data, including profiles, lifespan, cost, and seasonal factors.
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
                  Recommending...
                </>
              ) : (
                "Get Recommendation"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
