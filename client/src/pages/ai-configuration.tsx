import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/header";
import TestCallModal from "@/components/test-call-modal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AiConfiguration } from "@shared/schema";

const aiConfigSchema = z.object({
  voiceModel: z.string(),
  language: z.string(),
  responseSpeed: z.string(),
  personalityTone: z.string(),
  hindiProficiency: z.number().min(0).max(100),
});

type AiConfigForm = z.infer<typeof aiConfigSchema>;

export default function AiConfiguration() {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const { toast } = useToast();

  const { data: config, isLoading } = useQuery<AiConfiguration>({
    queryKey: ['/api/ai-configuration'],
  });

  const form = useForm<AiConfigForm>({
    resolver: zodResolver(aiConfigSchema),
    defaultValues: {
      voiceModel: config?.voiceModel || "alloy",
      language: config?.language || "hi-en",
      responseSpeed: config?.responseSpeed || "normal",
      personalityTone: config?.personalityTone || "friendly",
      hindiProficiency: config?.hindiProficiency || 80,
    },
  });

  useEffect(() => {
    if (config) {
      form.reset({
        voiceModel: config.voiceModel || "alloy",
        language: config.language || "hi-en",
        responseSpeed: config.responseSpeed || "normal",
        personalityTone: config.personalityTone || "friendly",
        hindiProficiency: config.hindiProficiency || 80,
      });
    }
  }, [config, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: AiConfigForm) => {
      const response = await apiRequest('PUT', '/api/ai-configuration', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "AI configuration updated",
        description: "Your AI settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/ai-configuration'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update AI configuration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AiConfigForm) => {
    updateMutation.mutate(data);
  };

  const handleTestCall = () => {
    setIsTestModalOpen(true);
  };

  const handleCallStarted = () => {
    // Handle call started
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header 
          title="AI Configuration" 
          subtitle="Configure AI voice and behavior settings"
          onTestCall={handleTestCall}
        />
        <main className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title="AI Configuration" 
        subtitle="Configure AI voice and behavior settings"
        onTestCall={handleTestCall}
      />
      
      <main className="p-6 overflow-y-auto h-full">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="voiceModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice Model</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a voice model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="alloy">Alloy (Default)</SelectItem>
                          <SelectItem value="echo">Echo</SelectItem>
                          <SelectItem value="fable">Fable</SelectItem>
                          <SelectItem value="onyx">Onyx</SelectItem>
                          <SelectItem value="nova">Nova</SelectItem>
                          <SelectItem value="shimmer">Shimmer</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the voice model for text-to-speech generation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language Support</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hi-en">Hindi-English Mix (Recommended)</SelectItem>
                          <SelectItem value="hi">Hindi Only</SelectItem>
                          <SelectItem value="en">English Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Set the primary language mode for conversations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="responseSpeed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Response Speed</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select response speed" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="slow">Slow (More Accurate)</SelectItem>
                          <SelectItem value="normal">Normal (Recommended)</SelectItem>
                          <SelectItem value="fast">Fast (Quick Response)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Balance between response speed and accuracy.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalityTone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personality Tone</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select personality tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly (Recommended)</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                          <SelectItem value="formal">Formal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Set the overall tone and personality of the AI assistant.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hindiProficiency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Hindi Proficiency: {field.value}%
                      </FormLabel>
                      <FormControl>
                        <Slider
                          min={0}
                          max={100}
                          step={5}
                          value={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>
                        Adjust how much Hindi the AI should use in conversations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Saving..." : "Save Configuration"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>

      <TestCallModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onCallStarted={handleCallStarted}
      />
    </div>
  );
}
