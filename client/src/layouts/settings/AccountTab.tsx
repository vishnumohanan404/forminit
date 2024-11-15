import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile, UserPwdData } from "@/lib/types";
import { updateUserPassword } from "@/services/settings";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AccountTab = ({ user }: { user: UserProfile }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm({
    defaultValues: {
      currentPwd: "",
      newPwd: "",
      confirmPwd: "",
    },
    mode: "onBlur",
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

  const handlePasswordSubmit = async (data: {
    currentPwd?: string;
    newPwd: string;
    confirmPwd: string;
  }) => {
    console.log("password :>> ", data);
    updatePassword(data);
  };
  return (
    <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-4">
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
            <p className="text-red-500 text-sm">{errors.currentPwd.message}</p>
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
              message: "Password must be at least 6 characters long",
            },
            maxLength: {
              value: 30,
              message: "Password must be at most 30 characters long",
            },
          })}
        />
        {errors.newPwd && (
          <p className="text-red-500 text-sm">{errors.newPwd.message}</p>
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
              value === getValues().newPwd || "Passwords do not match",
          })}
        />
        {errors.confirmPwd && (
          <p className="text-red-500 text-sm">{errors.confirmPwd.message}</p>
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
  );
};

export default AccountTab;
