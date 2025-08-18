import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function StatsCard({ 
  label, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  iconColor, 
  iconBg 
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm ${trend === 'up' ? 'text-success-600' : 'text-success-600'} ml-1`}>
              {change}
            </span>
          </div>
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className={`${iconColor} text-xl`} size={24} />
        </div>
      </div>
    </div>
  );
}
