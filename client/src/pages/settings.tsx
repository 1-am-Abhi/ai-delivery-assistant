import { useState } from "react";
import Header from "@/components/header";
import TestCallModal from "@/components/test-call-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shield, Bell, Download, Trash2, Key, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    callAlerts: true,
    emailReports: false,
    smsBackup: true,
    systemUpdates: true,
  });
  const { toast } = useToast();

  const handleTestCall = () => {
    setIsTestModalOpen(true);
  };

  const handleCallStarted = () => {
    // Handle call started
  };

  const exportData = () => {
    toast({
      title: "Data exported",
      description: "Your data has been exported successfully.",
    });
  };

  const clearData = () => {
    toast({
      title: "Data cleared",
      description: "All call logs and settings have been reset.",
      variant: "destructive",
    });
  };

  const regenerateApiKey = () => {
    toast({
      title: "API key regenerated",
      description: "A new API key has been generated.",
    });
  };

  return (
    <div className="flex-1 overflow-hidden">
      <Header 
        title="Settings" 
        subtitle="Manage system preferences and account settings"
        onTestCall={handleTestCall}
      />
      
      <main className="p-6 overflow-y-auto h-full">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>
                Configure how you want to be notified about system events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Call Alerts</Label>
                  <p className="text-sm text-gray-500">
                    Get notified when new calls are received
                  </p>
                </div>
                <Switch
                  checked={notifications.callAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, callAlerts: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Reports</Label>
                  <p className="text-sm text-gray-500">
                    Receive daily/weekly summary reports via email
                  </p>
                </div>
                <Switch
                  checked={notifications.emailReports}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, emailReports: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Backup</Label>
                  <p className="text-sm text-gray-500">
                    Send SMS when AI escalates calls to human
                  </p>
                </div>
                <Switch
                  checked={notifications.smsBackup}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, smsBackup: checked }))
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">System Updates</Label>
                  <p className="text-sm text-gray-500">
                    Get notified about system updates and maintenance
                  </p>
                </div>
                <Switch
                  checked={notifications.systemUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, systemUpdates: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Manage your security preferences and API access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Change Password</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Update your account password for enhanced security
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                  </div>
                  <Button className="mt-4">Update Password</Button>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-base">API Access</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Manage API keys for external integrations
                  </p>
                  <div className="flex items-center space-x-4">
                    <Input 
                      value="ai-delivery-xxxxxxxxxxxxxxxx" 
                      disabled
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={regenerateApiKey}>
                      <Key className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>
                Configure contacts for escalated calls and system alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryContact">Primary Contact</Label>
                  <Input id="primaryContact" placeholder="+91 98765 43210" />
                </div>
                <div>
                  <Label htmlFor="secondaryContact">Secondary Contact</Label>
                  <Input id="secondaryContact" placeholder="+91 87654 32109" />
                </div>
              </div>
              <div>
                <Label htmlFor="emailContact">Email Contact</Label>
                <Input id="emailContact" type="email" placeholder="admin@yourcompany.com" />
              </div>
              <Button>Save Contacts</Button>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
              <CardDescription>
                Export or clear your data and call history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Export Data</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Download all your call logs, settings, and configuration data
                  </p>
                  <Button onClick={exportData} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-base">Clear Data</Label>
                  <p className="text-sm text-gray-500 mb-3">
                    Permanently delete all call logs and reset settings to default
                  </p>
                  <Button onClick={clearData} variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>
                Current system status and version information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-600">System Version</Label>
                  <p className="font-mono">v1.0.0</p>
                </div>
                <div>
                  <Label className="text-gray-600">Last Updated</Label>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Database Status</Label>
                  <p className="text-success-600">Connected</p>
                </div>
                <div>
                  <Label className="text-gray-600">AI Service</Label>
                  <p className="text-success-600">Online</p>
                </div>
              </div>
            </CardContent>
          </Card>

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