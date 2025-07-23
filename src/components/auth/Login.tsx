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
import { Eye, EyeOff,  Plane, Shield, Store, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { loginSchema } from "@/utils/login.validator";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/hooks/auth/useLogin";
import type { LoginType } from "@/types/authTypes";
import { dispatchUserByRole } from "@/utils/roleDispatcher";
import { useDispatch } from "react-redux";

interface LoginProps {
  userType: "client" | "vendor" | "admin" | "guide";
}

export default function LoginForm({ userType }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: login } = useLoginMutation();

  // Conditional styling based on userType
  const getThemeConfig = () => {
    switch (userType) {
      case "client":
        return {
          gradient: "from-blue-500 to-teal-500",
          hoverGradient: "from-blue-600 to-teal-600",
          icon: Plane,
          cardBg: "bg-gradient-to-br from-blue-50/90 to-teal-50/90",
          iconBg: "bg-gradient-to-br from-blue-500 to-teal-500",
          accent: "text-blue-600 hover:text-blue-800"
        };
      case "vendor":
        return {
          gradient: "from-purple-500 to-pink-500",
          hoverGradient: "from-purple-600 to-pink-600",
          icon: Store,
          cardBg: "bg-gradient-to-br from-purple-50/90 to-pink-50/90",
          iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
          accent: "text-purple-600 hover:text-purple-800"
        };
      case "admin":
        return {
          gradient: "from-red-500 to-orange-500",
          hoverGradient: "from-red-600 to-orange-600",
          icon: Shield,
          cardBg: "bg-gradient-to-br from-red-50/90 to-orange-50/90",
          iconBg: "bg-gradient-to-br from-red-500 to-orange-500",
          accent: "text-red-600 hover:text-red-800"
        };
      case "guide":
        return {
          gradient: "from-green-500 to-emerald-500",
          hoverGradient: "from-green-600 to-emerald-600",
          icon: MapPin,
          cardBg: "bg-gradient-to-br from-green-50/90 to-emerald-50/90",
          iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
          accent: "text-green-600 hover:text-green-800"
        };
      default:
        return {
          gradient: "from-blue-500 to-teal-500",
          hoverGradient: "from-blue-600 to-teal-600",
          icon: Plane,
          cardBg: "bg-gradient-to-br from-blue-50/90 to-teal-50/90",
          iconBg: "bg-gradient-to-br from-blue-500 to-teal-500",
          accent: "text-blue-600 hover:text-blue-800"
        };
    }
  };

  const theme = getThemeConfig();
  const IconComponent = theme.icon;

  const handleSubmit = (values: LoginType) => {
    const payloadWithRole = { ...values, role: userType };
    login(payloadWithRole, {
      onSuccess: (response) => {
        toast.success(`${response.message}`);
        dispatchUserByRole({
          userType,
          user: response.user,
          dispatch,
          navigate,
        });
      },
      onError: (error: any) => {
        toast.error(error);
        formik.setSubmitting(false);
      },
    });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password/sendmail");
  };

  // const handleGoogleAuth = () => {
  //   toast.success("Google authentication initiated");
  // };

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
    <Card className={`backdrop-blur-sm ${theme.cardBg} border-0 shadow-2xl transition-all duration-300`}>
      <CardHeader className="text-center space-y-2">
        <div className={`mx-auto w-16 h-16 ${theme.iconBg} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-gray-600">
          Sign in to continue your journey with Travel Mate as {userType}
        </CardDescription>
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
              className="transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
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
                className="transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
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

        {/* {userType === "client" && (
          <Button
            type="button"
            variant="outline"
            className="w-full border-gray-300 hover:bg-gray-50 bg-transparent transition-all duration-200"
            onClick={handleGoogleAuth}
          >
            <Mail className="w-4 h-4 mr-2" />
            Continue with Google
          </Button>
        )} */}

        {userType === "client" ||
          (userType === "vendor" && (
            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className={`${theme.accent} hover:underline font-medium cursor-pointer transition-colors`}
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </button>
              </p>
            </div>
          ))}
      </CardContent>
    </Card>
  );
}