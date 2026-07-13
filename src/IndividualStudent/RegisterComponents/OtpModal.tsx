import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface OtpModalProps {
  showOtpModal: boolean;
  handleCloseOtpModal: () => void;
  otpResendMessage: string;
  otpSuccess: boolean;
  otpError: string;
  email: string;
  otpDigits: string[];
  handleOtpBoxChange: (value: string, index: number) => void;
  handleOtpBackspace: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  inputsRef: React.MutableRefObject<HTMLInputElement[]>;
  handleResendOtp: () => void;
  otpTimer: number;
  formatTime: (seconds: number) => string;
  handleVerify: () => void;
  finalOtp: string;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  showOtpModal,
  handleCloseOtpModal,
  otpResendMessage,
  otpSuccess,
  otpError,
  email,
  otpDigits,
  handleOtpBoxChange,
  handleOtpBackspace,
  inputsRef,
  handleResendOtp,
  otpTimer,
  formatTime,
  handleVerify,
  finalOtp,
}) => {
  if (!showOtpModal) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#f9fafb",
          padding: "40px 30px",
          borderRadius: "20px",
          width: "420px",
          maxWidth: "95%",
          textAlign: "center",
          position: "relative",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleCloseOtpModal}
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            border: "none",
            background: "transparent",
            fontSize: "22px",
            cursor: "pointer",
            color: "#999",
          }}
        >
          ×
        </button>

        {/* OTP Resend Message */}
        {otpResendMessage && (
          <div
            style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "slideDown 0.3s ease-out",
            }}
          >
            ✓ {otpResendMessage}
          </div>
        )}

        {!otpSuccess ? (
          <>
            {/* Title */}
            <h2
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "#7e22ce",
                marginBottom: "12px",
              }}
            >
              Verify Your Email
            </h2>

            {/* Subtext */}
            <p
              style={{
                color: "#6b7280",
                fontSize: "18px",
                marginBottom: "4px",
              }}
            >
              We've sent a 6 digit OTP to
            </p>
            <p
              style={{
                fontWeight: 700,
                fontSize: "20px",
                marginBottom: "30px",
              }}
            >
              {email}
            </p>

            {/* OTP Boxes */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "14px",
                marginBottom: "30px",
              }}
            >
              {otpDigits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el!)}
                  value={d}
                  onChange={(e) => handleOtpBoxChange(e.target.value, i)}
                  onKeyDown={(e) => handleOtpBackspace(e, i)}
                  maxLength={1}
                  style={{
                    width: "45px",
                    height: "55px",
                    borderRadius: "12px",
                    border: "2px solid #d1d5db",
                    textAlign: "center",
                    fontSize: "20px",
                    fontWeight: 600,
                    outline: "none",
                    transition: "all 0.2s",
                    background: "#fff",
                    ...(i === otpDigits.findIndex((v) => v === "")
                      ? {
                          borderColor: "#7e22ce",
                          boxShadow: "0 0 0 3px rgba(126,34,206,0.15)",
                        }
                      : {}),
                    ...(d
                      ? {
                          background: "linear-gradient(135deg, #7e22ce, #4f46e5)",
                          color: "#fff",
                          border: "none",
                        }
                      : {}),
                  }}
                />
              ))}
            </div>

            {otpError && (
              <div
                style={{
                  color: "#e74c3c",
                  fontSize: "13px",
                  marginTop: "6px",
                  marginBottom: "20px",
                }}
              >
                {otpError}
              </div>
            )}

            {/* Resend */}
            <button
              onClick={handleResendOtp}
              disabled={otpTimer !== 0}
              style={{
                background: "none",
                border: "none",
                color: "#7e22ce",
                fontSize: "18px",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
                marginBottom: "10px",
                opacity: otpTimer === 0 ? 1 : 0.5,
              }}
            >
              Resend OTP
            </button>

            {/* Timer */}
            <div
              style={{
                fontSize: "26px",
                marginBottom: "30px",
                color: "#111",
              }}
            >
              {formatTime(otpTimer)}
            </div>

            {/* Submit */}
            <button
              onClick={handleVerify}
              disabled={finalOtp.length !== 6}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(90deg, #4f46e5, #7e22ce)",
                color: "#fff",
                fontSize: "20px",
                fontWeight: 600,
                cursor: "pointer",
                opacity: finalOtp.length !== 6 ? 0.6 : 1,
              }}
            >
              Submit
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600">
              Registration Successful
            </h2>
            <p className="text-gray-600 mt-2">Redirecting…</p>
          </div>
        )}
      </div>
    </div>
  );
};
