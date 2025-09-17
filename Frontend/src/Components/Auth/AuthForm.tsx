import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, signupSchema } from "@/Schema/auth.ZodSchema";
import InputField from "./InputField";
import { User, Phone, Calendar, Mail, Shield, Sparkles, Lock } from "lucide-react";

export interface FormData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phoneNumber?: string;
  birthDate?: string;
}

interface AuthFormProps {
  isLogin: boolean;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

// Auth Form Component
const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  onSubmit,
  isLoading,
}) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
  });

  const handleForgotPassword = (): void => {
    console.log("Forgot password clicked");
  };
  const handleTermsClick = (type: string): void => {
    console.log(`${type} clicked`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Sign Up Fields */}
      {!isLogin && (
        <div className="space-y-6 animate-slideIn">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              icon={User}
              name="firstName"
              placeholder="First name"
              error={errors.firstName?.message}
              register={register}
            />
            <InputField
              icon={User}
              name="lastName"
              placeholder="Last name"
              error={errors.lastName?.message}
              register={register}
            />
          </div>
          <InputField
            icon={Phone}
            type="tel"
            name="phoneNumber"
            placeholder="Phone number"
            error={errors.phoneNumber?.message}
            register={register}
          />
          <InputField
            icon={Calendar}
            type="date"
            name="birthDate"
            placeholder="Birth date"
            error={errors.birthDate?.message}
            register={register}
          />
        </div>
      )}

      {/* Common Fields */}
      <InputField
        icon={Mail}
        type="email"
        name="email"
        placeholder="Email address"
        error={errors.email?.message}
        register={register}
      />

      <InputField
        icon={Lock}
        type="password"
        name="password"
        placeholder="Password"
        error={errors.password?.message}
        showPasswordToggle={true}
        register={register}
        watch={watch}
        isLogin={isLogin}
      />

      {/* Terms for Sign Up */}
      {!isLogin && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">By signing up, you agree to our:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleTermsClick("Terms of Service")}
                className="text-blue-600 hover:underline"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleTermsClick("Privacy Policy")}
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleTermsClick("Cookie Policy")}
                className="text-blue-600 hover:underline"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {isLogin ? "Sign In" : "Create Account"}
            <Sparkles className="w-5 h-5" />
          </span>
        )}
      </button>

      {/* Forgot Password for Login */}
      {isLogin && (
        <div className="text-center">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-rose-600 hover:text-rose-700 font-medium hover:underline transition-colors"
          >
            Forgot your password?
          </button>
        </div>
      )}
    </form>
  );
};

export default AuthForm;
