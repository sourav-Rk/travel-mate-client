"use client"

import { useState } from "react"
import { ArrowLeft, Shield, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useOtpTimer } from "./hooks/use-otp-timer"
import { cn } from "@/lib/utils"
import { useVerifyOtpMutation } from "@/hooks/auth/useVerifyOtp"
import { useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useSignupMutation } from "@/hooks/auth/useSignup"
import { useResendOtpMutation } from "@/hooks/auth/useResendOtp"

export default function OtpVerification() {
  const [otp, setOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { timeLeft, isActive, canResend, startTimer, formatTime } = useOtpTimer();
  const navigate = useNavigate()
  const location = useLocation();
  const email = location.state.email;

  const {mutate : verifyOtp} = useVerifyOtpMutation();
  const {mutate : resendOtp} = useResendOtpMutation();
  const {mutateAsync : signup} = useSignupMutation();

  const handleVerify = async () => {
    if (otp.length !== 6) return
    verifyOtp({email,otp},{
        onSuccess:async () => {
            
            try{
                const signupResponse = await signup(email);
                toast.success(`${signupResponse.message}`);
                navigate("/");
            }catch(signupError : any){
                toast.error(signupError || "failed")
            }finally{
                setIsVerifying(false)
            }
        }, 
        onError :(error : any) =>{
            toast.error(error?.response?.data.message);
            console.log(error)
            setIsVerifying(false);
        }
    })
  }
const handleResend = async () => {
  if (!canResend) return;

  setIsResending(true);

  resendOtp({email} , {
    onSuccess: (response) => {
      toast.success(`${response.message}`);
      setIsResending(false);
    },
    onError: (error: any) => {
      toast.error(error);
      setIsResending(false);
    },
  });

  startTimer();
  setOtp("");     
};


  const handleBack = () => {
    navigate('/signup')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-6 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Verify Your Account
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              We've just sent a 6-digit verification code to your email address. Please enter it below to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP  maxLength={6} value={otp}
                  onChange={(value) => {
                  const numericOnly = value.replace(/\D/g, "") 
                    setOtp(numericOnly)
                  }}
                  className="gap-3">
                  <InputOTPGroup className="gap-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className={cn(
                          "w-12 h-12 text-lg font-semibold border-2 rounded-xl transition-all duration-200",
                          "focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
                          "hover:border-gray-400",
                          otp[index] ? "border-blue-500 bg-blue-50" : "border-gray-200",
                        )}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Timer Display */}
              <div className="flex items-center justify-center text-sm bg-gray-50 rounded-lg py-2 px-4">
                <Clock className="w-4 h-4 mr-2" />
                {isActive ? (
                  <span className="text-gray-600">Resend available in {formatTime(timeLeft)}</span>
                ) : (
                  <span className="text-green-600">You can now resend the code</span>
                )}
              </div>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:opacity-50"
            >
              {isVerifying ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </div>
              ) : (
                "Verify Code"
              )}
            </Button>

            {/* Resend Button */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={!canResend || isResending}
                className={cn(
                  "font-medium transition-all duration-200",
                  canResend
                    ? "text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                    : "text-gray-400 border-gray-200 cursor-not-allowed",
                )}
              >
                {isResending ? (
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Code
                  </div>
                )}
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Having trouble? Contact our support team for assistance.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
