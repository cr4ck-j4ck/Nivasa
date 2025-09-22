import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { verifyPasswordResetToken, resetPassword } from '@/Services/user.api';
import { resetPasswordSchema } from '@/Schema/auth.ZodSchema';
import { z } from 'zod';

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password');

  // Verify token on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Invalid reset link. Please request a new password reset.');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await verifyPasswordResetToken(token);
        if (response.valid) {
          setIsValidToken(true);
        } else {
          setError('This reset link has expired or is invalid. Please request a new password reset.');
        }
      } catch (err: any) {
        setError('Unable to verify reset link. Please try again or request a new password reset.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(token, data.password);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while resetting your password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    const levels = [
      { score: 0, label: '', color: '' },
      { score: 1, label: 'Very Weak', color: 'bg-red-500' },
      { score: 2, label: 'Weak', color: 'bg-orange-500' },
      { score: 3, label: 'Fair', color: 'bg-yellow-500' },
      { score: 4, label: 'Good', color: 'bg-blue-500' },
      { score: 5, label: 'Strong', color: 'bg-green-500' },
    ];

    return levels[score];
  };

  const passwordStrength = getPasswordStrength(password || '');

  // Loading state while verifying token
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
              <p className="text-gray-600">
                Your password has been updated successfully. You can now log in with your new password.
              </p>
            </div>

            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state or invalid token
  if (!isValidToken || error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Link Invalid</h2>
              <p className="text-gray-600 mb-4">
                {error || 'This password reset link has expired or is invalid.'}
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                Request New Reset Link
              </button>
              
              <button
                onClick={() => navigate('/auth')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-rose-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Password</h2>
            <p className="text-gray-600">
              Please create a strong password for your account.
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
            <div className="space-y-4">
              <div className="relative">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    {...register('password')}
                    className={`w-full pl-10 pr-12 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                      errors.password
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 mt-2 text-red-500 text-sm animate-fadeIn">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password.message}
                  </div>
                )}
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Password strength:</span>
                      <span className={`text-sm font-medium ${
                        passwordStrength.score >= 4 ? 'text-green-600' : 
                        passwordStrength.score >= 3 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    {...register('confirmPassword')}
                    className={`w-full pl-10 pr-12 py-4 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
                      errors.confirmPassword
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1 mt-2 text-red-500 text-sm animate-fadeIn">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Password must contain:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={`flex items-center gap-2 ${password && password.length >= 8 ? 'text-green-600' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${password && password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  At least 8 characters
                </li>
                <li className={`flex items-center gap-2 ${password && /[A-Z]/.test(password) ? 'text-green-600' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${password && /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One uppercase letter
                </li>
                <li className={`flex items-center gap-2 ${password && /[a-z]/.test(password) ? 'text-green-600' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${password && /[a-z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One lowercase letter
                </li>
                <li className={`flex items-center gap-2 ${password && /\d/.test(password) ? 'text-green-600' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${password && /\d/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One number
                </li>
                <li className={`flex items-center gap-2 ${password && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${password && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  One special character
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating Password...
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;