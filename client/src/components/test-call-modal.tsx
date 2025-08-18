import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TestCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCallStarted: (callData: any) => void;
}

export default function TestCallModal({ 
  isOpen, 
  onClose, 
  onCallStarted 
}: TestCallModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [scenario, setScenario] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStartCall = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/test-call', {
        phoneNumber,
        scenario,
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Test call initiated",
          description: `Calling ${phoneNumber}...`,
        });
        
        onCallStarted({
          phoneNumber,
          callSid: result.callSid,
          scenario,
        });
        
        onClose();
      } else {
        throw new Error(result.message || 'Failed to start call');
      }
    } catch (error) {
      toast({
        title: "Failed to start call",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Test AI Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="scenario" className="text-sm font-medium text-gray-700">
              Test Scenario
            </Label>
            <Select value={scenario} onValueChange={setScenario}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Delivery</SelectItem>
                <SelectItem value="cod">COD Delivery</SelectItem>
                <SelectItem value="otp">OTP Verification Required</SelectItem>
                <SelectItem value="return">Package Return</SelectItem>
                <SelectItem value="hindi">Hindi Conversation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-2"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={handleStartCall}
              disabled={isLoading}
              className="flex-1 bg-primary-600 hover:bg-primary-700"
            >
              {isLoading ? "Starting..." : "Start Test Call"}
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
