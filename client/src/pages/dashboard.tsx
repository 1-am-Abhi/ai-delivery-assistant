import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Phone, CheckCircle, Clock, TrendingUp } from "lucide-react";
import Header from "@/components/header";
import StatsCard from "@/components/stats-card";
import RecentCallsCard from "@/components/recent-calls-card";
import AIStatusCard from "@/components/ai-status-card";
import QuickActionsCard from "@/components/quick-actions-card";
import PerformanceMetricsCard from "@/components/performance-metrics-card";
import LiveCallMonitor from "@/components/live-call-monitor";
import TestCallModal from "@/components/test-call-modal";

interface CallStats {
  totalCalls: number;
  successfulDeliveries: number;
  averageDuration: number;
  successRate: number;
}

export default function Dashboard() {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isLiveCallVisible, setIsLiveCallVisible] = useState(false);
  const [liveCallData, setLiveCallData] = useState<any>(null);

  const { data: stats, isLoading: statsLoading } = useQuery<CallStats>({
    queryKey: ['/api/stats'],
  });

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTestCall = () => {
    setIsTestModalOpen(true);
  };

  const handleCallStarted = (callData: any) => {
    setLiveCallData(callData);
    setIsLiveCallVisible(true);
    
    // Auto hide after demo period
    setTimeout(() => {
      setIsLiveCallVisible(false);
    }, 15000);
  };

  const handleUpdateInstructions = () => {
    // Navigate to delivery settings
    window.location.href = '/delivery-settings';
  };

  const handleVoiceSettings = () => {
    // Navigate to AI configuration
    window.location.href = '/ai-configuration';
  };

  const handleEmergencyContacts = () => {
    // Navigate to settings
    window.location.href = '/settings';
  };

  if (statsLoading) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header 
          title="Dashboard" 
          subtitle="Monitor your AI delivery assistant performance"
          onTestCall={handleTestCall}
        />
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title="Dashboard" 
        subtitle="Monitor your AI delivery assistant performance"
        onTestCall={handleTestCall}
      />
      
      <main className="p-6 overflow-y-auto h-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            label="Total Calls"
            value={stats?.totalCalls.toString() || "0"}
            change="+12% from last week"
            trend="up"
            icon={Phone}
            iconColor="text-primary-600"
            iconBg="bg-primary-100"
          />
          <StatsCard
            label="Successful Deliveries"
            value={stats?.successfulDeliveries.toString() || "0"}
            change="+8% from last week"
            trend="up"
            icon={CheckCircle}
            iconColor="text-success-600"
            iconBg="bg-success-100"
          />
          <StatsCard
            label="Average Call Duration"
            value={stats ? formatDuration(Math.round(stats.averageDuration)) : "0:00"}
            change="-15s from last week"
            trend="down"
            icon={Clock}
            iconColor="text-warning-600"
            iconBg="bg-warning-100"
          />
          <StatsCard
            label="Success Rate"
            value={stats ? `${Math.round(stats.successRate)}%` : "0%"}
            change="+2.1% from last week"
            trend="up"
            icon={TrendingUp}
            iconColor="text-success-600"
            iconBg="bg-success-100"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Calls */}
          <RecentCallsCard />

          {/* Quick Actions & Status */}
          <div className="space-y-6">
            <AIStatusCard />
            <QuickActionsCard
              onUpdateInstructions={handleUpdateInstructions}
              onVoiceSettings={handleVoiceSettings}
              onEmergencyContacts={handleEmergencyContacts}
            />
            <PerformanceMetricsCard />
          </div>
        </div>
      </main>

      <LiveCallMonitor 
        isVisible={isLiveCallVisible}
        onClose={() => setIsLiveCallVisible(false)}
        callData={liveCallData}
      />

      <TestCallModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        onCallStarted={handleCallStarted}
      />
    </div>
  );
}
