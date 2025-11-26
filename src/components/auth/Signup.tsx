"use client";

import { useFormik } from "formik";
import { getSignupSchema } from "@/utils/signup.validator";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import {Card,CardContent,CardDescription,CardHeader,CardTitle,} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Plane } from "lucide-react";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useSendOTPMutation } from "@/hooks/auth/useSendOtp";
import type { SignupFormValues } from "@/types/authTypes";
import type { ApiError } from "@/types/api/api";

type UserType = "client" | "admin" | "vendor";

interface SignupProps{
    userType : UserType;
}

export default function SignupForm({userType} : SignupProps) {
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError,setServerError] = useState("");

  const {mutate : signup,isPending} = useSendOTPMutation();

  const navigate = useNavigate();

  const handleSubmit = (values : SignupFormValues) => {
    const payloadWithRole = {...values,role : userType};

    signup(payloadWithRole,{
      onSuccess : (data) =>{
        toast.success(`${data.message}`);
        navigate('/otp/verify',{state : {email : values.email}})
      },
      onError : (error : ApiError)=>{
        toast.error(error?.response?.data?.message || "Signup failed")
        setServerError(error?.response?.data?.message || "Registration failed");
      }
    })

  };

  // Dynamic initial values based on user type
  const getInitialValues = () => {
    const baseValues = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    };

    if (userType === "vendor") {
      return {
        ...baseValues,
        agencyName: "",
        description: "",
      };
    } else {
      return {
        ...baseValues,
        gender: "",
      };
    }
  };

  const formik = useFormik<SignupFormValues>({
    initialValues: getInitialValues(),
    validationSchema: getSignupSchema(userType),
    validateOnChange : true,
    validateOnMount : false,
    validateOnBlur : true,
    onSubmit: (values) => {
      handleSubmit(values)
    },
  });

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
          <Plane className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Sign up as {userType}
        </CardTitle>
        <CardDescription className="text-gray-600">
          Create your account and start your journey
        </CardDescription>
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Form Fields */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName"
              required
              {...formik.getFieldProps("firstName")}            
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p className="text-sm text-red-500">{formik.errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              required
              {...formik.getFieldProps("lastName")}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p className="text-sm text-red-500">{formik.errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>

          {/* Gender - Only show for non-vendor users */}
          {userType !== "vendor" && (
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                onValueChange={(value) => formik.setFieldValue("gender", value)}
                defaultValue={formik.values.gender}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched?.gender && formik.errors.gender && (
                <p className="text-sm text-red-500">{formik.errors.gender}</p>
              )}
            </div>
          )}

          {/* Agency Name - Only show for vendor users */}
          {userType === "vendor" && (
            <div className="space-y-2">
              <Label htmlFor="agencyName">Agency Name</Label>
              <Input
                id="agencyName"
                required
                {...formik.getFieldProps("agencyName")}
              />
              {formik.touched.agencyName && formik.errors.agencyName && (
                <p className="text-sm text-red-500">{formik.errors.agencyName}</p>
              )}
            </div>
          )}

          {/* Description - Only show for vendor users */}
          {userType === "vendor" && (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of your agency"
                {...formik.getFieldProps("description")}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-sm text-red-500">{formik.errors.description}</p>
              )}
            </div>
          )}

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" required {...formik.getFieldProps("phone")} />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-sm text-red-500">{formik.errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                required
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("password")}               
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                required
                type={showConfirmPassword ? "text" : "password"}
                {...formik.getFieldProps("confirmPassword")}           
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>
          <Button   type="submit"
            className={`w-full transition-colors duration-200 ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={isPending}
            >
            {isPending ? "Signing Up" : "Sign Up"}
          </Button>
        </form>
        <Separator className="my-6" />
         <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Already have an account ?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
              onClick={() => {
                  if(userType === "client") navigate("/login")
                  else if(userType === "vendor") navigate("/vendor")
              }}
            >
              Login
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}