// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ArrowRight } from "lucide-react"

// interface AddressData {
//   street: string
//   city: string
//   address: string
//   state: string
//   pincode: string
//   country: string
// }

// interface AddressSignupProps {
//   onNext: (data: AddressData) => void
//   initialData?: AddressData
// }

// const INDIAN_STATES = [
//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chhattisgarh",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
// ]

// const COUNTRIES = [
//   "India",
//   "United States",
//   "United Kingdom",
//   "Canada",
//   "Australia",
//   "Germany",
//   "France",
//   "Japan",
//   "Singapore",
//   "UAE",
// ]

// export default function AddressSignup({ onNext, initialData }: AddressSignupProps) {
//   const [formData, setFormData] = useState<AddressData>(
//     initialData || {
//       street: "",
//       city: "",
//       address: "",
//       state: "",
//       pincode: "",
//       country: "India",
//     },
//   )

//   const [errors, setErrors] = useState<Partial<AddressData>>({})

//   const validateForm = (): boolean => {
//     const newErrors: Partial<AddressData> = {}

//     if (!formData.street.trim()) newErrors.street = "Street is required"
//     if (!formData.city.trim()) newErrors.city = "City is required"
//     if (!formData.address.trim()) newErrors.address = "Address is required"
//     if (!formData.state) newErrors.state = "State is required"
//     if (!formData.pincode.trim()) {
//       newErrors.pincode = "Pincode is required"
//     } else if (!/^\d{6}$/.test(formData.pincode)) {
//       newErrors.pincode = "Pincode must be 6 digits"
//     }
//     if (!formData.country) newErrors.country = "Country is required"

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (validateForm()) {
//       onNext(formData)
//     }
//   }

//   const updateField = (field: keyof AddressData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: undefined }))
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Address Information</h1>
//           <p className="text-gray-600 mt-2">Step 2 of 3 - Provide your business address details</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Business Address</CardTitle>
//             <CardDescription>Please provide accurate address information for your business location</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="street">Street *</Label>
//                   <Input
//                     id="street"
//                     value={formData.street}
//                     onChange={(e) => updateField("street", e.target.value)}
//                     placeholder="Enter street name"
//                     className={errors.street ? "border-red-500" : ""}
//                   />
//                   {errors.street && <p className="text-sm text-red-500">{errors.street}</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="city">City *</Label>
//                   <Input
//                     id="city"
//                     value={formData.city}
//                     onChange={(e) => updateField("city", e.target.value)}
//                     placeholder="Enter city"
//                     className={errors.city ? "border-red-500" : ""}
//                   />
//                   {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="address">Full Address *</Label>
//                 <Input
//                   id="address"
//                   value={formData.address}
//                   onChange={(e) => updateField("address", e.target.value)}
//                   placeholder="Enter complete address with landmarks"
//                   className={errors.address ? "border-red-500" : ""}
//                 />
//                 {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="state">State *</Label>
//                   <Select value={formData.state} onValueChange={(value) => updateField("state", value)}>
//                     <SelectTrigger className={errors.state ? "border-red-500" : ""}>
//                       <SelectValue placeholder="Select state" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {INDIAN_STATES.map((state) => (
//                         <SelectItem key={state} value={state}>
//                           {state}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="pincode">Pincode *</Label>
//                   <Input
//                     id="pincode"
//                     value={formData.pincode}
//                     onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
//                     placeholder="Enter 6-digit pincode"
//                     maxLength={6}
//                     className={errors.pincode ? "border-red-500" : ""}
//                   />
//                   {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="country">Country *</Label>
//                 <Select value={formData.country} onValueChange={(value) => updateField("country", value)}>
//                   <SelectTrigger className={errors.country ? "border-red-500" : ""}>
//                     <SelectValue placeholder="Select country" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {COUNTRIES.map((country) => (
//                       <SelectItem key={country} value={country}>
//                         {country}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
//               </div>

//               <div className="flex justify-end pt-6">
//                 <Button type="submit" className="flex items-center gap-2 px-8">
//                   Next Step
//                   <ArrowRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, MapPin, Building } from "lucide-react"

interface AddressData {
  street: string
  city: string
  address: string
  state: string
  pincode: string
  country: string
}

interface AddressSignupProps {
  onNext: (data: AddressData) => void
  initialData?: AddressData
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "UAE",
]

export default function AddressSignup({ onNext, initialData }: AddressSignupProps) {
  const [formData, setFormData] = useState<AddressData>(
    initialData || {
      street: "",
      city: "",
      address: "",
      state: "",
      pincode: "",
      country: "India",
    },
  )

  const [errors, setErrors] = useState<Partial<AddressData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressData> = {}

    if (!formData.street.trim()) newErrors.street = "Street is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.state) newErrors.state = "State is required"
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required"
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits"
    }
    if (!formData.country) newErrors.country = "Country is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext(formData)
    }
  }

  const updateField = (field: keyof AddressData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Address Information
          </h1>
          <p className="text-gray-600 text-lg">Step 2 of 3 - Provide your business address details</p>
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
              <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
              <div className="w-8 h-1 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-2xl font-bold text-gray-800">Business Address</CardTitle>
            </div>
            <CardDescription className="text-gray-600 text-base">
              Please provide accurate address information for your business location
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="street" className="text-sm font-medium text-gray-700">Street *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => updateField("street", e.target.value)}
                    placeholder="Enter street name"
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      errors.street ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.street && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.street}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="Enter city"
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      errors.city ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Full Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Enter complete address with landmarks"
                  className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    errors.address ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">State *</Label>
                  <Select value={formData.state} onValueChange={(value) => updateField("state", value)}>
                    <SelectTrigger className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      errors.state ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {INDIAN_STATES.map((state) => (
                        <SelectItem key={state} value={state} className="hover:bg-blue-50 focus:bg-blue-50">
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.state}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6-digit pincode"
                    maxLength={6}
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      errors.pincode ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.pincode && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium text-gray-700">Country *</Label>
                <Select value={formData.country} onValueChange={(value) => updateField("country", value)}>
                  <SelectTrigger className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    errors.country ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                  }`}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country} className="hover:bg-blue-50 focus:bg-blue-50">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.country}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-8">
                <Button 
                  type="submit" 
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}