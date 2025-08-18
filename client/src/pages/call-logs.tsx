import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { useState } from "react";
import TestCallModal from "@/components/test-call-modal";
import type { CallLog } from "@shared/schema";

export default function CallLogs() {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  const { data: callLogs, isLoading } = useQuery<CallLog[]>({
    queryKey: ['/api/call-logs'],
  });

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
          title="Call Logs" 
          subtitle="View all delivery call history and details"
          onTestCall={handleTestCall}
        />
        <main className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title="Call Logs" 
        subtitle="View all delivery call history and details"
        onTestCall={handleTestCall}
      />
      
      <main className="p-6 overflow-y-auto h-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Calls</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {callLogs?.map((call) => (
                  <tr key={call.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {call.callerName || 'Delivery Agent'}
                        </div>
                        <div className="text-sm text-gray-500">{call.phoneNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        call.status === 'completed' ? 'bg-success-100 text-success-600' :
                        call.status === 'in_progress' ? 'bg-warning-100 text-warning-600' :
                        call.status === 'failed' ? 'bg-error-100 text-error-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {call.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {call.duration ? `${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {call.createdAt ? new Date(call.createdAt).toLocaleString() : 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {call.packageId || 'N/A'}
                    </td>
                  </tr>
                )) || []}
              </tbody>
            </table>
            
            {(!callLogs || callLogs.length === 0) && (
              <div className="text-center py-12">
                <p className="text-gray-500">No call logs found</p>
                <p className="text-sm text-gray-400 mt-1">Call logs will appear here once you start receiving calls</p>
              </div>
            )}
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
