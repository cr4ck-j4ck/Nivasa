import {  useState } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className={`outerLoginDiv absolute w-full h-full flex justify-center`}>
      <div className="loginDiv flex items-center justify-center transition-colors duration-500">
        <div className="w-full max-w-5xl shadow-xl bg-white dark:bg-gray-900 rounded-xl overflow-hidden flex flex-col md:flex-row transition-all duration-300">
          {/* Left Side - Image */}
          <div className="hidden md:block md:w-1/2 relative">
            <img
              src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/444725757.jpg?k=2a388a66ddbef10811ab9fdf9c69eabe22be8af74b080e29b7d8e37db2c4655f&o=&hp=1" // Replace with your image path
              alt="Login background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 p-10">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Welcome Back 👋
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-8">
              Login to your account to continue
            </p>

            {/* Email */}
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="email"
                name="email"
                id="email"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Email address
              </label>
            </div>

            {/* Password */}
            <div className="relative z-0 w-full mb-6 group">
              <input
                type="password"
                name="password"
                id="password"
                className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-0 py-2.5 text-sm text-gray-900 dark:text-white focus:border-blue-600 focus:outline-none focus:ring-0"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-6 peer-focus:scale-75"
              >
                Password
              </label>
            </div>

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

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-all duration-300"
            >
              Sign In
            </button>

            {/* Or divider */}
            <div className="flex items-center justify-between my-6">
              <hr className="w-full border-gray-300 dark:border-gray-600" />
              <span className="px-2 text-sm text-gray-400">OR</span>
              <hr className="w-full border-gray-300 dark:border-gray-600" />
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <FaGoogle className="text-red-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Google
                </span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                <FaFacebookF className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Facebook
                </span>
              </button>
            </div>

            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-6">
              Don’t have an account?{" "}
              <a
                href="#"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Sign up
              </a>
            </p>
        </div>
      </div>
    </div>
    </div>
  );
}
