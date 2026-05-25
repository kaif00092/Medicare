import { useState, useContext } from "react";
import axios from "axios";
import { X, Edit2, Check } from "lucide-react";
import { userDataContext } from "../context/UserContext";

const ProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
  const { serverUrl } = useContext(userDataContext);
  const [isEditing, setIsEditing] = useState(false);
  const [conditions, setConditions] = useState(user?.conditions || []);
  const [newCondition, setNewCondition] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddCondition = () => {
    if (newCondition.trim() && !conditions.includes(newCondition.trim())) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const handleRemoveCondition = (condition) => {
    setConditions(conditions.filter((c) => c !== condition));
  };

  const handleUpdateConditions = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.put(
        `${serverUrl}/api/auth/update-conditions`,
        { conditions },
        { withCredentials: true },
      );

      setSuccess("Medical conditions updated successfully!");
      setTimeout(() => {
        setIsEditing(false);
        onUpdate(res.data.user);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update conditions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Profile</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-500 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 font-bold text-3xl flex items-center justify-center mx-auto mb-4">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
            <p className="text-slate-500 text-sm">{user?.email}</p>
          </div>

          {/* User Details */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Age:</span>
              <span className="text-slate-900 font-semibold">
                {user?.age || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Gender:</span>
              <span className="text-slate-900 font-semibold">
                {user?.gender || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">City:</span>
              <span className="text-slate-900 font-semibold">
                {user?.city || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Blood Group:</span>
              <span className="text-slate-900 font-semibold">
                {user?.bloodGroup || "Not specified"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Address:</span>
              <span className="text-slate-900 font-semibold">
                {user?.address || "Not specified"}
              </span>
            </div>
          </div>

          {/* Medical Conditions Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-slate-900">
                Medical Conditions
              </h4>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="flex flex-wrap gap-2">
                {conditions && conditions.length > 0 ? (
                  conditions.map((condition, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {condition}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm italic">
                    No conditions added yet
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Error/Success Messages */}
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                {/* Current Conditions */}
                <div className="flex flex-wrap gap-2">
                  {conditions.map((condition, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{condition}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(condition)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Condition */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddCondition()
                    }
                    placeholder="Add a condition (e.g., Diabetes)"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCondition}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all"
                  >
                    Add
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setConditions(user?.conditions || []);
                      setError("");
                      setSuccess("");
                    }}
                    className="flex-1 bg-slate-200 text-slate-800 py-2 rounded-lg font-medium hover:bg-slate-300 transition-all"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateConditions}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Allergies Section */}
          {user?.allergies && user.allergies.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-slate-900 mb-3">
                Allergies
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
