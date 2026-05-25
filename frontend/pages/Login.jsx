import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { userDataContext } from "../context/UserContext";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../components/Navbar";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const { serverUrl } = useContext(userDataContext);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email) {
      setErr("Email is required");
      return;
    }

    if (password.length < 6) {
      setErr("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );

      console.log(result);
      setLoading(false);

      navigate("/dashboard");
    } catch (error) {
      console.log("Error in axios", error);
      setLoading(false);
      setErr(error.response?.data?.message || "An unknown error occurred");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans pt-20 overflow-hidden">
        <div className="flex flex-col md:flex-row m-4 w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="w-full md:w-1/2 h-64 md:h-auto">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
              alt="Doctor and family"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/600x600/e2e8f0/64748b?text=Image";
              }}
            />
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left">
              Welcome Back!
            </h1>

            <form onSubmit={handleSignIn}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4 relative">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-10 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {err.length > 0 && (
                <p className="text-red-600 text-sm text-center mb-4">*{err}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 cursor-pointer"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Want to create a new account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
