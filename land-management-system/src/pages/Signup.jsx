import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VerificationModal from "../components/VerificationModal";
import "../styles/Signup.css";

const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationPurpose, setVerificationPurpose] = useState("setup");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message) {
      setMessage("");
      setMessageType("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    setIsLoading(true);

    try {
      if (!isLogin) {
        if (formData.password !== formData.confirmPassword) {
          setMessage("Passwords do not match");
          setMessageType("error");
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 4) {
          setMessage("Password must be at least 4 characters long");
          setMessageType("error");
          setIsLoading(false);
          return;
        }
      }

      const endpoint = isLogin
        ? "http://localhost:3001/api/users/login"
        : "http://localhost:3001/api/users/signup";

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

      console.log("Making API call to:", endpoint);
      const { data } = await axios.post(endpoint, payload);
      console.log("API response:", data);

      // IMPORTANT: Verify token exists before storing
      if (!data.token) {
        throw new Error("No token received from server");
      }

      // Store token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Token stored in localStorage:", data.token);

      setMessage(
        data.message ||
          (isLogin ? "Login successful!" : "Signup successful!")
      );
      setMessageType("success");

      if (isLogin) {
        console.log("Showing verification modal for LOGIN");
        setVerificationPurpose("login");
        setShowVerifyModal(true);
      } else {
        console.log("Showing verification modal for SETUP");
        setVerificationPurpose("setup");
        setShowVerifyModal(true);
      }
    } catch (err) {
      console.error("Auth error:", err);
      const errorMsg =
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        "Something went wrong. Please try again.";
      setMessage(errorMsg);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupVerification = async (verificationData) => {
    try {
      console.log("Setting up verification with data:", verificationData);
      
      // Get token and verify it exists
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);
      
      if (!token) {
        setMessage("No authentication token found. Please sign in again.");
        setMessageType("error");
        return;
      }

      // Test if token is valid by making a simple request first
      console.log("Testing token validity...");
      
      const response = await axios.post(
        "http://localhost:3001/api/users/set-verification",
        verificationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          timeout: 10000 // 10 second timeout
        }
      );

      console.log("Setup verification API response:", response.data);
      setMessage("Verification credentials set successfully!");
      setMessageType("success");
      setShowVerifyModal(false);

      // Redirect after setup
      setTimeout(() => navigate("/landdatainput"), 1000);
    } catch (err) {
      console.error("Setup verification error:", err);
      console.error("Full error object:", err);
      console.error("Error response:", err.response?.data);
      
      let errorMsg = "Failed to setup verification credentials. Please try again.";
      
      if (err.response?.status === 401) {
        errorMsg = "Authentication failed. The session may have expired. Please sign in again.";
        // Clear all auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setShowVerifyModal(false);
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg = "Network error. Please check your connection and try again.";
      } else if (err.code === 'ECONNABORTED') {
        errorMsg = "Request timeout. Please try again.";
      }
      
      setMessage(errorMsg);
      setMessageType("error");
    }
  };

  const handleLoginVerification = async (verificationData) => {
    try {
      console.log("Verifying login with data:", verificationData);
      const token = localStorage.getItem("token");
      console.log("Using token:", token);
      
      if (!token) {
        setMessage("No authentication token found. Please sign in again.");
        setMessageType("error");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/users/verify-login",
        verificationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Login verification API response:", response.data);
      setMessage("Verification successful!");
      setMessageType("success");
      setShowVerifyModal(false);

      setTimeout(() => navigate("/landdatainput"), 1000);
    } catch (err) {
      console.error("Login verification error:", err);
      
      let errorMsg = "Invalid verification credentials. Please try again.";
      
      if (err.response?.status === 401) {
        errorMsg = "Authentication failed. Please sign in again.";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setShowVerifyModal(false);
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      setMessage(errorMsg);
      setMessageType("error");
    }
  };

  const handleVerificationSubmit = (verificationData) => {
    console.log("Verification submit called with purpose:", verificationPurpose);
    
    if (verificationPurpose === "setup") {
      console.log("Routing to SETUP verification");
      handleSetupVerification(verificationData);
    } else {
      console.log("Routing to LOGIN verification");
      handleLoginVerification(verificationData);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setMessage("");
    setMessageType("");
  };

  const GoogleIcon = () => (
    <svg
      className="social-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  const GitHubIcon = () => (
    <svg
      className="social-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
        fill="#333"
      />
    </svg>
  );

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p>{isLogin ? "Sign in to your account" : "Join us today"}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              minLength={4}
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
                minLength={4}
              />
            </div>
          )}

          <button
            type="submit"
            className={`auth-button ${messageType === "success" ? "success" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>

          {message && (
            <div className={messageType === "error" ? "error-message" : "success-message"}>
              {message}
            </div>
          )}
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              className="toggle-link"
              onClick={toggleAuthMode}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="social-auth">
          <button 
            type="button" 
            className="social-button google"
            disabled={isLoading}
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <button 
            type="button" 
            className="social-button github"
            disabled={isLoading}
          >
            <GitHubIcon />
            Continue with GitHub
          </button>
        </div>
      </div>

      {showVerifyModal && (
        <VerificationModal
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          onVerify={handleVerificationSubmit}
          purpose={verificationPurpose}
        />
      )}
    </div>
  );
};

export default AuthForm;