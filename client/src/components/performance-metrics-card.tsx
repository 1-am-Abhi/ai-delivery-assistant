export default function PerformanceMetricsCard() {
  const metrics = [
    { label: "Response Accuracy", value: 94, color: "success" },
    { label: "Call Resolution", value: 89, color: "primary" },
    { label: "Language Detection", value: 96, color: "warning" },
  ];

  function getProgressColor(color: string) {
    switch (color) {
      case 'success': return 'bg-success-500';
      case 'primary': return 'bg-primary-500';
      case 'warning': return 'bg-warning-500';
      default: return 'bg-gray-500';
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{metric.label}</span>
              <span className="text-sm font-bold text-gray-900">{metric.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${getProgressColor(metric.color)}`}
                style={{ width: `${metric.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
