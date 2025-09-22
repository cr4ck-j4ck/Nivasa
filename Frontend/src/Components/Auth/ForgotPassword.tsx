import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { requestPasswordReset } from '@/Services/user.api';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await requestPasswordReset(data.email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600">
            We've sent a password reset link to <strong>{getValues('email')}</strong>
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-blue-800 text-sm">
              <p className="font-medium mb-1">What's next?</p>
              <ul className="space-y-1">
                <li>• Check your email inbox (and spam folder)</li>
                <li>• Click the reset link within 15 minutes</li>
                <li>• Create a new secure password</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onBackToLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          <button
            onClick={() => {
              setIsSuccess(false);
              setError(null);
            }}
            className="w-full text-rose-600 hover:text-rose-700 font-medium text-sm"
          >
            Didn't receive the email? Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-red-800 text-sm">
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email address"
              {...register('email')}
              className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                errors.email
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 focus:bg-white'
              }`}
            />
          </div>
          {errors.email && (
            <div className="flex items-center gap-1 mt-2 text-red-500 text-sm animate-fadeIn">
              <AlertCircle className="w-4 h-4" />
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending Reset Link...
              </div>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Send Reset Link
                <Send className="w-5 h-5" />
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          Remember your password?{' '}
          <button
            onClick={onBackToLogin}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            Sign in instead
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;