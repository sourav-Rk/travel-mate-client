"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { User, FileText, Camera, MapPin, Save, X, Upload, ArrowLeft, Edit3, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { EmailVerificationModal } from "./EmailVerificationModal"
import { AddressEditModal } from "./AddressEditModal"
import { useVendorDetailsQuery, useVendorUpdateDetailsMutation } from "@/hooks/vendor/useVendorProfile"
import { useUploadImagesMutation } from "@/hooks/common/useUploadImages"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import { vendorValidationSchema } from "@/utils/vendorProfileEditValidator";
import { addressValidationSchema } from "@/utils/vendorProfileEditValidator"

interface VendorEditData {
  firstName: string
  lastName: string
  phone: string
  email: string
  description: string
  profileImage: string
}

interface AddressData {
  address : string
  street: string
  city: string
  state: string
  pincode: string
  country: string
}

export function VendorProfileEdit() {
  const {data} = useVendorDetailsQuery();
  const {mutate : updateDetails} = useVendorUpdateDetailsMutation();
  const {mutateAsync : uploadImages} = useUploadImagesMutation();

  const navigate = useNavigate();

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Formik for vendor form data
  const vendorFormik = useFormik<VendorEditData>({
    initialValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      description:"",
      profileImage: "",
    },
    validationSchema: vendorValidationSchema,
    onSubmit: async () => {
      handleSaveProfile();
    },
  });

  // Formik for address data
  const addressFormik = useFormik<AddressData>({
    initialValues: {
      address : "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
    validationSchema: addressValidationSchema,
    onSubmit: () => {
    },
  });

  useEffect(() => {
    if (data?.vendor) {
      const vendor = data.vendor;

      vendorFormik.setValues({
        firstName: vendor.firstName || "",
        lastName: vendor.lastName || "",
        phone: vendor.phone || "",
        email: vendor.email || "",
        description: vendor.description || "",
        profileImage: vendor.profileImage || "", 
      });

      addressFormik.setValues({
        address : vendor?.address.address || "" ,
        street: vendor.address?.street || "",
        city: vendor.address?.city || "",
        state: vendor.address?.state || "",
        pincode: vendor.address?.pincode || "",
        country: vendor.address?.country || "",
      });
    }
  }, [data]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfileImageFile(file); 
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfileImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEmailChange = (newEmail: string) => {
    vendorFormik.setFieldValue('email', newEmail);
  }

  const handleAddressUpdate = (newAddress: AddressData) => {
    addressFormik.setValues(newAddress);
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try{
       let uploadedImageUrl = vendorFormik.values.profileImage;

       if(profileImageFile){
         const urls = await uploadImages([profileImageFile]);
         uploadedImageUrl = urls[0]?.url || uploadedImageUrl;
       }

       const updatedData = {
        ...vendorFormik.values,
        profileImage : uploadedImageUrl,
       };

       updateDetails(updatedData,{
        onSuccess : (response) =>{
           toast.success(response.message);
           navigate("/vendor/profile")
        },
        onError :(error : any) =>{
          toast.error(error?.response?.data.message)
        },
        onSettled: () =>{
          setIsLoading(false);
        }
       })
    }catch(error : any){
       console.log(error);
       toast.error(error?.response?.data.message);
       setIsLoading(false);
    }
  }

  const handleCancel = () =>{
     navigate("/vendor/profile");
  }

  return (
    <div className="lg:ml-64 cursor-pointer">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-6 lg:p-8 pt-16 lg:pt-4">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" className="p-2">
              <ArrowLeft onClick={() => navigate("/vendor/profile")} className="h-4 w-4 cursor-pointer" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Edit Profile
              </h1>
              <p className="text-slate-600 text-sm md:text-base">Update your vendor information</p>
            </div>
          </div>

          {/* Main Edit Form */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Profile Image Upload */}
                <div className="relative group">
                  <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-lg">
                    <AvatarImage src={profileImagePreview || vendorFormik.values.profileImage} alt="Profile Preview" />
                    <AvatarFallback className="bg-gradient-to-br bg-[#2CA4BC] text-white text-xl md:text-2xl font-bold">
                      {vendorFormik.values.firstName[0]}
                      {vendorFormik.values.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-[#2CA4BC] rounded-full p-2 shadow-md">
                    <Upload className="h-3 w-3 text-white" />
                  </div>
                </div>

                {/* Basic Info Preview */}
                <div className="text-center lg:text-left flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                    {vendorFormik.values.firstName} {vendorFormik.values.lastName}
                  </h2>
                  <p className="text-slate-600 mb-4">{vendorFormik.values.email}</p>
                  <Badge variant="secondary" className="bg-blue-100 text-[#2CA4BC] border-blue-200">
                    <Edit3 className="h-3 w-3 mr-1" />
                    Editing Mode
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 ">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#2CA4BC]" />
                  Contact Information
                </h3>
                <form onSubmit={vendorFormik.handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={vendorFormik.values.firstName}
                        onChange={vendorFormik.handleChange}
                        onBlur={vendorFormik.handleBlur}
                        className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                          vendorFormik.touched.firstName && vendorFormik.errors.firstName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                        placeholder="Enter first name"
                      />
                      {vendorFormik.touched.firstName && vendorFormik.errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">{vendorFormik.errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={vendorFormik.values.lastName}
                        onChange={vendorFormik.handleChange}
                        onBlur={vendorFormik.handleBlur}
                        className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                          vendorFormik.touched.lastName && vendorFormik.errors.lastName
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                        placeholder="Enter last name"
                      />
                      {vendorFormik.touched.lastName && vendorFormik.errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">{vendorFormik.errors.lastName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={vendorFormik.values.phone}
                        onChange={vendorFormik.handleChange}
                        onBlur={vendorFormik.handleBlur}
                        className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                          vendorFormik.touched.phone && vendorFormik.errors.phone
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                        placeholder="Enter phone number"
                      />
                      {vendorFormik.touched.phone && vendorFormik.errors.phone && (
                        <p className="text-red-500 text-xs mt-1">{vendorFormik.errors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                        Email Address
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="email"
                          name="email"
                          value={vendorFormik.values.email}
                          readOnly
                          className={`bg-slate-50 border-slate-300 text-slate-600 ${
                            vendorFormik.touched.email && vendorFormik.errors.email
                              ? 'border-red-500'
                              : ''
                          }`}
                        />
                        <EmailVerificationModal currentEmail={vendorFormik.values.email} onEmailChange={handleEmailChange} />
                      </div>
                      {vendorFormik.touched.email && vendorFormik.errors.email && (
                        <p className="text-red-500 text-xs mt-1">{vendorFormik.errors.email}</p>
                      )}
                      <p className="text-xs text-slate-500">Click the shield icon to change email</p>
                    </div>
                  </div>
                </form>
              </div>

              <Separator />

              {/* Business Description */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#2CA4BC]" />
                  Business Description
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={vendorFormik.values.description}
                    onChange={vendorFormik.handleChange}
                    onBlur={vendorFormik.handleBlur}
                    className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px] resize-none ${
                      vendorFormik.touched.description && vendorFormik.errors.description
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    placeholder="Describe your business and services..."
                  />
                  {vendorFormik.touched.description && vendorFormik.errors.description && (
                    <p className="text-red-500 text-xs mt-1">{vendorFormik.errors.description}</p>
                  )}
                  <p className="text-xs text-slate-500">{vendorFormik.values.description.length}/500 characters</p>
                </div>
              </div>

              <Separator />

              {/* Address Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#2CA4BC]" />
                    Address Information
                  </h3>
                </div>

                <AddressEditModal currentAddress={addressFormik.values} onAddressUpdate={handleAddressUpdate} />
                
                {/* Address validation errors display */}
                {Object.keys(addressFormik.errors).length > 0 && addressFormik.touched && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Address Validation Errors:</h4>
                    <ul className="text-xs text-red-600 space-y-1">
                      {Object.entries(addressFormik.errors).map(([field, error]) => (
                        <li key={field} className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          <span className="capitalize">{field}</span>: {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  onClick={() => {
                    vendorFormik.handleSubmit();
                    addressFormik.validateForm();
                  }}
                  disabled={isLoading || !vendorFormik.isValid}
                  className="flex-1 bg-gradient-to-r from-[#2CA4BC] to-[#2ea0b4] hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isLoading ? (
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
                  variant="outline"
                  className="flex-1 border-slate-300 cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 bg-transparent"
                  size="lg"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>

              {/* Info Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-[#2CA4BC] mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Important Notes:</p>
                    <ul className="text-[#2CA4BC] space-y-1 list-disc list-inside">
                      <li>Email changes require OTP verification</li>
                      <li>Address changes are processed separately</li>
                      <li>Profile image should be less than 5MB</li>
                      <li>Changes may take a few minutes to reflect</li>
                      <li>All fields are required and will be validated before saving</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}