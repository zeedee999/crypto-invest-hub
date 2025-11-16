import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Settings as SettingsIcon, MessageSquare, Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";

export default function Settings() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [chatEnabled, setChatEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      try {
        // Load chat preference from database
        const { data: profile } = await supabase
          .from('profiles')
          .select('chat_enabled')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setChatEnabled(profile.chat_enabled ?? true);
        }

        // Load notifications preference from localStorage
        const savedNotifPref = localStorage.getItem('notificationsEnabled');
        if (savedNotifPref !== null) {
          setNotifications(savedNotifPref === 'true');
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const handleChatToggle = async (enabled: boolean) => {
    if (!user) return;
    
    setChatEnabled(enabled);
    
    try {
      // Save to database
      const { error } = await supabase
        .from('profiles')
        .update({ chat_enabled: enabled })
        .eq('id', user.id);

      if (error) throw error;
      
      // Dispatch custom event to notify SmartsuppChat component
      window.dispatchEvent(new CustomEvent('chatWidgetToggle', { detail: { enabled } }));
      
      toast.success(enabled ? 'Chat widget enabled' : 'Chat widget disabled');
    } catch (error) {
      console.error('Error updating chat preference:', error);
      toast.error('Failed to update chat preference');
      setChatEnabled(!enabled); // Revert on error
    }
  };

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem('notificationsEnabled', String(enabled));
    toast.success(enabled ? 'Notifications enabled' : 'Notifications disabled');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>
        </div>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="text-foreground font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">User ID</Label>
              <p className="text-foreground font-mono text-sm">{user?.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Sun className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <Label htmlFor="theme-toggle" className="text-base">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'dark' ? 'Currently using dark theme' : 'Currently using light theme'}
                  </p>
                </div>
              </div>
              <Switch
                id="theme-toggle"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Communication Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Communication</CardTitle>
            <CardDescription>Manage how you communicate and receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="chat-toggle" className="text-base">Live Chat Support</Label>
                  <p className="text-sm text-muted-foreground">
                    Show or hide the live chat widget
                  </p>
                </div>
              </div>
              <Switch
                id="chat-toggle"
                checked={chatEnabled}
                onCheckedChange={handleChatToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="notifications-toggle" className="text-base">Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about your investments
                  </p>
                </div>
              </div>
              <Switch
                id="notifications-toggle"
                checked={notifications}
                onCheckedChange={handleNotificationsToggle}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
