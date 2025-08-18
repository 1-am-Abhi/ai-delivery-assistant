import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/header";
import TestCallModal from "@/components/test-call-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Plus, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PhoneNumbers() {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newNumberLabel, setNewNumberLabel] = useState("");
  const { toast } = useToast();

  // Mock data for phone numbers - in real app this would come from API
  const phoneNumbers = [
    {
      id: "1",
      number: "+91 98765 43210",
      label: "Primary Delivery Line",
      status: "active",
      callsReceived: 45,
      lastCall: "2024-01-15T10:30:00Z",
    },
    {
      id: "2", 
      number: "+91 87654 32109",
      label: "Backup Line",
      status: "active",
      callsReceived: 12,
      lastCall: "2024-01-14T16:45:00Z",
    },
  ];

  const handleTestCall = () => {
    setIsTestModalOpen(true);
  };

  const handleCallStarted = () => {
    // Handle call started
  };

  const addPhoneNumber = () => {
    if (!newNumber.trim() || !newNumberLabel.trim()) {
      toast({
        title: "Error",
        description: "Please enter both phone number and label",
        variant: "destructive",
      });
      return;
    }

    // In real app, this would make API call
    toast({
      title: "Phone number added",
      description: `${newNumberLabel} (${newNumber}) has been added successfully.`,
    });
    
    setNewNumber("");
    setNewNumberLabel("");
  };

  const removePhoneNumber = (id: string, label: string) => {
    // In real app, this would make API call
    toast({
      title: "Phone number removed",
      description: `${label} has been removed successfully.`,
    });
  };

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title="Phone Numbers" 
        subtitle="Manage your delivery phone numbers and Twilio configuration"
        onTestCall={handleTestCall}
      />
      
      <main className="p-6 overflow-y-auto h-full">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Twilio Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <span>Twilio Configuration</span>
              </CardTitle>
              <CardDescription>
                Configure your Twilio credentials to enable voice calling functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                  <span className="text-sm font-medium text-warning-700">Twilio Not Configured</span>
                </div>
                <p className="text-sm text-warning-600 mt-1">
                  Twilio credentials are required for voice calling. Please add the following environment variables:
                </p>
                <ul className="text-sm text-warning-600 mt-2 space-y-1">
                  <li>• TWILIO_ACCOUNT_SID</li>
                  <li>• TWILIO_AUTH_TOKEN</li>
                  <li>• TWILIO_PHONE_NUMBER</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="twilioSid">Account SID</Label>
                  <Input 
                    id="twilioSid"
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="twilioToken">Auth Token</Label>
                  <Input 
                    id="twilioToken"
                    type="password"
                    placeholder="••••••••••••••••••••••••••••••••"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="twilioNumber">Phone Number</Label>
                  <Input 
                    id="twilioNumber"
                    placeholder="+1234567890"
                    disabled
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                These credentials should be set as environment variables in your Replit Secrets for security.
              </p>
            </CardContent>
          </Card>

          {/* Add New Phone Number */}
          <Card>
            <CardHeader>
              <CardTitle>Add Phone Number</CardTitle>
              <CardDescription>
                Register a new phone number for receiving delivery calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numberLabel">Label</Label>
                  <Input
                    id="numberLabel"
                    placeholder="e.g., Primary Delivery Line"
                    value={newNumberLabel}
                    onChange={(e) => setNewNumberLabel(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+91 98765 43210"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addPhoneNumber} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Number
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Phone Numbers */}
          <Card>
            <CardHeader>
              <CardTitle>Registered Phone Numbers</CardTitle>
              <CardDescription>
                Manage your active delivery phone numbers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phoneNumbers.map((phone) => (
                  <div key={phone.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Phone className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{phone.label}</h3>
                          <p className="text-sm text-gray-600">{phone.number}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Badge variant={phone.status === 'active' ? 'default' : 'secondary'}>
                            {phone.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {phone.callsReceived} calls received
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => removePhoneNumber(phone.id, phone.label)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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