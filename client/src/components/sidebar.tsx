import { Link, useLocation } from "wouter";
import { Phone, BarChart3, PhoneCall, MapPin, Bot, PhoneForwarded, Settings } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: BarChart3, label: "Dashboard" },
    { path: "/call-logs", icon: PhoneCall, label: "Call Logs" },
    { path: "/delivery-settings", icon: MapPin, label: "Delivery Settings" },
    { path: "/ai-configuration", icon: Bot, label: "AI Configuration" },
    { path: "/phone-numbers", icon: PhoneForwarded, label: "Phone Numbers" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <Phone className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Delivery</h1>
            <p className="text-sm text-gray-600">Assistant</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    isActive 
                      ? "text-primary-600 bg-primary-50 font-medium" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-success-50 border border-success-500 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-success-600">System Online</span>
          </div>
          <p className="text-xs text-success-600 mt-1">Ready to handle calls</p>
        </div>
      </div>
    </div>
  );
}
