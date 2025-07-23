"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Plane, MapPin, Camera } from "lucide-react"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-7xl w-full grid lg:grid-cols-2">
        {/* Left Side - Auth Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-sky-100 p-3 rounded-full mr-3">
                <Plane className="w-8 h-8 text-sky-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">TravelMate</h1>
            </div>
            <p className="text-gray-600">Your Journey Begins Here</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-sky-50">
              <TabsTrigger value="login" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-sky-500 data-[state=active]:text-white">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
                <p className="text-gray-600 text-sm">Ready for your next adventure?</p>
              </div>

              {/* Google Auth Button */}
              <Button variant="outline" className="w-full h-12 border-sky-200 hover:bg-sky-50 bg-transparent">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="mt-2 h-12 border-sky-200 focus:border-sky-400"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="h-12 pr-10 border-sky-200 focus:border-sky-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Button variant="link" className="text-sky-600 hover:text-sky-700 p-0 h-auto">
                  Forgot Password?
                </Button>
              </div>

              <Button className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white">Sign In</Button>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Join TravelMate</h2>
                <p className="text-gray-600 text-sm">Start your journey with us today</p>
              </div>

              {/* Google Auth Button */}
              <Button variant="outline" className="w-full h-12 border-sky-200 hover:bg-sky-50 bg-transparent">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or create account</span>
                </div>
              </div>

              {/* Signup Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      className="mt-2 h-12 border-sky-200 focus:border-sky-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">
                      Last Name
                    </Label>
                    <Input id="lastName" placeholder="Doe" className="mt-2 h-12 border-sky-200 focus:border-sky-400" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signupEmail" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="mt-2 h-12 border-sky-200 focus:border-sky-400"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="mt-2 h-12 border-sky-200 focus:border-sky-400"
                  />
                </div>

                <div>
                  <Label htmlFor="gender" className="text-gray-700 font-medium">
                    Gender
                  </Label>
                  <Select>
                    <SelectTrigger className="mt-2 h-12 border-sky-200 focus:border-sky-400">
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="signupPassword" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="signupPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="h-12 pr-10 border-sky-200 focus:border-sky-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="h-12 pr-10 border-sky-200 focus:border-sky-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Button className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white">Create Account</Button>

              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to our{" "}
                <Button variant="link" className="text-sky-600 hover:text-sky-700 p-0 h-auto text-xs">
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button variant="link" className="text-sky-600 hover:text-sky-700 p-0 h-auto text-xs">
                  Privacy Policy
                </Button>
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Side - Travel Images */}
        <div className="relative hidden lg:block bg-gradient-to-br from-sky-400 to-blue-500">
          <div className="absolute inset-0 bg-black/20" />

          {/* Background Image */}
          <div className="relative h-full">
            <img
              src="/ChatGPT Image Jul 20, 2025, 06_26_46 PM.png"
              alt="Beautiful tropical destination"
         
              className="object-cover"
            />
          </div>

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
            {/* Top Section */}
            <div className="space-y-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-sm">
                <div className="flex items-center mb-3">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Discover Amazing Places</span>
                </div>
                <p className="text-sm opacity-90">Explore breathtaking destinations around the world with TravelMate</p>
              </div>
            </div>

            {/* Middle Section - Travel Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">150+</div>
                <div className="text-sm opacity-90">Countries</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm opacity-90">Happy Travelers</div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="space-y-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-sm">
                <div className="flex items-center mb-3">
                  <Camera className="w-5 h-5 mr-2" />
                  <span className="font-semibold">Capture Memories</span>
                </div>
                <p className="text-sm opacity-10">
                  Create unforgettable moments and share your adventures with fellow travelers
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
