import { useState } from "react";
import { type FormData } from "./AuthForm";
import globalStore from "@/Store/Global";

interface UseFormConfig {
  resolver?: string;
}

// Mock React Hook Form with TypeScript
interface UseFormReturn {
  register: (
    name: string,
    validation?: unknown
  ) => {
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
    onBlur: () => void;
  };
  handleSubmit: (
    onSubmit: (data: FormData) => Promise<void>
  ) => (e?: React.FormEvent) => Promise<void>;
  formState: {
    errors: FormErrors;
    isSubmitting: boolean;
  };
  watch: (field: string) => string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const MockUseForm = (config?: UseFormConfig): UseFormReturn => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const setErrorFromBackend = globalStore(state => state.setErrorFromBackend)
  const passwordError = globalStore(state => state.passwordError)
  const register = (name: string) => ({
    name,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    value: formData[name as keyof FormData] || "",
    onBlur: () => {
      if (config?.resolver && formData[name as keyof FormData]) {
        const mockValidation = validateField(
          name,
          formData[name as keyof FormData] || ""
        );
        if(name=="password" && passwordError){
          setErrorFromBackend({passwordError:null})
        }
        if (mockValidation) {
          setErrors((prev) => ({ ...prev, [name]: mockValidation }));
        }
      }
    },
  });

  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case "email": {
        if (!value) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";

        const allowedDomains = [
          "gmail.com",
          "yahoo.com",
          "outlook.com",
          "hotmail.com",
          "icloud.com",
        ];
        const domain = value.split("@")[1]?.toLowerCase();
        if (!domain || !allowedDomains.includes(domain)) {
          return "Please use a popular email provider like Gmail, Yahoo, or Outlook.";
        }
        break;
      }
      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        break;
      case "firstName":
      case "lastName":
        if (!value)
          return `${name === "firstName" ? "First" : "Last"} name is required`;
        break;
      case "phoneNumber":
        if (!value) return "Phone number is required";
        if (value.length < 10) return "Phone number must be at least 10 digits";
        break;
      case "birthDate":
        if (!value) return "Birth date is required";
        break;
    }
    return null;
  };

  const handleSubmit =
    (onSubmit: (data: FormData) => Promise<void>) =>
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setIsSubmitting(true);
      // Validate all fields
      const newErrors: FormErrors = {};
      Object.keys(formData).forEach((key) => {
        const error = validateField(key, formData[key as keyof FormData] || "");
        if (error) newErrors[key] = error;
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        return;
      }

      try {
        await onSubmit(formData);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

  const watch = (field: string): string =>
    formData[field as keyof FormData] || "";
  const formState = { errors, isSubmitting };

  return { register, handleSubmit, formState, watch };
};

export default MockUseForm;
