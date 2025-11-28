"use client";

import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGuideProfileQuery } from "@/hooks/guide/useGuideProfile";
import { useUpdateGuideProfileMutation } from "@/hooks/guide/useGuideProfileEdit";
import { guideProfileEditSchema, type GuideProfileEditFormValues } from "@/utils/guideProfileEdit.validator";
import { uploadGuideImages } from "@/services/guide/upload.service";
import { LanguageInput } from "@/components/vendor/addGuide/LanguageInput";
import toast from "react-hot-toast";
import type { ApiError } from "@/types/api/api";
import { Spinner } from "@/components/Spinner";

export default function GuideProfileEditPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading: isLoadingProfile } = useGuideProfileQuery();
  const { mutateAsync: updateProfile, isPending } = useUpdateGuideProfileMutation();
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const guide = data?.guide;

  useEffect(() => {
    if (guide) {
      formik.setValues({
        profileImage: guide.profileImage || null,
        bio: guide.bio || null,
        languageSpoken: guide.languageSpoken || [],
        phone: guide.phone || "",
        alternatePhone: guide.alternatePhone || null,
      });
      if (guide.profileImage) {
        setImagePreview(guide.profileImage);
      }
    }
  }, [guide]);

  const formik = useFormik<GuideProfileEditFormValues>({
    enableReinitialize: true,
    initialValues: {
      profileImage: guide?.profileImage || null,
      bio: guide?.bio || null,
      languageSpoken: guide?.languageSpoken || [],
      phone: guide?.phone || "",
      alternatePhone: guide?.alternatePhone || null,
    },
    validationSchema: guideProfileEditSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      await handleSave(values);
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
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

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    formik.setFieldValue("profileImage", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async (values: GuideProfileEditFormValues) => {
    try {
      let profileImageUrl = values.profileImage;

      if (selectedFile) {
        const result = await uploadGuideImages([selectedFile]);
        profileImageUrl = result[0]?.url || profileImageUrl;
      }

      const updatedValues: GuideProfileEditFormValues = {
        ...values,
        profileImage: profileImageUrl,
      };

      updateProfile(updatedValues, {
        onSuccess: (response) => {
          toast.success(response.message);
          navigate("/guide/profile");
        },
        onError: (error: ApiError) => {
          toast.error(
            error?.response?.data?.message || "Failed to update profile"
          );
        },
      });
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImagePreview(null);
    navigate("/guide/profile");
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 md:ml-64 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const getInitials = (firstName?: string, lastName?: string): string => {
    if (!firstName || !lastName) return "GU";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 md:ml-64">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/guide/profile")}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Edit Profile
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600">
            Update your profile information
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center sm:items-start gap-4">
                <Label className="text-sm font-medium text-gray-700">
                  Profile Image
                </Label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-lg ring-2 ring-[#2CA4BC]/30">
                      <AvatarImage
                        src={imagePreview || guide?.profileImage || ""}
                        alt={`${guide?.firstName} ${guide?.lastName}`}
                      />
                      <AvatarFallback className="bg-[#2CA4BC] text-white text-xl sm:text-2xl font-semibold">
                        {getInitials(guide?.firstName, guide?.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    {imagePreview && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </Button>
                    <p className="text-xs text-gray-500">
                      JPG, PNG or GIF. Max size 5MB
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  value={formik.values.bio || ""}
                  onChange={(e) =>
                    formik.setFieldValue("bio", e.target.value || null)
                  }
                  onBlur={formik.handleBlur}
                  rows={4}
                  className={`resize-none ${
                    formik.touched.bio && formik.errors.bio
                      ? "border-red-500"
                      : ""
                  }`}
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  {formik.touched.bio && formik.errors.bio ? (
                    <p className="text-red-500 text-xs">
                      {formik.errors.bio}
                    </p>
                  ) : (
                    <span></span>
                  )}
                  <p className="text-xs text-gray-500">
                    {(formik.values.bio?.length || 0)}/500 characters
                  </p>
                </div>
              </div>

              <Separator />

              {/* Languages Spoken */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Languages Spoken <span className="text-red-500">*</span>
                </Label>
                <LanguageInput
                  value={formik.values.languageSpoken}
                  onChange={(languages) =>
                    formik.setFieldValue("languageSpoken", languages)
                  }
                  error={
                    formik.touched.languageSpoken && formik.errors.languageSpoken
                      ? typeof formik.errors.languageSpoken === "string"
                        ? formik.errors.languageSpoken
                        : "At least one language is required"
                      : undefined
                  }
                />
                <p className="text-xs text-gray-500">
                  Select languages you can speak fluently
                </p>
              </div>

              <Separator />

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  maxLength={10}
                  className={
                    formik.touched.phone && formik.errors.phone
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="text-red-500 text-xs">{formik.errors.phone}</p>
                )}
              </div>

              {/* Alternate Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="alternatePhone"
                  className="text-sm font-medium text-gray-700"
                >
                  Alternate Phone Number
                </Label>
                <Input
                  id="alternatePhone"
                  name="alternatePhone"
                  type="tel"
                  placeholder="Enter 10-digit alternate phone number (optional)"
                  value={formik.values.alternatePhone || ""}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "alternatePhone",
                      e.target.value || null
                    )
                  }
                  onBlur={formik.handleBlur}
                  maxLength={10}
                  className={
                    formik.touched.alternatePhone &&
                    formik.errors.alternatePhone
                      ? "border-red-500"
                      : ""
                  }
                />
                {formik.touched.alternatePhone &&
                  formik.errors.alternatePhone && (
                    <p className="text-red-500 text-xs">
                      {formik.errors.alternatePhone}
                    </p>
                  )}
                {formik.values.alternatePhone &&
                  formik.values.phone === formik.values.alternatePhone && (
                    <p className="text-yellow-600 text-xs">
                      Alternate phone must be different from primary phone
                    </p>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full sm:w-auto"
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-[#2CA4BC] hover:bg-[#2CA4BC]/90 text-white"
                  disabled={isPending || !formik.isValid}
                >
                  {isPending ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

