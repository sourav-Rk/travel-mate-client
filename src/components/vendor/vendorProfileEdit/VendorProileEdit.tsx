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

  const [formData, setFormData] = useState<VendorEditData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    description:"",
    profileImage: "",
  })

  const [addressData, setAddressData] = useState<AddressData>({
    address : "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
  if (data?.vendor) {
    const vendor = data.vendor;

    setFormData({
      firstName: vendor.firstName || "",
      lastName: vendor.lastName || "",
      phone: vendor.phone || "",
      email: vendor.email || "",
      description: vendor.description || "",
      profileImage: vendor.profileImage || "", 
    });

    setAddressData({
      address : vendor?.address.address || "" ,
      street: vendor.address?.street || "",
      city: vendor.address?.city || "",
      state: vendor.address?.state || "",
      pincode: vendor.address?.pincode || "",
      country: vendor.address?.country || "",
    });
  }
}, [data]);


  const [isLoading, setIsLoading] = useState(false)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (field: keyof VendorEditData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

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
    setFormData((prev) => ({ ...prev, email: newEmail }))
  }

  const handleAddressUpdate = (newAddress: AddressData) => {
    setAddressData(newAddress)
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try{
       let uploadedImageUrl = formData.profileImage;

       if(profileImageFile){
         const urls = await uploadImages([profileImageFile]);
         uploadedImageUrl = urls[0]?.url || uploadedImageUrl;
       }

       const updatedData = {
        ...formData,
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
                    <AvatarImage src={profileImagePreview || formData.profileImage} alt="Profile Preview" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl md:text-2xl font-bold">
                      {formData.firstName[0]}
                      {formData.lastName[0]}
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
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 shadow-md">
                    <Upload className="h-3 w-3 text-white" />
                  </div>
                </div>

                {/* Basic Info Preview */}
                <div className="text-center lg:text-left flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-slate-600 mb-4">{formData.email}</p>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                    <Edit3 className="h-3 w-3 mr-1" />
                    Editing Mode
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                      Email Address
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        value={formData.email}
                        readOnly
                        className="bg-slate-50 border-slate-300 text-slate-600"
                      />
                      <EmailVerificationModal currentEmail={formData.email} onEmailChange={handleEmailChange} />
                    </div>
                    <p className="text-xs text-slate-500">Click the shield icon to change email</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Business Description */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Business Description
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-slate-700">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px] resize-none"
                    placeholder="Describe your business and services..."
                  />
                  <p className="text-xs text-slate-500">{formData.description.length}/500 characters</p>
                </div>
              </div>

              <Separator />

              {/* Address Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Address Information
                  </h3>
                </div>

                <AddressEditModal currentAddress={addressData} onAddressUpdate={handleAddressUpdate} />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Important Notes:</p>
                    <ul className="text-blue-800 space-y-1 list-disc list-inside">
                      <li>Email changes require OTP verification</li>
                      <li>Address changes are processed separately</li>
                      <li>Profile image should be less than 5MB</li>
                      <li>Changes may take a few minutes to reflect</li>
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
