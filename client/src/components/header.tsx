import { Bell, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  subtitle: string;
  onTestCall: () => void;
}

export default function Header({ title, subtitle, onTestCall }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={onTestCall} className="bg-primary-600 hover:bg-primary-700 text-white">
            <Phone className="mr-2 h-4 w-4" />
            Test Call
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full"></span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
