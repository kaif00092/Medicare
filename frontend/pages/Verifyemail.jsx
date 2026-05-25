import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { userDataContext } from "../context/UserContext";
import Navbar from "../components/Navbar";

function Verifyemail() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();
  const { serverUrl } = useContext(userDataContext);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value !== "" && !/^[0-9]$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const code = otp.join("");

    if (code.length < 6) {
      setErr("Please enter the complete 6-digit code.");
      setLoading(false);
      return;
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verifyemail`,
        { code },
        { withCredentials: true },
      );

      console.log(result.data);
      setLoading(false);

      if (result.data.must_onboard === true) {
        navigate("/onboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error verifying code", error);
      setLoading(false);
      setErr(error.response?.data?.message || "Invalid or expired code");
    }
  };

  const handleResendCode = () => {
    setErr("");
    console.log("Resend code logic here");
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
        <div className="flex flex-col md:flex-row m-4 w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="w-full md:w-1/2 h-64 md:h-auto">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
              alt="Medical professionals"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/600x600/e2e8f0/64748b?text=Image";
              }}
            />
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-3 text-left">
              Check Your Email
            </h1>
            <p className="text-gray-600 mb-8">
              We've sent a 6-digit code to your email address.
            </p>

            <form onSubmit={handleVerifySubmit}>
              <div className="flex justify-between space-x-2 md:space-x-3 mb-6">
                {otp.map((data, index) => {
                  return (
                    <input
                      key={index}
                      type="text"
                      name="otp"
                      maxLength="1"
                      className="w-12 h-12 md:w-14 md:h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={data}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                    />
                  );
                })}
              </div>

              {err.length > 0 && (
                <p className="text-red-600 text-sm text-center mb-4">*{err}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400 cursor-pointer"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Resend Code
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Verifyemail;
