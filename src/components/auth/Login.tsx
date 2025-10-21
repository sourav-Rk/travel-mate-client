"use client";

import { useFormik } from "formik";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Plane, Shield, Store, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { loginSchema } from "@/utils/login.validator";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import type { LoginType } from "@/types/authTypes";
import { dispatchUserByRole } from "@/utils/roleDispatcher";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/userSlice";

interface LoginProps {
  userType: "client" | "vendor" | "admin" | "guide";
}

export default function LoginForm({ userType }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError,setServerError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: login } = useLoginMutation();

  const getThemeConfig = () => {
    switch (userType) {
      case "client":
        return {
          gradient: "from-blue-500 to-teal-500",
          hoverGradient: "from-blue-600 to-teal-600",
          icon: Plane,
          cardBg: "bg-gradient-to-br from-blue-50/90 to-teal-50/90",
          iconBg: "bg-gradient-to-br from-blue-500 to-teal-500",
          accent: "text-blue-600 hover:text-blue-800",
        };
      case "vendor":
        return {
          gradient: "bg-[#2CA4BC]", 
          hoverGradient: "bg-cyan-700", 
          icon: Store,
          cardBg: "bg-white/90",
          iconBg: "bg-[#2CA4BC]",
          accent: "text-cyan-700 hover:text-cyan-800",
        }
         case "admin":
        return {
          // Admin: distinctive royal theme (not black/dark)
          gradient: "from-indigo-500 to-purple-600",
          hoverGradient: "from-indigo-600 to-purple-700",
          icon: Shield,
          cardBg: "bg-gradient-to-br from-indigo-50/90 to-purple-50/90",
          iconBg: "bg-gradient-to-r from-indigo-500 to-purple-600",
          descriptionTextColor: "text-slate-600",
          inputTextColor: "text-slate-900",
          labelTextColor: "text-slate-700",
          titleTextColor: "text-slate-900",
          signupTextColor: "text-slate-600",
          accent: "text-indigo-600 hover:text-indigo-800",
        };

       case "guide":
        return {
          gradient: "from-cyan-500 to-teal-100", // Matching #2CA4BC with gradient
          hoverGradient: "from-cyan-600 to-teal-600", // Matching #2CA4BC with gradient
          icon: MapPin,
          cardBg: "bg-gradient-to-br from-cyan-50/90 to-teal-50/90", // Matching #2CA4BC with gradient
          iconBg: "bg-gradient-to-br from-cyan-500 to-teal-500", // Matching #2CA4BC with gradient
          accent: "text-cyan-600 hover:text-cyan-800", // Matching #2CA4BC
        }
      default:
        return {
          gradient: "from-blue-500 to-teal-500",
          hoverGradient: "from-blue-600 to-teal-600",
          icon: Plane,
          cardBg: "bg-gradient-to-br from-blue-50/90 to-teal-50/90",
          iconBg: "bg-gradient-to-br from-blue-500 to-teal-500",
          accent: "text-blue-600 hover:text-blue-800",
        };
    }
  };

  const theme = getThemeConfig();

  const handleSubmit = (values: LoginType) => {
    const payloadWithRole = { ...values, role: userType };
    login(payloadWithRole, {
      onSuccess: (response) => {
        toast.success(`${response.message}`);
        dispatch(loginUser(response.user));
        dispatchUserByRole({
          userType,
          navigate,
        });
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
        setServerError(error?.response?.data.message || "Login failed");
        formik.setSubmitting(false);
      },
    });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password/sendmail");
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    validateOnMount: false,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values) => {
      handleSubmit({ ...values, role: userType });
    },
  });

  return (
    <Card
      className={`backdrop-blur-sm ${theme.cardBg} border-0 shadow-2xl transition-all duration-300`}
    >
      <CardHeader className="text-center space-y-2">
        {/* TravelMate Logo */}
        <div className="flex justify-center">
          <img
            src="/Travel_Mate_Logo.png"
            className="w-25 h-auto"
            alt="TravelMate Logo"
          />
        </div>

        {/* Role-specific Icon */}

        <CardTitle className="text-2xl font-bold text-gray-800">
          Welcome Back
        </CardTitle>
        <CardDescription className={theme.descriptionTextColor}>
          Sign in to continue your journey with Travel Mate as {userType}
        </CardDescription>
         {serverError && <p className="text-sm text-red-500">{serverError}</p>} 
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
              required
              className={`transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${
                theme.inputTextColor || ""
              }`}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...formik.getFieldProps("password")}
                required
                className={`transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${
                  theme.inputTextColor || ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {formik.errors.password && formik.touched.password && (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className={`text-sm ${theme.accent} hover:underline transition-colors`}
            >
              Forgot Password?
            </button>
          </div>

          <Button
            type="submit"
            className={`w-full bg-gradient-to-r ${theme.gradient} hover:${theme.hoverGradient} transition-all duration-200 shadow-lg hover:shadow-xl`}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <Separator className="my-6" />

        {(userType === "client" || userType === "vendor") && (
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className={`${theme.accent} hover:underline font-medium cursor-pointer transition-colors`}
                onClick={() => userType === "client" ? navigate("/signup") : navigate("/vendor/signup")}
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
