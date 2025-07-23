"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useForgotPasswordSendMailMutation } from "@/hooks/auth/useForgotPassword"
import toast from "react-hot-toast"

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {mutate : sendMail,isPending} = useForgotPasswordSendMailMutation();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
   
    sendMail({email},{
        onSuccess : (data) =>{
            setIsSubmitted(true)
            toast.success(data.message);
            navigate("/")
        },
        onError :(error : any) =>{
            toast.error(error?.response?.data.message || "unable to send the mail");
        }
    })


  }

  return (
    <div className="min-h-[500px] flex items-center justify-center p-4 md:p-6 lg:p-8">
      <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-1">
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Forgot Password
          </h1>
          <p className="text-slate-600 text-sm">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError("")
                    }}
                    className={`pl-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                      error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                    disabled={isPending}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-slate-900">Check Your Email</h3>
                <p className="text-slate-600">
                  We've sent a password reset link to <span className="font-medium">{email}</span>
                </p>
                <p className="text-sm text-slate-500">If you don't see it, please check your spam folder</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t border-slate-200 pt-4">
          <Button variant="link" onClick={() => navigate("/")} className="text-slate-600 hover:text-blue-600">
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
