"use client";

import { useState, useEffect } from "react";
import { Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  useVendorResendEmailOtp,
  useVendorSendEmailMutation,
  useVendorUpdateDetailsMutation,
} from "@/hooks/vendor/useVendorProfile";
import toast from "react-hot-toast";
import { useVerifyOtpMutation } from "@/hooks/auth/useVerifyOtp";

interface EmailVerificationModalProps {
  currentEmail: string;
  onEmailChange: (newEmail: string) => void;
}

export function EmailVerificationModal({
  currentEmail,
  onEmailChange,
}: EmailVerificationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otpValue, setOtpValue] = useState(currentEmail);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const { mutate: sendMail } = useVendorSendEmailMutation();
  const { mutate: resendOtp } = useVendorResendEmailOtp();
  const { mutateAsync: verifyOtp } = useVerifyOtpMutation();
  const { mutateAsync: updateProfile } = useVendorUpdateDetailsMutation();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    setIsLoading(true);

    sendMail(newEmail, {
      onSuccess: (response) => {
        toast.success(response.message);
        setIsOtpSent(true);
        setTimer(60);
        setCanResend(false);
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message || "Failed to send OTP";
        toast.error(errorMessage);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });
  };

  const handleResendOtp = () => {
    setOtpValue("");

    resendOtp(newEmail, {
      onSuccess: (response: any) => {
        toast.success(response.data?.message || "OTP resent successfully");
        setTimer(60);
        setCanResend(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to resend OTP");
      },
    });
  };

  const handleVerifyOtpAndUpdate = async () => {
    setIsLoading(true);

    try {
      await verifyOtp({ email: newEmail, otp: otpValue });

      const response = await updateProfile({ email: newEmail });

      setIsEmailVerified(true);
      onEmailChange(newEmail);
      toast.success(response.message || "Email verified and profile updated!");

      // 4. ✅ Close modal after short delay
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Failed to verify OTP or update profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsOtpSent(false);
    setOtpValue("");
    setNewEmail("");
    setTimer(0);
    setCanResend(false);
    setIsEmailVerified(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="px-3 bg-transparent">
          <Shield className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Email Address</DialogTitle>
          <DialogDescription>
            Enter your new email address and verify it with OTP
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!isOtpSent ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="newEmail">New Email Address</Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={handleSendOtp}
                disabled={!newEmail || isLoading}
                className="w-full"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">
                    Enter the 6-digit OTP sent to
                  </p>
                  <p className="font-medium text-slate-900">{newEmail}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-center block">Enter OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={(value) => {
                        const numericValue = value.replace(/[^0-9]/g, "");
                        setOtpValue(numericValue);
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                {/* Timer and Resend */}
                <div className="text-center space-y-2">
                  {timer > 0 ? (
                    <p className="text-sm text-slate-600">
                      Resend OTP in{" "}
                      <span className="font-mono font-medium text-blue-600">
                        {formatTime(timer)}
                      </span>
                    </p>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-slate-500">
                        {"Didn't receive the code?"}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                      >
                        {isLoading ? "Resending..." : "Resend OTP"}
                      </Button>
                    </div>
                  )}
                </div>

                {isEmailVerified ? (
                  <div className="flex items-center justify-center gap-2 text-green-600 py-2">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">
                      Email verified successfully!
                    </span>
                  </div>
                ) : (
                  <Button
                    onClick={handleVerifyOtpAndUpdate}
                    disabled={otpValue.length !== 6 || isLoading || canResend}
                    className="w-full"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
