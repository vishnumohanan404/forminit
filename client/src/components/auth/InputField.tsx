import { RegisterOptions, UseFormRegister } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import FormError from "./FormError";

interface LoginFormFields {
  email: string;
  password: string;
}

interface SignupFormFields {
  fullName: string;
  confirmPassword: string;
}
type AuthFormFields = LoginFormFields & Partial<SignupFormFields>;

const InputField = ({
  register,
  errorMessage,
  fieldType,
  fieldTitle,
  validationOptions,
  placeholder,
}: {
  register: UseFormRegister<AuthFormFields>;
  errorMessage: String | undefined;
  fieldType: "fullName" | "email" | "password" | "confirmPassword";
  fieldTitle: string;
  validationOptions: RegisterOptions<AuthFormFields>;
  placeholder: string; // Added new prop for placeholder text for the input field
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={fieldType}>{fieldTitle}</Label>
      <Input
        id={fieldType}
        placeholder={placeholder}
        {...register(fieldType, validationOptions)}
      />
      {errorMessage && <FormError>{errorMessage}</FormError>}
    </div>
  );
};

export default InputField;
