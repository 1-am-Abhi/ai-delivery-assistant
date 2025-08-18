import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import CallLogs from "@/pages/call-logs";
import DeliverySettings from "@/pages/delivery-settings";
import AiConfiguration from "@/pages/ai-configuration";
import PhoneNumbers from "@/pages/phone-numbers";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/call-logs" component={CallLogs} />
      <Route path="/delivery-settings" component={DeliverySettings} />
      <Route path="/ai-configuration" component={AiConfiguration} />
      <Route path="/phone-numbers" component={PhoneNumbers} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex min-h-screen">
          <Sidebar />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
