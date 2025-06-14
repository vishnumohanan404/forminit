import PageTitle from "@/components/common/PageTitle";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchUserDetails } from "@/services/settings";
import { UserProfile } from "@/lib/types";
import ProfileTab from "@/layouts/settings/ProfileTab";
import AccountTab from "@/layouts/settings/AccountTab";
import NotificationTab from "@/layouts/settings/NotificationTab";
import AppearanceTab from "@/layouts/settings/AppearanceTab";

const SettingsPage = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserDetails,
    staleTime: 10000,
  });
  useEffect(() => {
    if (!isLoading && user) {
      setProfile(user);
    }
  }, [isLoading, user]);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    avatar: "",
    bio: "",
  });

  return (
    <div className="px-5">
      <PageTitle>Settings</PageTitle>
      <main className="mx-auto max-w-[1100px] overflow-auto flex-grow container">
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            {/* <TabsTrigger value="notifications" disabled={true}>
              Notifications
            </TabsTrigger> */}
            {/* <TabsTrigger value="appearance">Appearance</TabsTrigger> */}
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile details here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileTab
                  profile={profile}
                  isLoading={isLoading}
                  setProfile={setProfile}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AccountTab user={user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <NotificationTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <AppearanceTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;
