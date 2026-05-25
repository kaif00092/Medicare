import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { userDataContext } from "../context/UserContext";

import { FaEye, FaEyeSlash } from "react-icons/fa";

function Onboarding() {
  const navigate = useNavigate();

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [conditions, setConditions] = useState("");
  const [allergies, setAllergies] = useState("");
  const [city, setCity] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const { serverUrl } = useContext(userDataContext);

  const handleCheckboxChange = (e, prev) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setConditions((prev) => [...prev, value]);
    } else {
      setConditions((prev) => prev.filter((condition) => condition !== value));
    }
  };

  const handleOnboard = async (e) => {
    e.preventDefault();
    setErr("");

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/onboard`,
        { age, gender, bloodGroup, conditions, allergies, city },
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
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
            Complete Your Profile
          </h1>

          <form onSubmit={handleOnboard}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="age"
              >
                Enter your age
              </label>
              <input
                id="age"
                type="number"
                placeholder="Enter your age"
                required
                onChange={(e) => setAge(e.target.value)}
                value={age}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="gender"
              >
                Select your gender
              </label>
              <select
                id="gender"
                placeholder="Select your gender"
                required
                onChange={(e) => setGender(e.target.value)}
                value={gender}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Choose">Choose</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="mb-4 relative">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="bloodGroup"
              >
                Blood Group
              </label>
              <input
                id="bloodGroup"
                type="text"
                placeholder="Blood Group"
                required
                onChange={(e) => setBloodGroup(e.target.value)}
                value={bloodGroup}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2"
                htmlFor="city"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                placeholder="City"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </div>

            <div className="mb-4  flex flex-wrap gap-4">
              <label
                className="block text-gray-700 text-sm font-medium mb-2 "
                htmlFor="medical-conditions"
              >
                Medical Conditions?
              </label>
              {["Diabetes", "Hypertension", "Heart Disease", "Asthma"].map(
                (condition) => (
                  <div
                    key={condition}
                    className="
                      flex items-center "
                  >
                    <input
                      type="checkbox"
                      value={condition}
                      onChange={(e) => handleCheckboxChange(e, conditions)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">{condition}</span>
                  </div>
                ),
              )}
            </div>

            {err.length > 0 && (
              <p className="text-red-600 text-sm text-center mb-4">*{err}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-300 disabled:bg-gray-400"
            >
              {loading ? "Saving profile...." : "Save Profile"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-3">
              {" "}
              <Link
                to="/dashboard"
                className="text-blue-600 hover:underline font-medium"
              >
                Skip for now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
