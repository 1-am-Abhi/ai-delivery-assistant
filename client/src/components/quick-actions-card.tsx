import { MapPin, Volume2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsCardProps {
  onUpdateInstructions: () => void;
  onVoiceSettings: () => void;
  onEmergencyContacts: () => void;
}

export default function QuickActionsCard({
  onUpdateInstructions,
  onVoiceSettings,
  onEmergencyContacts,
}: QuickActionsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <Button 
          onClick={onUpdateInstructions}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3"
        >
          <MapPin className="mr-2" size={16} />
          Update Delivery Instructions
        </Button>
        <Button 
          onClick={onVoiceSettings}
          variant="outline"
          className="w-full py-3"
        >
          <Volume2 className="mr-2" size={16} />
          Voice Settings
        </Button>
        <Button 
          onClick={onEmergencyContacts}
          variant="outline" 
          className="w-full py-3"
        >
          <Phone className="mr-2" size={16} />
          Emergency Contacts
        </Button>
      </div>
    </div>
  );
}
