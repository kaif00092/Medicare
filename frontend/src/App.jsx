import React from "react";
import { Route, Routes } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Onboarding from "../pages/Onboarding";
import Verifyemail from "../pages/Verifyemail";
import Home from "../pages/Dashboard";
import HomeRemedy from "../pages/HomeRemedy";
import ReportAnalyzer from "../pages/ReportAnalyzer";
import Dashboard from "../pages/Dashboard";
import LocalDoctor from "../pages/LocalDoctor";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboard" element={<Onboarding />} />
      <Route path="/verifyemail" element={<Verifyemail />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/homeremedies" element={<HomeRemedy />} />
      <Route path="/reportanalyzer" element={<ReportAnalyzer />} />
      <Route path="/localDoctors" element={<LocalDoctor />} />
    </Routes>
  );
}

export default App;
