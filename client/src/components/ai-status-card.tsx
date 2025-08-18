import { useQuery } from "@tanstack/react-query";
import { Mic, Brain, Languages, Shield } from "lucide-react";
import type { AiConfiguration } from "@shared/schema";

export default function AIStatusCard() {
  const { data: aiConfig } = useQuery<AiConfiguration>({
    queryKey: ['/api/ai-configuration'],
  });

  const statusItems = [
    {
      icon: Mic,
      label: "Voice Recognition",
      status: "Active",
      color: "success",
    },
    {
      icon: Brain,
      label: "AI Processing", 
      status: "Active",
      color: "success",
    },
    {
      icon: Languages,
      label: "Hindi Support",
      status: aiConfig?.hindiProficiency && aiConfig.hindiProficiency > 75 ? "Active" : "Learning",
      color: aiConfig?.hindiProficiency && aiConfig.hindiProficiency > 75 ? "success" : "warning",
    },
    {
      icon: Shield,
      label: "Security",
      status: "Secure",
      color: "success",
    },
  ];

  function getStatusColor(color: string) {
    switch (color) {
      case 'success': return 'bg-success-100 text-success-600';
      case 'warning': return 'bg-warning-100 text-warning-600';
      case 'error': return 'bg-error-100 text-error-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  function getIconColor(color: string) {
    switch (color) {
      case 'success': return 'bg-success-100 text-success-600';
      case 'warning': return 'bg-warning-100 text-warning-600';
      case 'error': return 'bg-error-100 text-error-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Assistant Status</h3>
      <div className="space-y-4">
        {statusItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconColor(item.color)}`}>
                  <Icon size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.color)}`}>
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
