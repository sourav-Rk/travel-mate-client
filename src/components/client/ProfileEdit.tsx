"use client";

import { useState, useRef, useEffect } from "react";
import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Users, FileText, Save, X, Camera, Upload, ArrowLeft, CheckCircle } from 'lucide-react';
import { useFormik } from "formik";
import {
  useClientProfileMutation,
  useClientProfileQuery,
} from "@/hooks/client/useClientProfile";
import { uploadImages } from "@/services/client/client.service";
import { Spinner } from "../Spinner";
import { clientProfileSchema } from "@/utils/clientProfile.validator";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface ClientEditProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  bio: string;
  profileImage: string;
}

export function ProfileEditPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useClientProfileQuery();
  const { mutateAsync: updateClient } = useClientProfileMutation();
  const client = data?.client;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);
   const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  if(isLoading) return <Spinner/>

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const formik = useFormik({
    enableReinitialize : true,
    initialValues: {
      firstName: client?.firstName || "",
      lastName: client?.lastName || "",
      email: client?.email || "",
      phone: client?.phone || "",
      gender: client?.gender || "",
      bio: client?.bio || "",
      profileImage: client?.profileImage || "",
    },
    validationSchema: clientProfileSchema,
    validateOnChange: true,
    validateOnMount: false,
    validateOnBlur: true,
    onSubmit: async (values: ClientEditProfile) => {
      await handleSave(values);
    },
  });

  const handleSave = async (values: ClientEditProfile) => {
    setIsPending(true);
    let profileImageUrl = values.profileImage;

    if (selectedFile) {
      const result = await uploadImages([selectedFile]);
      profileImageUrl = result[0].url;
    }

    const updatedValues = { ...values, profileImage: profileImageUrl };

    updateClient(updatedValues, {
      onSuccess: (data) => {
        toast.success(data.message);
        setIsPending(false);
        navigate("/pvt/profile");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data.message);
        setIsPending(false);
      },
    });
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImagePreview(null);
    navigate("/pvt/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 md:p-6 lg:p-8 md:ml-80">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1396b0] to-[#5aabba] bg-clip-text text-transparent">
              Edit Profile
            </h1>
            <p className="text-slate-600 text-sm md:text-base">
              Update your personal information and preferences
            </p>
          </div>
        </div>

        {/* Main Edit Form */}
        <form onSubmit={formik.handleSubmit}>
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm  border-slate-200/60">
            <CardHeader className="pb-6">
              <div className="flex flex-col items-center gap-6">
                {/* Profile Image Upload */}
                <div className="relative group">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-lg">
                    <AvatarImage
                      src={
                        imagePreview ||
                        client?.profileImage ||
                        "/placeholder.svg"
                       || "/placeholder.svg"}
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#1396b0] to-[#5aabba] text-white text-xl md:text-2xl font-bold">
                      {client?.firstName[0]}
                      {client?.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                  <div
                    className="absolute -bottom-2 -right-2 bg-[#1396b0] rounded-full p-2 shadow-lg cursor-pointer hover:bg-[#5aabba] transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 text-white" />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 border-green-200"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified Account
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#1396b0] mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#5aabba]" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-slate-700"
                    >
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      {...formik.getFieldProps("firstName")}
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <p className="text-sm text-red-500">
                        {formik.errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-slate-700"
                    >
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      {...formik.getFieldProps("lastName")}
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <p className="text-sm text-red-500">
                        {formik.errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-200/60" />

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#1396b0] mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#5aabba]" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email Address *
                    </Label>
                    <Input id="email" {...formik.getFieldProps("email")} />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-sm text-red-500">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-slate-700"
                    >
                      Phone Number
                    </Label>
                    <Input id="phone" {...formik.getFieldProps("phone")} />
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-sm text-red-500">
                        {formik.errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-200/60" />

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#1396b0] mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#5aabba]" />
                  Personal Information
                </h3>
                <div className="space-y-2">
                  <Label
                    htmlFor="gender"
                    className="text-sm font-medium text-slate-700"
                  >
                    Gender
                  </Label>
                  <Select
                    value={formik.values.gender}
                    onValueChange={(value) =>
                      formik.setFieldValue("gender", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="bg-slate-200/60" />

              {/* Bio Section */}
              <div>
                <h3 className="text-lg font-semibold text-[#1396b0] mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#5aabba]" />
                  About Me
                </h3>
                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-sm font-medium text-slate-700"
                  >
                    Bio
                  </Label>
                  <Textarea id="bio" {...formik.getFieldProps("bio")} />
                  <div className="text-right text-xs text-slate-500">
                    {client?.bio?.length}/500 characters
                  </div>
                </div>
              </div>

              <Separator className="bg-slate-200/60" />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isPending || !formik.isValid}
                  className="flex-1 bg-gradient-to-r from-[#1396b0] to-[#5aabba] hover:from-[#1396b0]/90 hover:to-[#5aabba]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className="flex-1 border-[#1396b0]/30 hover:bg-[#1396b0]/5 hover:border-[#1396b0]/50 transition-all duration-200 bg-transparent text-[#1396b0]"
                  size="lg"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    
    </div>
  );
}
