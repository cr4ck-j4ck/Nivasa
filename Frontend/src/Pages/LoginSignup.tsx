import React, { useEffect, useState } from "react";
import FloatingBackground from "@/Components/Auth/FloatingBackground";
import AuthForm from "@/Components/Auth/AuthForm";
import SocialLogin from "@/Components/Auth/SocialLogin";
import TrustIndicators from "@/Components/Auth/TrustIndicators";
import { type FormData } from "@/Components/Auth/AuthForm";
import {
  createUser,
  loginUser,
  setupVerificationListener,
} from "@/Services/user.api";
import { useSearchParams } from "react-router-dom";
import UserStore from "@/Store/UserStore";
import { useNavigate } from "react-router-dom";
import globalStore from "@/Store/Global";
// import EmailSent from "@/Components/EmailSent";
import CustomAlert from "@/Components/CustomAlert";
import EmailVerificationSuccess from "@/Components/mailVerified";

// Main Auth Page Component
const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setUser = UserStore((state) => state.setUser);
  const setErrorFromBackend = globalStore((state) => state.setErrorFromBackend);
  const [isEmailSent, SetIsEmailSent] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [mailVerified, setMailVerified] = useState(false);
  const errMsg = searchParams.get("errMsg");
  useEffect(() => {
    setErrorFromBackend({ emailError: null, passwordError: null });
  }, []);
  const navigate = useNavigate();
  const handleAuth = async (data: FormData): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      if (isLogin) {
        const response = await loginUser(data);
        if (response) {
          setUser(response);
          navigate("/dashboard");
        }
      } else {
        const response = await createUser(data);
        if (response?.uuid) {
          console.log(response.uuid);
          SetIsEmailSent(true);
          setupVerificationListener(response.uuid, () => {
            setMailVerified(true);
          });
        }
      }
      // Handle successful authentication here
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("password")) {
          setErrorFromBackend({ passwordError: "Wrong Password!" });
        } 
        else if (error.message.includes("user doesn't exists. Wrong Email")) {
          setErrorFromBackend({
            emailError: "User doesn't exists!. Check your email!!",
          });
        }
        else if (error.message.includes("User Already Exists")) {
          console.log("Ha bhai cheetey")
          setErrorFromBackend({
            emailError: "Oops! You're already in our system.",
          });
        }
      }
      // Handle authentication error here
    } finally {
      setIsLoading(false);
    }
  };
  let mailErrMsg: string = "";
  if (errMsg) {
    if (errMsg == "jwt expired") {
      mailErrMsg = `Oops! Your link has expired.
No worries, just sign up again to get a new one.`;
    } else if (errMsg == "Email is Already Verified!") {
      mailErrMsg = "Email is already verified Buddy No need to charm it twice 😉";
    } else {
      mailErrMsg = `Uh-oh, this link's not feeling quite right...
Maybe it got tampered, just sign up again`;
    }
  }
  const toggleAuthMode = (): void => {
    setIsLogin(!isLogin);
  };

  if (mailVerified) {
    return (
      <EmailVerificationSuccess onRedirect={() => setMailVerified(false)} />
    );
  } else {
    return (
      <>
        {errMsg ? (
          <CustomAlert
            title="Email Sent"
            message={mailErrMsg}
            variant={errMsg == "jwt expired" ? "error" : "info"}
            setFunc={() => {
              searchParams.delete("errMsg");
              setSearchParams();
            }}
          />
        ) : (
          ""
        )}
        {isEmailSent ? (
          <CustomAlert
            title="Email Sent"
            message="Verification link sent to your email. Check your inbox or spam."
            variant="success"
            setFunc={() => SetIsEmailSent(false)}
          />
        ) : (
          ""
        )}

        <title>Login-Signup</title>
        <div className="min-h-fit w-full bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50 flex items-center justify-center p-6 relative overflow-hidden">
          <FloatingBackground />

          <div className="w-full max-w-xl relative z-10">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-46 h-46 bg-gradient-to-r from-rose-200 via-pink-200 to-orange-200 rounded-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
                <img src="/Nivasa-removebg-preview.png" alt="Nivasa" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-2">
                Welcome to Nivasa
              </h1>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to your account"
                  : "Create your account and start exploring"}
              </p>
            </div>

            {/* Auth Form Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.02] transition-all duration-300">
              {/* Toggle Buttons */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    isLogin
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                    !isLogin
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <AuthForm
                isLogin={isLogin}
                onSubmit={handleAuth}
                isLoading={isLoading}
              />

              {/* Divider */}
              <div className="flex items-center my-8">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="px-4 text-gray-500 text-sm">
                  or continue with
                </span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <SocialLogin />
              <TrustIndicators />
            </div>

            {/* Bottom Text */}
            <div className="text-center mt-6 text-sm text-gray-600">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={toggleAuthMode}
                className="text-rose-600 hover:text-rose-700 font-medium hover:underline transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </div>

          <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
        </div>
      </>
    );
  }
};

export default AuthPage;
