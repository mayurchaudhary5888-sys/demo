import React, { useState, useEffect } from "react";
import { authApi } from "../../services/authApi";
import { Eye, EyeOff } from "lucide-react";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBackToLogin,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [step, setStep] = useState<"request" | "verify">("request");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrors({ email: "Email address required." });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: "Invalid email format." });
      return;
    }

    setErrors({});
    setLoading(true);
    setMessage("");

    try {
      const response = await authApi.forgotPassword({ email });
      setMessage(response.message || "OTP code sent to your email.");
      setStep("verify");
      setTimer(60); // 60 seconds cooldown for resending
    } catch (err: any) {
      setErrors({ global: err.message || "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!otp.trim()) {
      errs.otp = "6-digit OTP code required.";
    } else if (!/^\d{6}$/.test(otp.trim())) {
      errs.otp = "OTP must be exactly 6 digits.";
    }

    if (!password) {
      errs.password = "New password required.";
    } else if (password.length < 8) {
      errs.password = "Minimum 8 characters.";
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      errs.password = "Use uppercase, lowercase, and one number.";
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);
    setMessage("");

    try {
      const response = await authApi.resetPassword({
        email,
        otp: otp.trim(),
        password,
      });
      setMessage(response.message || "Password updated successfully!");
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setErrors({ global: err.message || "Password reset failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setLoading(true);
    setErrors({});
    try {
      const response = await authApi.forgotPassword({ email });
      setMessage(response.message || "A new OTP code has been sent.");
      setTimer(60);
    } catch (err: any) {
      setErrors({ global: err.message || "Failed to resend OTP." });
    } finally {
      setLoading(false);
    }
  };

  if (step === "request") {
    return (
      <div className="w-full md:w-3/5 p-6 sm:p-10 flex flex-col justify-between relative bg-white min-h-[380px]">
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none opacity-[0.06] z-0">
          <svg viewBox="0 0 400 100" fill="none" className="w-full h-full">
            <path d="M0 100 H400 V70 H380 V60 H360 V75 H340 V50 H320 V70 H300 V40 H280 V65 H260 V30 H240 V75 H220 V55 H200 V80 H180 V45 H160 V70 H140 V50 H120 V75 H100 V35 H80 V60 H60 V30 H40 V65 H20 V50 H0 Z" fill="#0B2A5B" />
          </svg>
        </div>

        <div className="space-y-5 z-10 w-full">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-black text-[#1E293B] tracking-tight text-center">FORGOT PASSWORD</h2>
            <p className="text-[10px] text-slate-500 font-bold leading-normal text-center">
              Please enter your registered email address to receive a 6-digit OTP verification code.
            </p>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className={`w-full px-3 py-2.5 border-2 rounded-lg text-xs font-semibold text-slate-700 outline-none border-[#F05A28] ${
                  errors.email ? "bg-red-50/10 border-red-500" : ""
                }`}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-[9.5px] font-bold">⚠ {errors.email}</p>
              )}
            </div>

            {errors.global && (
              <p className="text-red-500 text-[10px] font-bold text-center">⚠ {errors.global}</p>
            )}

            {message && (
              <p className="text-emerald-600 text-[10px] font-bold text-center">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F05A28] hover:bg-[#D9481B] text-white font-extrabold py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-50 mt-1"
            >
              {loading ? "Sending OTP..." : "Send OTP Code"}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-[10.5px] font-extrabold text-[#0B2A5B] hover:text-[#FF6B00] transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/5 p-6 sm:p-10 flex flex-col justify-between relative bg-white min-h-[380px]">
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden pointer-events-none opacity-[0.06] z-0">
        <svg viewBox="0 0 400 100" fill="none" className="w-full h-full">
          <path d="M0 100 H400 V70 H380 V60 H360 V75 H340 V50 H320 V70 H300 V40 H280 V65 H260 V30 H240 V75 H220 V55 H200 V80 H180 V45 H160 V70 H140 V50 H120 V75 H100 V35 H80 V60 H60 V30 H40 V65 H20 V50 H0 Z" fill="#0B2A5B" />
        </svg>
      </div>

      <div className="space-y-4 z-10 w-full">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-black text-[#1E293B] tracking-tight text-center">RESET PASSWORD</h2>
          <p className="text-[10px] text-slate-500 font-bold leading-normal text-center">
            Verification OTP sent to: <strong className="text-slate-700">{email}</strong>
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-3">
          <div className="space-y-1">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-Digit OTP"
              maxLength={6}
              className={`w-full px-3 py-2 border-2 rounded-lg text-xs font-semibold text-slate-700 outline-none border-[#F05A28] ${
                errors.otp ? "bg-red-50/10 border-red-500" : ""
              }`}
              disabled={loading}
            />
            {errors.otp && (
              <p className="text-red-500 text-[9.5px] font-bold">⚠ {errors.otp}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                className={`w-full px-3 py-2 border-2 rounded-lg text-xs font-semibold text-slate-700 outline-none border-[#F05A28] pr-10 ${
                  errors.password ? "bg-red-50/10 border-red-500" : ""
                }`}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[9.5px] font-bold">⚠ {errors.password}</p>
            )}
          </div>

          <div className="space-y-1">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className={`w-full px-3 py-2 border-2 rounded-lg text-xs font-semibold text-slate-700 outline-none border-[#F05A28] ${
                errors.confirmPassword ? "bg-red-50/10 border-red-500" : ""
              }`}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-[9.5px] font-bold">⚠ {errors.confirmPassword}</p>
            )}
          </div>

          {errors.global && (
            <p className="text-red-500 text-[10px] font-bold text-center">⚠ {errors.global}</p>
          )}

          {message && (
            <p className="text-emerald-600 text-[10px] font-bold text-center">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F05A28] hover:bg-[#D9481B] text-white font-extrabold py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm disabled:opacity-50 mt-1"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={timer > 0 || loading}
            className="text-[10px] font-extrabold text-[#F05A28] hover:underline disabled:text-slate-400"
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setStep("request");
              setErrors({});
              setMessage("");
            }}
            className="text-[10px] font-extrabold text-[#0B2A5B] hover:underline"
            disabled={loading}
          >
            Change Email
          </button>
        </div>
      </div>
    </div>
  );
};
