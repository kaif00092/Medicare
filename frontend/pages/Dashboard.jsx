import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  Leaf,
  FileText,
  User,
  Calendar,
  Settings,
  LogOut,
  Bell,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { userDataContext } from "../context/UserContext";
import ProfileModal from "../components/ProfileModal";

const Dashboard = () => {
  const { serverUrl } = useContext(userDataContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/auth/me`, {
        withCredentials: true,
      });
      console.log("Current user data:", res.data.user);

      setUser(res.data.user);
    } catch (error) {
      console.log(error);
      navigate("/register");
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
      console.log("Logout response:", response);
      navigate("/register");

      // Optionally, you can clear any client-side state here if needed
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  };
  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="hidden lg:flex w-72 bg-white min-h-screen border-r border-slate-200 flex-col justify-between px-6 py-6">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
              <HeartPulse size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-blue-600">MediFind</h1>
              <p className="text-sm text-slate-500">Healthcare</p>
            </div>
          </div>

          <nav className="space-y-3">
            <SidebarItem
              active
              icon={<LayoutDashboard size={21} />}
              text="Dashboard"
            />
            <SidebarItem
              icon={<Leaf size={21} />}
              text="AI Home Remedy"
              to="/homeremedies"
            />
            <SidebarItem
              icon={<FileText size={21} />}
              text="Report Analyzer"
              to="/reportanalyzer"
            />
            <SidebarItem
              icon={<User size={21} />}
              text="Doctor Finder"
              to="/localDoctors"
            />
            <SidebarItem icon={<Calendar size={21} />} text="Appointments" />
            <SidebarItem icon={<Settings size={21} />} text="Settings" />
          </nav>
        </div>

        <div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>

            <h3 className="font-bold text-slate-900">
              Your Health, Our Priority
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-6">
              Your health data is protected and used only for better
              suggestions.
            </p>
          </div>

          <button
            className="flex items-center gap-3 text-slate-600 hover:text-red-500 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut size={21} onClick={handleLogout} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto bg-white min-h-[92vh] rounded-3xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 lg:px-10 py-6 border-b border-slate-100">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                Good Morning, {user?.name || "User"} 👋
              </h2>
              <p className="text-slate-500 mt-1">
                Take charge of your health today.
              </p>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative">
                <Bell className="text-slate-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>

              <div
                className="hidden sm:flex items-center gap-3 cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => setIsProfileModalOpen(true)}
              >
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {user?.name || "User"}
                  </h4>
                  <p className="text-sm text-slate-500 hover:text-blue-600">
                    View Profile
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 lg:px-10 py-8">
            <section className="bg-gradient-to-red from-blue-50 to-sky-100 rounded-3xl p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                  Smart Healthcare <br /> at Your Fingertips
                </h1>

                <p className="text-slate-600 mt-4 text-lg leading-8">
                  Use AI tools to understand your symptoms, analyze reports, and
                  manage your health easily.
                </p>

                <Link
                  to="/homeremedies"
                  className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-7 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                >
                  Explore AI Tools <ArrowRight size={20} />
                </Link>
              </div>

              <div className="w-full lg:w-[360px] h-56 rounded-3xl bg-white/60 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <HeartPulse size={50} />
                  </div>
                  <p className="text-slate-600 mt-4 font-semibold">
                    AI Powered Healthcare
                  </p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <FeatureCard
                icon={<Leaf size={34} />}
                title="AI Home Remedy"
                desc="Get safe and natural home remedies based on your symptoms."
                button="Get Remedy"
                to="/homeremedies"
                color="green"
              />

              <FeatureCard
                icon={<FileText size={34} />}
                title="Report Analyzer"
                desc="Upload your medical reports and get clear AI-powered explanations."
                button="Analyze Report"
                to="/reportanalyzer"
                color="purple"
              />
            </section>

            <section className="mt-8 bg-slate-50 border border-slate-200 rounded-3xl p-6 flex items-center justify-between gap-5">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                  <Lightbulb size={28} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Daily Health Tip
                  </h3>
                  <p className="text-slate-600 mt-1">
                    Drink enough water, eat healthy food, and get proper sleep.
                  </p>
                </div>
              </div>

              <div className="hidden md:block text-5xl">💧</div>
            </section>
          </div>
        </div>
      </main>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdate={setUser}
      />
    </div>
  );
};

const SidebarItem = ({ icon, text, active, to }) => {
  const className = `flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
    active
      ? "bg-blue-50 text-blue-600"
      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
  }`;

  if (to) {
    return (
      <Link to={to} className={className}>
        {icon}
        {text}
      </Link>
    );
  }

  return (
    <div className={className}>
      {icon}
      {text}
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, button, to, color }) => {
  const colorClasses = {
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      border: "border-green-200",
      hover: "hover:bg-green-50",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-200",
      hover: "hover:bg-purple-50",
    },
  };

  const selected = colorClasses[color];

  return (
    <div className="border border-slate-200 rounded-3xl p-7 bg-white shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-6">
        <div
          className={`w-20 h-20 rounded-full ${selected.bg} ${selected.text} flex items-center justify-center`}
        >
          {icon}
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          <p className="text-slate-600 mt-3 leading-7">{desc}</p>

          <Link
            to={to}
            className={`inline-flex items-center gap-2 mt-5 px-6 py-3 rounded-xl border ${selected.border} ${selected.text} ${selected.hover} font-semibold transition-all`}
          >
            {button}
            <ArrowRight size={19} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
