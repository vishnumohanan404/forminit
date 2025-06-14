import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import FormError from "./FormError";
import { useState } from "react";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface LoginFormFields {
  email: string;
  password: string;
}

interface SignupFormFields {
  fullName: string;
  confirmPassword: string;
}

// Create a union type based on the form mode (login/signup)
type AuthFormFields = LoginFormFields & Partial<SignupFormFields>;

const PasswordField = ({
  register,
  errorMessage,
  fieldType,
  fieldTitle,
  validationOptions,
}: {
  register: UseFormRegister<AuthFormFields>;
  errorMessage: String | undefined;
  fieldType: "fullName" | "email" | "password" | "confirmPassword";
  fieldTitle: string;
  validationOptions: RegisterOptions<AuthFormFields>;
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <div className="space-y-1">
      <Label htmlFor={fieldType}>{fieldTitle}</Label>
      <div className="relative">
        <Input
          {...register(fieldType, validationOptions)}
          id={fieldType}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
      {errorMessage && <FormError>{errorMessage}</FormError>}
    </div>
  );
};

export default PasswordField;
