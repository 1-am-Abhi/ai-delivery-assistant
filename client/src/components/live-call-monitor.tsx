import { useState, useEffect } from "react";
import { Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveCallMonitorProps {
  isVisible: boolean;
  onClose: () => void;
  callData?: {
    phoneNumber: string;
    duration: number;
    lastMessage?: string;
    aiResponse?: string;
  };
}

export default function LiveCallMonitor({ 
  isVisible, 
  onClose, 
  callData 
}: LiveCallMonitorProps) {
  const [duration, setDuration] = useState(callData?.duration || 0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-80 z-50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900">Live Call</h4>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-success-600">{formatDuration(duration)}</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <Truck className="text-primary-600" size={16} />
          <span className="text-sm">
            Delivery Agent: {callData?.phoneNumber || '+91 98765 43210'}
          </span>
        </div>
        
        {callData?.lastMessage && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">{callData.lastMessage}</p>
          </div>
        )}
        
        {callData?.aiResponse && (
          <div className="bg-primary-50 rounded-lg p-3">
            <p className="text-sm text-primary-700">{callData.aiResponse}</p>
          </div>
        )}
        
        <Button 
          onClick={onClose}
          className="w-full bg-error-600 hover:bg-error-700 text-white py-2 text-sm"
        >
          End Call & Escalate
        </Button>
      </div>
    </div>
  );
}
