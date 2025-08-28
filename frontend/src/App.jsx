import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import PageTransition from "./components/common/PageTransition";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ClinicsListPage from "./pages/ClinicsListPage";
import ClinicDetailPage from "./pages/ClinicDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import ClinicDashboard from "./pages/ClinicDashboard";
import UserDashboard from "./pages/UserDashboard";
import ContactPage from "./pages/ContactPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import FAQPage from "./pages/FAQPage";
import DoctorProfile from "./pages/DoctorProfile";

function App() {
  const location = useLocation();
  return (
    <div className="app-container">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar />
      <main className="main-content">
        <ScrollToTop />
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HomePage />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <LoginPage />
                </PageTransition>
              }
            />
            <Route
              path="/register"
              element={
                <PageTransition>
                  <RegisterPage />
                </PageTransition>
              }
            />
            <Route
              path="/contact"
              element={
                <PageTransition>
                  <ContactPage />
                </PageTransition>
              }
            />
            <Route
              path="/faq"
              element={
                <PageTransition>
                  <FAQPage />
                </PageTransition>
              }
            />
            <Route
              path="/clinics"
              element={
                <PageTransition>
                  <ClinicsListPage />
                </PageTransition>
              }
            />
            <Route
              path="/clinic/:id"
              element={
                <PageTransition>
                  <ClinicDetailPage />
                </PageTransition>
              }
            />
            <Route
              path="/clinic/:clinicId/doctor/:doctorId"
              element={
                <ProtectedRoute>
                <PageTransition>
                  <DoctorProfile />
                </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/admin/*"
              element={
                <ProtectedRoute roles={["Admin"]}>
                  <PageTransition>
                    <AdminDashboard />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/clinic/*"
              element={
                <ProtectedRoute roles={["Clinic"]}>
                  <PageTransition>
                    <ClinicDashboard />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/user"
              element={
                <ProtectedRoute roles={["User"]}>
                  <PageTransition>
                    <UserDashboard />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition>
                  <NotFoundPage />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;
