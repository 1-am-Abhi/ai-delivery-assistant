import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/header";
import TestCallModal from "@/components/test-call-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { DeliverySettings } from "@shared/schema";

const deliverySettingsSchema = z.object({
  defaultInstructions: z.string().min(10, "Instructions must be at least 10 characters"),
  emergencyContacts: z.array(z.string()).optional(),
  allowCod: z.boolean(),
  requireOtp: z.boolean(),
  escalationThreshold: z.number().min(1).max(10),
});

type DeliverySettingsForm = z.infer<typeof deliverySettingsSchema>;

export default function DeliverySettings() {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState("");
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<DeliverySettings>({
    queryKey: ['/api/delivery-settings'],
  });

  const form = useForm<DeliverySettingsForm>({
    resolver: zodResolver(deliverySettingsSchema),
    defaultValues: {
      defaultInstructions: settings?.defaultInstructions || "",
      emergencyContacts: settings?.emergencyContacts || [],
      allowCod: settings?.allowCod ?? true,
      requireOtp: settings?.requireOtp ?? false,
      escalationThreshold: settings?.escalationThreshold || 3,
    },
  });

  // Update form when settings load
  useEffect(() => {
    if (settings) {
      form.reset({
        defaultInstructions: settings.defaultInstructions,
        emergencyContacts: settings.emergencyContacts || [],
        allowCod: settings.allowCod === null ? true : settings.allowCod,
        requireOtp: settings.requireOtp === null ? false : settings.requireOtp,
        escalationThreshold: settings.escalationThreshold === null ? 3 : settings.escalationThreshold,
      });
    }
  }, [settings, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: DeliverySettingsForm) => {
      const response = await apiRequest('PUT', '/api/delivery-settings', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your delivery settings have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/delivery-settings'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: DeliverySettingsForm) => {
    updateMutation.mutate(data);
  };

  const handleTestCall = () => {
    setIsTestModalOpen(true);
  };

  const handleCallStarted = () => {
    // Handle call started
  };

  const addEmergencyContact = () => {
    if (emergencyContact.trim()) {
      const currentContacts = form.getValues('emergencyContacts') || [];
      form.setValue('emergencyContacts', [...currentContacts, emergencyContact.trim()]);
      setEmergencyContact("");
    }
  };

  const removeEmergencyContact = (index: number) => {
    const currentContacts = form.getValues('emergencyContacts') || [];
    form.setValue('emergencyContacts', currentContacts.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header 
          title="Delivery Settings" 
          subtitle="Configure delivery instructions and preferences"
          onTestCall={handleTestCall}
        />
        <main className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title="Delivery Settings" 
        subtitle="Configure delivery instructions and preferences"
        onTestCall={handleTestCall}
      />
      
      <main className="p-6 overflow-y-auto h-full">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="defaultInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Delivery Instructions</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter default instructions for delivery agents..."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        These instructions will be shared with delivery agents by the AI assistant.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormLabel>Emergency Contacts</FormLabel>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="+91 98765 43210"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                    />
                    <Button type="button" onClick={addEmergencyContact}>
                      Add
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {form.watch('emergencyContacts')?.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span>{contact}</span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeEmergencyContact(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="allowCod"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Allow COD Payments</FormLabel>
                        <FormDescription>
                          Enable the AI to handle cash-on-delivery transactions.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requireOtp"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Require OTP Verification</FormLabel>
                        <FormDescription>
                          Require OTP verification for all deliveries.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="escalationThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escalation Threshold (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="10"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Escalate to human if call exceeds this duration.
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
                  {updateMutation.isPending ? "Saving..." : "Save Settings"}
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
