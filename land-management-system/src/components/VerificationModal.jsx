import React, { useState, useEffect } from "react";
import "../styles/VerificationModal.css";

const VerificationModal = ({ isOpen, onClose, onVerify, purpose }) => {
  const [formData, setFormData] = useState({ 
    idNumber: "", 
    verificationKey: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({ idNumber: "", verificationKey: "" });
      setError("");
      setIsLoading(false);
      console.log(`Modal opened for: ${purpose}`);
    }
  }, [isOpen, purpose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.idNumber.trim() || !formData.verificationKey.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.idNumber.length < 3) {
      setError("ID Number must be at least 3 characters");
      return;
    }

    if (formData.verificationKey.length < 4) {
      setError("Verification key must be at least 4 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await onVerify(formData);
      console.log("Verification completed successfully");
    } catch (err) {
      console.error("Verification failed:", err);
      setError(
        err.message || 
        (purpose === "setup" 
          ? "Failed to setup verification. Please try again." 
          : "Verification failed. Please try again."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ idNumber: "", verificationKey: "" });
    setError("");
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  const isSetup = purpose === "setup";

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isSetup ? "Setup Verification" : "Identity Verification"}</h2>
          <button 
            className="close-btn" 
            onClick={handleClose}
            aria-label="Close verification modal"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            {isSetup 
              ? "Set up your verification credentials. You'll use these every time you log in for security purposes."
              : "For security purposes, please verify your identity by entering your ID Number and verification key."
            }
          </p>

          <form onSubmit={handleSubmit} className="verify-form">
            <div className="input-group">
              <label htmlFor="idNumber">ID Number</label>
              <input
                id="idNumber"
                type="text"
                name="idNumber"
                placeholder="Enter your ID number"
                value={formData.idNumber}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={error ? "error" : ""}
                minLength="3"
              />
            </div>

            <div className="input-group">
              <label htmlFor="verificationKey">Verification Key</label>
              <input
                id="verificationKey"
                type="text"
                name="verificationKey"
                placeholder="Enter verification key"
                value={formData.verificationKey}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={error ? "error" : ""}
                minLength="4"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="verify-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  isSetup ? "Setting Up..." : "Verifying..."
                ) : (
                  isSetup ? "Setup Verification" : "Verify Identity"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
