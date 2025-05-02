import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import Home from "./pages/Home";
import "./App.css";
import Upload from "./pages/Upload";
import PreviewPage from "./pages/PreviewPage";
import About from "./pages/About";


import Sidebar from "./components/Sidebar"; // Adjust the import path as necessary
import Gallery from "./pages/Gallery";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <> <Sidebar/>{children}</>;
};


const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/upload' replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
<>
    <div className="app-container">
      <FloatingShape 
        color="#22c55e"    /* bg-green-500 */
        size="256px"       /* w-64 h-64 */
        top="-5%" 
        left="10%" 
        delay={0} 
      />
      <FloatingShape 
        color="#10b981"    /* bg-emerald-500 */
        size="192px"      /* w-48 h-48 */
        top="70%" 
        left="80%" 
        delay={5} 
      />
      <FloatingShape 
        color="#84cc16"    /* bg-lime-500 */
        size="128px"       /* w-32 h-32 */
        top="40%" 
        left="-10%" 
        delay={2} 
      />

      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/gallery'
          element={
            <ProtectedRoute>
              <Gallery />
            </ProtectedRoute>
          }
        />
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/upload'
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path='/about'
          element={
              <About />
          }
        />
        <Route
          path='/preview'
          element={
            <ProtectedRoute>
              <PreviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/login'
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path='/verify-email' element={<EmailVerificationPage />} />
        <Route
          path='/forgot-password'
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/reset-password/:token'
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path='*' element={<Navigate to='/upload' replace />} />
      </Routes>
      <Toaster />
    </div>
    </>
  );
}

export default App;