/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAppState } from "../../context/AppContext";
import { AuthShell } from "../../components/auth/AuthShell";

export const VerifyOtp: React.FC = () => {
  const { verifyOtp, resendOtp, showToast } = useAppState();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") || "founder@kisanbot.in";

  // Segmented multi-inputs
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  const [timerCount, setTimerCount] = useState(59);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerCount]);

  // Focus management
  useEffect(() => {
    // Focus first element on load
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, val: string) => {
    // Only accept numeric inputs
    if (val && !/^\d+$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val.slice(-1); // Take only last character
    setDigits(newDigits);

    // Shift focus right if input registered
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Shift left and clear
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      }
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp();
      setTimerCount(59);
      setDigits(Array(6).fill(""));
      inputRefs.current[0]?.focus();
      showToast("A new verification code has been sent to your email.", "success");
    } catch (err: any) {
      showToast(err.message || "Unable to resend the verification code.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const joinedCode = digits.join("");
    if (joinedCode.length < 6) {
      showToast("Please provide the complete 6-digit confirmation digits.", "error");
      return;
    }

    setLoading(true);
    try {
      const tempReg = JSON.parse(localStorage.getItem("bsi_temp_registration") || "{}");
      if (!tempReg.email && email) {
        localStorage.setItem(
          "bsi_temp_registration",
          JSON.stringify({
            ...tempReg,
            email,
            timestamp: Date.now(),
          })
        );
      }

      await verifyOtp(joinedCode);
      showToast("Email validation authorized successfully! Welcome to Bhaskar.", "success");
      navigate("/startup/dashboard");
    } catch (err: any) {
      showToast(err.message || "Verification failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="email verification"
      title="Security Code Validation"
      description={
        <>
          We have dispatched a six-digit verification code to your email address.
          <br />
          <strong className="font-mono text-slate-700 select-all">{email}</strong>
        </>
      }
      maxWidthClassName="max-w-3xl"
      showFooterNote={false}
      aside={
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#07184A] text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D94F00]">Code</div>
            <div className="text-sm font-black text-[#07184A]">6-digit verification</div>
          </div>
        </div>
      }
    >
      <div className="space-y-6 text-sm text-slate-700">

          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" id="verify-otp-form">
            
            {/* Split Input Grid */}
            <div className="mx-auto flex max-w-sm justify-between gap-2 pt-2" id="segmented-digits-wrapper">
              {Array(6).fill(0).map((_, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  maxLength={1}
                  value={digits[idx]}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  placeholder="-"
                  className="h-12 w-11 rounded-md border border-slate-300 bg-white text-center font-mono text-lg font-extrabold text-[#07184A] outline-none transition hover:border-[#FF6B00]/50 focus:border-[#FF6B00] focus:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] focus:ring-0 sm:h-14 sm:w-12"
                  id={`otp-digit-${idx}`}
                />
              ))}
            </div>

            {/* OTP guidance */}
            <div className="rounded-lg border border-orange-100 bg-orange-50 p-3 text-center text-xs font-semibold leading-normal text-slate-600">
              Check your inbox for the 6-digit code and use it here to verify your account.
            </div>

            {/* Timer resend block */}
            <div className="text-center text-xs font-semibold">
              {timerCount > 0 ? (
                <p className="text-slate-400">
                  Resend token in <span className="font-mono font-black text-[#07184A]">{timerCount} seconds</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-black text-[#FF6B00] hover:underline focus:outline-none"
                >
                  Resend Verification OTP Code
                </button>
              )}
            </div>

            {/* Submission triggers */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-[#FF6B00] py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-[#e65f00] disabled:cursor-not-allowed disabled:opacity-50"
                id="btn-otp-authorize"
              >
                {loading ? "Validating security codes..." : "Continue"}
              </button>
            </div>

          </form>

        </div>
      </AuthShell>
  );
};
