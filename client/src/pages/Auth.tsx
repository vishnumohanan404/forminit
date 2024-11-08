import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormError from "@/components/auth/FormError";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { googleSignIn, login, signup } from "@/services/auth";
import { AxiosError } from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleLogo from "@/components/svg/GoogleLogo";
import Logo from "@/components/svg/Logo";
import Title from "@/components/common/Title";

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

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // Initialize searchParams
  const isLogin = searchParams.get("mode") !== "signup";
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, user]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<AuthFormFields>({ mode: "onBlur" });
  const onSubmitLogin: SubmitHandler<AuthFormFields> = async (data) => {
    try {
      const response = await login(data);
      setUser(response.user);
      console.log("navigate   :>> ");
      navigate("/dashboard");
    } catch (error) {
      console.log("navigate error :>> ");
      if (error instanceof Error) {
        setError("root", { message: error.message });
      }
    }
  };
  const onSubmitSignUp: SubmitHandler<AuthFormFields> = async (data) => {
    try {
      const response = await signup({
        fullName: data.fullName!,
        email: data.email!,
        password: data.password!,
      });
      setUser(response.user);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error message:", error);
        setError("root", {
          message: error.response?.data.message || "Something went wrong",
        });
        // Access other properties like error.name, error.stack, etc.
      }
    }
  };

  const handleGoogleSignIn = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      setIsLoading(true);
      const response = await googleSignIn(codeResponse);
      setUser(response.user);
      setIsLoading(false);
      navigate("/");
    },
    onError: (tokenResponse) => {
      console.log(tokenResponse.error_description);
      setError("root", {
        message: tokenResponse.error_description || "Something went wrong",
      });
      setIsLoading(false);
    },
  });

  const toggleMode = () => {
    const newMode = isLogin ? "signup" : "login";
    setSearchParams({ mode: newMode }); // Update URL parameter
  };

  return user ? (
    <Navigate to="/dashboard" />
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center">
              <div className="h-14 w-14">
                <Logo />
              </div>
              <Title />
              <Separator />
            </div>
          </div>
          <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to access your account"
              : "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={handleSubmit(isLogin ? onSubmitLogin : onSubmitSignUp)}
            className="space-y-4"
          >
            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  placeholder="John Doe"
                  {...register("fullName", {
                    required: {
                      value: true,
                      message: "Please enter your full name",
                    },
                    maxLength: 20,
                    minLength: 3,
                  })}
                />
                {errors.fullName && (
                  <FormError>{errors.fullName.message}</FormError>
                )}
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email", {
                  required: {
                    value: true,
                    message: "Please enter a valid email address",
                  },
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message:
                      "Email must be in the format 'example@example.com'",
                  },
                })}
                id="email"
                type="text"
                placeholder="me@example.com"
              />
              {errors.email && <FormError>{errors.email.message}</FormError>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Please enter a password",
                    },
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                    maxLength: {
                      value: 30,
                      message: "Password must be at most 30 characters long",
                    },
                  })}
                  id="password"
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
              {errors.password && (
                <FormError>{errors.password.message}</FormError>
              )}
            </div>
            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  {...register("confirmPassword", {
                    required: {
                      value: true,
                      message: "Please confirm your password",
                    },
                    validate: (value) => {
                      return (
                        value === getValues().password ||
                        "Passwords should match"
                      );
                    },
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                    maxLength: {
                      value: 30,
                      message: "Password must be at most 30 characters long",
                    },
                  })}
                  id="confirm-password"
                  type="text"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <FormError>{errors.confirmPassword.message}</FormError>
                )}
              </div>
            )}
            {errors.root && <FormError>{errors.root.message}</FormError>}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleLogo />
            )}
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-muted-foreground w-full">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => toggleMode()}
            >
              {isLogin ? "Register" : "Login"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
