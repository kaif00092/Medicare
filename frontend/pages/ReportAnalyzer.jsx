import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  X,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  Heart,
  ArrowLeft,
  Languages,
} from "lucide-react";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";

const ReportAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("English");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const { serverUrl } = useContext(userDataContext);

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please select a PDF or image report");
      return;
    }

    try {
      setLoading(true);
      setAnalysis(null);

      const formData = new FormData();
      formData.append("report", file);
      formData.append("language", language);

      const res = await axios.post(
        `${serverUrl}/api/reports/analyzer`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setAnalysis(res.data.analysis);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to analyze report");
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setAnalysis(null);
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
            Smart Report Analyzer
          </h1>

          <p className="text-slate-500 text-lg mt-4 leading-8">
            Upload your medical report and get a simple, patient-friendly
            explanation in your selected language.
          </p>

          <div className="mt-8">
            <label className="flex items-center gap-2 text-slate-800 font-semibold mb-3">
              <Languages size={20} />
              Select Report Language
            </label>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-5 py-4 text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          <div className="mt-7 border-2 border-dashed border-blue-200 rounded-2xl p-7 bg-blue-50/30">
            {!file ? (
              <label className="cursor-pointer block text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <UploadCloud size={38} />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mt-5">
                  Upload PDF or Image Report
                </h2>

                <p className="text-slate-500 mt-2">PDF, JPG, PNG up to 10MB</p>

                <div className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold transition-all">
                  Choose File
                </div>

                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <FileText size={30} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">
                    {file.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>

                <button
                  onClick={removeFile}
                  className="w-9 h-9 rounded-full hover:bg-red-50 text-slate-500 hover:text-red-500 flex items-center justify-center"
                >
                  <X size={22} />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-7 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 rounded-xl text-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Sparkles size={24} />
            {loading ? "Analyzing Report..." : "Analyze Report"}
          </button>

          <p className="text-slate-400 text-sm mt-5 text-center">
            This explanation is for understanding only and is not a medical
            diagnosis.
          </p>
        </div>

        <div className="p-8 lg:p-12 bg-slate-50 overflow-hidden">
          {!analysis && !loading && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <FileText size={46} />
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mt-6">
                  Report Result Will Appear Here
                </h2>

                <p className="text-slate-500 mt-4 leading-7">
                  After you upload your report and click Analyze Report, your
                  summary, normal findings, attention points, and doctor
                  questions will show here clearly.
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
                  Analyzing Your Report...
                </h2>

                <p className="text-slate-500 mt-4 leading-7">
                  Please wait. AI is reading your report and preparing a simple
                  explanation.
                </p>
              </div>
            </div>
          )}

          {analysis && (
            <div className="h-full overflow-y-auto pr-2">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-5">
                <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
                  <CheckCircle size={26} />
                  Report Analyzed Successfully
                </h2>

                <p className="text-slate-600 mt-2">
                  Your report explanation is ready in {language}.
                </p>
              </div>

              <ResultTextCard
                icon={<FileText size={28} />}
                title="Summary"
                color="text-blue-600"
                bg="bg-blue-100"
                text={analysis.summary}
              />

              <ResultTextCard
                icon={<Heart size={28} />}
                title="Simple Explanation"
                color="text-pink-600"
                bg="bg-pink-100"
                text={analysis.simpleExplanation}
              />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5">
                <ResultListCard
                  icon={<CheckCircle size={28} />}
                  title="Normal Findings"
                  color="text-green-600"
                  bg="bg-green-100"
                  items={analysis.normalFindings}
                />

                <ResultListCard
                  icon={<AlertTriangle size={28} />}
                  title="Attention Needed"
                  color="text-orange-600"
                  bg="bg-orange-100"
                  items={analysis.attentionNeeded}
                />

                <ResultListCard
                  icon={<HelpCircle size={28} />}
                  title="Questions for Doctor"
                  color="text-purple-600"
                  bg="bg-purple-100"
                  items={analysis.questionsForDoctor}
                />
              </div>

              <div className="mt-5 border border-slate-200 bg-white rounded-xl px-5 py-4 text-slate-500 leading-7">
                ℹ️{" "}
                {analysis?.disclaimer ||
                  "This explanation is for understanding only and is not a medical diagnosis."}
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

export default ReportAnalyzer;
