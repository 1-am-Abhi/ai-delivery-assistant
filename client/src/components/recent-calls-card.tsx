import { useQuery } from "@tanstack/react-query";
import { Truck } from "lucide-react";
import type { CallLog } from "@shared/schema";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'bg-success-100 text-success-600';
    case 'in_progress': return 'bg-warning-100 text-warning-600';
    case 'failed': return 'bg-error-100 text-error-600';
    case 'escalated': return 'bg-error-100 text-error-600';
    default: return 'bg-gray-100 text-gray-600';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'completed': return 'Completed';
    case 'in_progress': return 'In Progress';
    case 'failed': return 'Failed';
    case 'escalated': return 'Escalated';
    default: return 'Unknown';
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

export default function RecentCallsCard() {
  const { data: callLogs, isLoading } = useQuery<CallLog[]>({
    queryKey: ['/api/call-logs'],
  });

  if (isLoading) {
    return (
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Calls</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recentCalls = callLogs?.slice(0, 4) || [];

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Calls</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </button>
        </div>
      </div>
      <div className="p-6">
        {recentCalls.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No calls yet</p>
          </div>
        ) : (
          recentCalls.map((call) => (
            <div key={call.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Truck className="text-primary-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {call.callerName || 'Delivery Agent'}
                  </p>
                  <p className="text-sm text-gray-600">{call.phoneNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(call.status)}`}>
                    {getStatusLabel(call.status)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDuration(call.duration)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {call.createdAt ? getTimeAgo(new Date(call.createdAt)) : 'Unknown time'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
