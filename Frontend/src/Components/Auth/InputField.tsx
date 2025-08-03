import { useState } from "react";
import { X, EyeOff, Eye, type LucideIcon } from "lucide-react";
import PasswordStrengthIndicator from "./PasswordIndicator";
import globalStore from "@/Store/Global";
import { useShallow } from "zustand/react/shallow";

interface InputFieldProps {
  icon: LucideIcon;
  type?: string;
  placeholder: string;
  error?: string;
  showPasswordToggle?: boolean;
  register: (name: string) => {
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    onBlur: () => void;
  };
  name: string;
  watch?: (field: string) => string;
}

// Input Field Component
const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  type = "text",
  placeholder,
  error,
  showPasswordToggle = false,
  register,
  name,
  watch,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const fieldValue = watch ? watch(name) : "";
  const { emailError, passwordError } = globalStore(
    useShallow((state) => ({
      emailError: state.emailError,
      passwordError: state.passwordError,
    }))
  );
  if (type == "email" && emailError) {
    error = emailError;
  } else if (type == "password" && passwordError) {
    error = passwordError;
  }
  return (
    <div className="relative">
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={showPasswordToggle && showPassword ? "text" : type}
          placeholder={placeholder}
          {...register(name)}
          className={`w-full pl-10 pr-12 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
            error
              ? "border-red-300 bg-red-50"
              : "border-gray-200 bg-white hover:border-gray-300 focus:bg-white"
          }`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1 mt-2 text-red-500 text-sm animate-fadeIn">
          <X className="w-4 h-4" />
          {error}
        </div>
      )}
      {name === "password" && fieldValue && (
        <PasswordStrengthIndicator password={fieldValue} />
      )}
    </div>
  );
};

export default InputField;
