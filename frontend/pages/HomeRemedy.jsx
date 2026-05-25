import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Leaf,
  AlertTriangle,
  HeartPulse,
  HelpCircle,
  ClipboardList,
  Stethoscope,
} from "lucide-react";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";

const commonSymptoms = ["Cough", "Fever", "Headache", "Cold", "Stomach Pain"];

const HomeRemedy = () => {
  const [symptoms, setSymptoms] = useState("");
  const [remedy, setRemedy] = useState(null);
  const [loading, setLoading] = useState(false);
  const { serverUrl } = useContext(userDataContext);
  const navigate = useNavigate();

  const handleSymptomClick = (symptom) => {
    setSymptoms((prev) => (prev ? `${prev}, ${symptom}` : symptom));
  };

  const handleGenerate = async () => {
    if (!symptoms.trim()) {
      alert("Please enter your symptoms");
      return;
    }

    try {
      setLoading(true);
      setRemedy(null);

      const res = await axios.post(
        `${serverUrl}/api/ai/homeremedies`,
        { symptoms },
        { withCredentials: true },
      );

      setRemedy(res.data.remedy);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to generate remedy");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[1500px] h-[94vh] bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 lg:p-12 border-r border-slate-100 flex flex-col justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold mb-8"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900">
            AI Home Remedy Generator
          </h1>

          <p className="text-slate-500 text-lg mt-4 leading-8">
            Describe your symptoms and get safe, personalized home remedy
            suggestions based on your health profile.
          </p>

          <div className="mt-8">
            <label className="block text-slate-800 font-semibold mb-3">
              Enter your symptoms
            </label>

            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Example: Dry cough, sore throat, mild fever"
              className="w-full h-36 resize-none border border-slate-300 rounded-2xl px-5 py-4 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="mt-7">
            <p className="text-slate-800 font-semibold mb-2">
              Or select common symptoms
            </p>

            <div className="flex flex-wrap gap-3 cursor-pointer">
              {commonSymptoms.map((item) => (
                <button
                  key={item}
                  onClick={() => handleSymptomClick(item)}
                  className="px-5 py-3 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl text-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Sparkles size={24} />
            {loading ? "Generating Remedy..." : "Generate Remedy"}
          </button>

          <p className="text-slate-400 text-sm mt-5 text-center">
            This information is for guidance only and is not a substitute for
            medical advice.
          </p>
        </div>

        <div className="p-8 lg:p-12 bg-slate-50 overflow-hidden">
          {!remedy && !loading && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <Leaf size={46} />
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mt-6">
                  Remedy Result Will Appear Here
                </h2>

                <p className="text-slate-500 mt-4 leading-7">
                  After you enter symptoms and click Generate Remedy, your
                  possible reason, safe remedies, things to avoid, and doctor
                  advice will show here clearly.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center animate-pulse">
                  <Sparkles size={46} />
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mt-6">
                  Generating Your Remedy...
                </h2>

                <p className="text-slate-500 mt-4 leading-7">
                  Please wait. AI is checking your symptoms and preparing safe
                  suggestions.
                </p>
              </div>
            </div>
          )}

          {remedy && (
            <div className="h-full overflow-y-auto pr-2">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5">
                <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
                  <HeartPulse size={26} />
                  Remedy Generated Successfully
                </h2>

                <p className="text-slate-600 mt-2">
                  Here is your personalized home remedy suggestion.
                </p>
              </div>

              <ResultTextCard
                icon={<ClipboardList size={28} />}
                title="Possible Reason"
                color="text-blue-600"
                bg="bg-blue-100"
                text={remedy.possibleReason}
              />

              <ResultListCard
                icon={<Leaf size={28} />}
                title="Safe Home Remedies"
                color="text-green-600"
                bg="bg-green-100"
                items={remedy.safeRemedies}
              />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5">
                <ResultListCard
                  icon={<AlertTriangle size={28} />}
                  title="Things to Avoid"
                  color="text-orange-600"
                  bg="bg-orange-100"
                  items={remedy.thingsToAvoid}
                />

                <ResultTextCard
                  icon={<Stethoscope size={28} />}
                  title="When to See Doctor"
                  color="text-purple-600"
                  bg="bg-purple-100"
                  text={remedy.whenToSeeDoctor}
                />
              </div>

              <ResultTextCard
                icon={<HelpCircle size={28} />}
                title="Which Doctor to Visit"
                color="text-indigo-600"
                bg="bg-indigo-100"
                text={remedy.whichDoctorToVisit}
              />
              <button
                className="p-2 text-blue-600 hover:text-blue-800 font-bold border-blue-700 bg-blue-300 rounded-lg "
                onClick={() =>
                  navigate(
                    "/localDoctors?type=" +
                      encodeURIComponent(remedy.whichDoctorToVisit),
                  )
                }
              >
                Find local doctors
              </button>

              <div className="mt-5 border border-slate-200 bg-white rounded-xl px-5 py-4 text-slate-500 leading-7">
                ℹ️{" "}
                {remedy?.disclaimer ||
                  "This is not a replacement for professional medical advice."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultTextCard = ({ icon, title, text, color, bg }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-5">
      <div className="flex items-start gap-4">
        <div
          className={`w-14 h-14 rounded-full ${bg} ${color} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>

        <div>
          <h3 className={`text-xl font-bold ${color}`}>{title}</h3>
          <p className="text-slate-700 mt-2 leading-7">
            {text || "No data available."}
          </p>
        </div>
      </div>
    </div>
  );
};

const ResultListCard = ({ icon, title, items, color, bg }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div
        className={`w-14 h-14 rounded-full ${bg} ${color} flex items-center justify-center`}
      >
        {icon}
      </div>

      <h3 className={`text-xl font-bold mt-4 ${color}`}>{title}</h3>

      <ul className="text-slate-700 mt-3 leading-7 list-disc list-inside">
        {items?.length > 0 ? (
          items.map((item, index) => <li key={index}>{item}</li>)
        ) : (
          <li>No data available.</li>
        )}
      </ul>
    </div>
  );
};

export default HomeRemedy;
