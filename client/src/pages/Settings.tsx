import PageTitle from "@/components/common/PageTitle";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchUserDetails,
  updateUserDetails,
  updateUserPassword,
} from "@/services/settings";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { UserProfile, UserPwdData } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  newsletterSubscription: boolean;
}
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg"];

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

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: false,
    newsletterSubscription: true,
  });

  const [language, setLanguage] = useState<string>("en");

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUser(profile);
  };

  const handleNotificationUpdate = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    // Here you would typically send the updated notification settings to your backend
    console.log("Notifications updated:", {
      ...notifications,
      [key]: !notifications[key],
    });
  };
  const queryClient = useQueryClient();

  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: (userData: UserProfile) => updateUserDetails(userData),
    onSuccess: () => {
      // Boom baby!
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Profile updated successfully");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      // An error happened!
      toast.error(
        error.response?.data?.message?.includes("User validation failed")
          ? "User data validation failed"
          : "Something went wrong"
      );
    },
  });
  const { mutate: updatePassword, isPending: isPwdUpdatePending } = useMutation(
    {
      mutationFn: (userPwd: UserPwdData) => updateUserPassword(userPwd),
      onSuccess: () => {
        // Boom baby!
        toast.success("Password updated successfully");
      },
      onError: (error: AxiosError<{ message: string }>) => {
        // An error happened!
        toast.error(
          error.response?.data?.message?.includes("User validation failed")
            ? "User data validation failed"
            : "Something went wrong"
        );
      },
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size and type
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size exceeds 2MB limit");
        return;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error("Only JPG/JPEG files are allowed");
        return;
      }

      // If valid, update profile with new avatar
      // const reader = new FileReader();
      // reader.onload = () => {
      //   setProfile({ ...profile, avatar: reader.result as string });
      // };
      // reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = async (data: {
    currentPwd?: string;
    newPwd: string;
    confirmPwd: string;
  }) => {
    console.log("password :>> ", data);
    updatePassword(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      currentPwd: "",
      newPwd: "",
      confirmPwd: "",
    },
    mode: "onBlur",
  });
  useEffect(() => {
    const { unsubscribe } = watch((value) => {
      console.log(value);
    });
    return () => unsubscribe();
  }, [watch]);

  return (
    <div className="overflow-y-scroll px-5">
      <PageTitle>Settings</PageTitle>
      <main className="mx-auto max-w-[1100px] min-h-[66vh] overflow-auto flex-grow container mb-28">
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications" disabled={true}>
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance" disabled={true}>
              Appearance
            </TabsTrigger>
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
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {isLoading ? (
                      <Skeleton className="rounded-full h-24 w-24" />
                    ) : (
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={profile?.avatar}
                          alt={profile?.fullName}
                        />
                        <AvatarFallback>
                          {profile?.fullName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    {isLoading ? (
                      <Skeleton className="h-[36px] w-[133px]" />
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/jpeg, image/jpg"
                          style={{ display: "none" }}
                          id="avatar-upload"
                          onChange={handleFileChange}
                        />
                        <Button
                          variant="outline"
                          type="button"
                          onClick={() =>
                            document.getElementById("avatar-upload")?.click()
                          }
                        >
                          Change Avatar
                        </Button>
                      </>
                    )}
                  </div>
                  <div className="space-y-2">
                    {isLoading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      <Label htmlFor="name">Name </Label>
                    )}
                    {isLoading ? (
                      <div className="pt-1">
                        <Skeleton className="h-[36px] w-full" />
                      </div>
                    ) : (
                      <Input
                        id="name"
                        value={profile?.fullName}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            fullName: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    {isLoading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      <Label htmlFor="name">Email </Label>
                    )}
                    {isLoading ? (
                      <div className="pt-1">
                        <Skeleton className="h-[36px] w-full" />
                      </div>
                    ) : (
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email}
                        onChange={(e) =>
                          setProfile({ ...profile, email: e.target.value })
                        }
                        disabled
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    {isLoading ? (
                      <Skeleton className="h-4 w-20" />
                    ) : (
                      <Label htmlFor="name">Bio </Label>
                    )}
                    {isLoading ? (
                      <div className="pt-1">
                        <Skeleton className="h-[60px] w-full" />
                      </div>
                    ) : (
                      <Textarea
                        id="bio"
                        value={profile?.bio}
                        onChange={(e) =>
                          setProfile({ ...profile, bio: e.target.value })
                        }
                      />
                    )}
                  </div>
                  {isLoading ? (
                    <div className="pt-1">
                      <Skeleton className="h-[36px] w-[128px]" />
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="min-w-[128px]"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  )}
                </form>
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
                <form
                  onSubmit={handleSubmit(handlePasswordSubmit)}
                  className="space-y-4"
                >
                  {!user?.googleId && (
                    <div className="space-y-2">
                      <Label htmlFor="currentPwd">Current Password</Label>
                      <Input
                        id="currentPwd"
                        type="password"
                        {...register("currentPwd", {
                          required: user
                            ? !user?.googleId
                              ? "Current password is required"
                              : false
                            : false,
                        })}
                      />
                      {errors.currentPwd && (
                        <p className="text-red-500 text-sm">
                          {errors.currentPwd.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="newPwd">New Password</Label>
                    <Input
                      id="newPwd"
                      type="password"
                      {...register("newPwd", {
                        required: "Please enter a new password",
                        minLength: {
                          value: 6,
                          message:
                            "Password must be at least 6 characters long",
                        },
                        maxLength: {
                          value: 30,
                          message:
                            "Password must be at most 30 characters long",
                        },
                      })}
                    />
                    {errors.newPwd && (
                      <p className="text-red-500 text-sm">
                        {errors.newPwd.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPwd">Confirm New Password</Label>
                    <Input
                      id="confirmPwd"
                      type="password"
                      {...register("confirmPwd", {
                        required: "Confirm password is required",
                        validate: (value) =>
                          value === getValues().newPwd ||
                          "Passwords do not match",
                      })}
                    />
                    {errors.confirmPwd && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPwd.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !!errors.confirmPwd ||
                      !!errors.currentPwd ||
                      !!errors.newPwd ||
                      isPwdUpdatePending
                    }
                    className="min-w-[154px]"
                  >
                    {isPwdUpdatePending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </form>
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
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.emailNotifications}
                    onCheckedChange={() =>
                      handleNotificationUpdate("emailNotifications")
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">
                      Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications on your devices
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.pushNotifications}
                    onCheckedChange={() =>
                      handleNotificationUpdate("pushNotifications")
                    }
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
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SettingsPage;
