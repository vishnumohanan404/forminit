import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newsletterSubscription: boolean;
}

const NotificationTab = () => {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    newsletterSubscription: true,
  });

  const handleNotificationUpdate = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    // Here you would typically send the updated notification settings to your backend
    console.log("Notifications updated:", {
      ...notifications,
      [key]: !notifications[key],
    });
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive notifications via email
          </p>
        </div>
        <Switch
          id="email-notifications"
          checked={notifications.emailNotifications}
          onCheckedChange={() => handleNotificationUpdate("emailNotifications")}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="push-notifications">Push Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive push notifications on your devices
          </p>
        </div>
        <Switch
          id="push-notifications"
          checked={notifications.pushNotifications}
          onCheckedChange={() => handleNotificationUpdate("pushNotifications")}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="newsletter">Newsletter Subscription</Label>
          <p className="text-sm text-muted-foreground">
            Receive our newsletter with product updates
          </p>
        </div>
        <Switch
          id="newsletter"
          checked={notifications.newsletterSubscription}
          onCheckedChange={() =>
            handleNotificationUpdate("newsletterSubscription")
          }
        />
      </div>
    </>
  );
};

export default NotificationTab;
