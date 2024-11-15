import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/lib/types";
import { updateUserDetails } from "@/services/settings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg"];

const ProfileTab = ({
  profile,
  setProfile,
  isLoading,
}: {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoading: boolean;
}) => {
  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateUser(profile);
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
  return (
    <form onSubmit={handleProfileUpdate} className="space-y-4">
      <div className="flex items-center space-x-4">
        {isLoading ? (
          <Skeleton className="rounded-full h-24 w-24" />
        ) : (
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.avatar} alt={profile?.fullName} />
            <AvatarFallback>{profile?.fullName?.charAt(0)}</AvatarFallback>
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
              onClick={() => document.getElementById("avatar-upload")?.click()}
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
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
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
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        )}
      </div>
      {isLoading ? (
        <div className="pt-1">
          <Skeleton className="h-[36px] w-[128px]" />
        </div>
      ) : (
        <Button type="submit" disabled={isPending} className="min-w-[128px]">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      )}
    </form>
  );
};

export default ProfileTab;
