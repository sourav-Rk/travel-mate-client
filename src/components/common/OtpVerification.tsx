"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {Card,CardContent,CardDescription,CardHeader, CardTitle,} from "@/components/ui/card";
import { InputOTP,InputOTPGroup,InputOTPSlot,} from "@/components/ui/input-otp";
import { ArrowLeft, Mail, Shield,CheckCircle2,AlertCircle,} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVerifyOtpMutation } from "@/hooks/auth/useVerifyOtp";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const OTP_EXPIRY_KEY = "otpExpiry";

  const location = useLocation();
  const email = location.state?.email;

  const { mutate: verifyOtp } = useVerifyOtpMutation();

  // Countdown timer for resend button
  useEffect(() => {
    const storedExpiry = localStorage.getItem(OTP_EXPIRY_KEY);

    if (storedExpiry) {
      const timeLeft = Math.floor(
        (Number.parseInt(storedExpiry) - Date.now()) / 1000
      );
      if (timeLeft > 0) {
        setCountdown(timeLeft);
        setCanResend(false);
      } else {
        setCountdown(0);
        setCanResend(true);
        localStorage.removeItem(OTP_EXPIRY_KEY); // Clean up expired timer
      }
    } else {
      // Set initial expiry time when component first loads
      const initialExpiryTime = Date.now() + 60 * 1000;
      localStorage.setItem(OTP_EXPIRY_KEY, initialExpiryTime.toString());
      setCountdown(60);
      setCanResend(false);
    }
  }, []);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
      localStorage.removeItem(OTP_EXPIRY_KEY); // Clean up when timer reaches 0
    }
  }, [countdown, canResend]);

  const handleSubmit = async () => {
    if (otp.length !== 6) return;
    setStatus("idle");
    setMessage("");
    verifyOtp(
      { email, otp },
      {
        onSuccess: (response) => {
          setStatus("success");
          toast.success(String(response.message));
          navigate("/login")
          setMessage("OTP Verified");
        },
        onError: (error: any) => {
          setStatus("error");
          setMessage(error || "verification failed");
          setOtp("");
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      }
    );
  };

  const handleResend = async () => {
    setIsResending(true);
    setStatus("idle");
    setMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save the new expiry timestamp
      const expiryTime = Date.now() + 60 * 1000;
      localStorage.setItem(OTP_EXPIRY_KEY, expiryTime.toString());

      setCountdown(60);
      setCanResend(false);
      setMessage("OTP sent successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    // Navigate back logic would go here
    console.log("Navigate back");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-6 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Verify Your Account
              </CardTitle>
              <CardDescription className="text-base">
                We've sent a 6-digit verification code to
              </CardDescription>
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600">
                <Mail className="w-4 h-4" />
                user@example.com
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-4">
              <div className="text-center">
                <label className="text-sm font-medium text-gray-700 mb-4 block">
                  Enter verification code
                </label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  className="justify-center"
                >
                  <InputOTPGroup className="gap-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className={cn(
                          "w-12 h-12 text-lg font-bold border-2 rounded-xl transition-all duration-200",
                          "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                          "data-[active=true]:border-blue-500 data-[active=true]:ring-2 data-[active=true]:ring-blue-200",
                          status === "error" && "border-red-300 bg-red-50",
                          status === "success" && "border-green-300 bg-green-50"
                        )}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Status Message */}
              {message && (
                <div
                  className={cn(
                    "flex items-center justify-center gap-2 text-sm font-medium p-3 rounded-lg transition-all duration-300",
                    status === "success" &&
                      "text-green-700 bg-green-50 border border-green-200",
                    status === "error" &&
                      "text-red-700 bg-red-50 border border-red-200",
                    status === "idle" &&
                      "text-blue-700 bg-blue-50 border border-blue-200"
                  )}
                >
                  {status === "success" && <CheckCircle2 className="w-4 h-4" />}
                  {status === "error" && <AlertCircle className="w-4 h-4" />}
                  {status === "idle" && <Mail className="w-4 h-4" />}
                  {message}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={
                otp.length !== 6 || isSubmitting || status === "success"
              }
              className={cn(
                "w-full h-12 text-base font-semibold rounded-xl transition-all duration-200",
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : status === "success" ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified!
                </div>
              ) : (
                "Verify Code"
              )}
            </Button>

            {/* Resend Section */}
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={!canResend || isResending}
                className={cn(
                  "h-10 px-6 rounded-xl border-2 transition-all duration-200",
                  "hover:bg-gray-50 hover:border-gray-300",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isResending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : canResend ? (
                  "Resend Code"
                ) : (
                  `Resend in ${countdown}s`
                )}
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-xs text-muted-foreground">
                Having trouble? Check your spam folder or{" "}
                <button className="text-blue-600 hover:underline font-medium">
                  contact support
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            Your security is our priority. This code expires in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );
}
