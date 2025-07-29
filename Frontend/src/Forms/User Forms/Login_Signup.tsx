import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAuthSchema, type TAuthForm } from "./loginSignup.schema";
import { createUser } from "@/Services/user.api";

import { useGlobalStore } from "@/Store/Global";

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);
  const setShowLogin = useGlobalStore((state) => state.setShowLogin);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = () => {
    setIsSignup((prev) => !prev);
    reset();
  };
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    window.location.href = `${import.meta.env.VITE_BACKEND_API}/auth/google`;
  };

  // Use the dynamic schema function
  const schema = createAuthSchema(isSignup);

  const handleFormSubmit = (data: TAuthForm) => {
    if(isSignup && schema.safeParse(data).success){
      createUser(data)  
    }else{
      logn
    }
    
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TAuthForm>({
    resolver: zodResolver(schema),
  });

  return (
    <div
      className={`outerLoginDiv absolute w-full h-full flex justify-center items-center z-20 bg-red-500`}
      onClick={() => setShowLogin(false)}
    >
      <div
        className="loginDiv flex transition-colors duration-500 h-fit"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full max-w-5xl shadow-xl bg-white dark:bg-gray-900 rounded-xl overflow-hidden flex flex-col md:flex-row transition-all duration-300">
          <form
            action=""
            onSubmit={handleSubmit(handleFormSubmit)}
            className="flex"
          >
            {/* Left Side - Image */}
            <div className="hidden md:block md:w-1/2 relative">
              <img
                src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/444725757.jpg?k=2a388a66ddbef10811ab9fdf9c69eabe22be8af74b080e29b7d8e37db2c4655f&o=&hp=1"
                alt="Auth background"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right Side - Form */}
            <div className="w-full md:w-1/2 p-10">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                {isSignup ? "Create an Account 🚀" : "Welcome Back 👋"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-8">
                {isSignup
                  ? "Sign up to get started"
                  : "Login to your account to continue"}
              </p>

              {isSignup && (
                <div className="relative z-0 w-full mb-6 group">
                  <input
                    className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder=" "
                    {...register("fullName")}
                  />
                  <label
                    htmlFor="name"
                    className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                  >
                    Full Name
                  </label>
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
              )}

              {/* Email */}
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="email"
                  {...register("email", { required: true })}
                  className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-600 focus:outline-none focus:ring-0"
                />
                <label
                  htmlFor="email"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                >
                  Email address
                </label>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="relative z-0 w-full mb-6 group">
                <input
                  type="password"
                  className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-600 focus:outline-none focus:ring-0"
                  {...register("password")}
                />
                <label
                  htmlFor="password"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
                >
                  Password
                </label>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {!isSignup && (
                <div className="flex justify-between items-center mb-6">
                  <label className="text-sm text-gray-600 dark:text-gray-300">
                    <input type="checkbox" className="mr-2" /> Remember me
                  </label>
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-all duration-300"
              >
                {isSignup ? "Sign Up" : "Sign In"}
              </button>

              {/* Or divider */}
              <div className="flex items-center justify-between my-6">
                <hr className="w-full border-gray-300 dark:border-gray-600" />
                <span className="px-2 text-sm text-gray-400">OR</span>
                <hr className="w-full border-gray-300 dark:border-gray-600" />
              </div>

              {/* Social Buttons */}
              <div className="flex gap-4">
                <button
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <FaGoogle className="text-red-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    Google
                  </span>
                </button>
              </div>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
                {isSignup
                  ? "Already have an account ?"
                  : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={handleToggle}
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  {isSignup ? "Login" : "Sign up"}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
