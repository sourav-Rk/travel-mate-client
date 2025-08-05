// "use client"

// import { useState } from "react"
// import { MapPin, Edit3, Save } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { useUpdateVendorAddressMutation } from "@/hooks/vendor/useAddVendorAdress"

// interface AddressData {
//   street: string
//   city: string
//   state: string
//   pincode: string
//   country: string
// }

// interface AddressEditModalProps {
//   currentAddress: AddressData
//   onAddressUpdate: (newAddress: AddressData) => void
// }

// export function AddressEditModal({ currentAddress, onAddressUpdate }: AddressEditModalProps) {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [addressData, setAddressData] = useState<AddressData>(currentAddress);
//   const {mutate : updateAddress} = useUpdateVendorAddressMutation();

//   const handleAddressChange = (field: keyof AddressData, value: string) => {
//     setAddressData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleSaveAddress = async () => {
//     setIsLoading(true)
//     try {
//       // Simulate separate API call for address
//       await new Promise((resolve) => setTimeout(resolve, 1500))

//       // Update parent component with new address
//       onAddressUpdate(addressData)

//       // Close modal
//       setIsOpen(false)
//     } catch (error) {
//       console.error("Error saving address:", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleCancel = () => {
//     // Reset to original address data
//     setAddressData(currentAddress)
//     setIsOpen(false)
//   }

//   const isFormValid = () => {
//     return (
//       addressData.street.trim() !== "" &&
//       addressData.city.trim() !== "" &&
//       addressData.state.trim() !== "" &&
//       addressData.pincode.trim() !== "" &&
//       addressData.country.trim() !== ""
//     )
//   }

//   const hasChanges = () => {
//     return JSON.stringify(addressData) !== JSON.stringify(currentAddress)
//   }

//   return (
//     <>
//       {/* Trigger Button */}
//       <Dialog open={isOpen} onOpenChange={setIsOpen}>
//         <DialogTrigger asChild>
//           <Button variant="outline" size="sm" className="bg-transparent">
//             <Edit3 className="h-4 w-4 mr-2" />
//             Edit Address
//           </Button>
//         </DialogTrigger>

//         <DialogContent className="sm:max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="flex items-center gap-2">
//               <MapPin className="h-5 w-5 text-blue-600" />
//               Edit Address
//             </DialogTitle>
//             <DialogDescription>
//               Update your business address information. This will be processed separately.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-6">
//             {/* Address Form */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2 space-y-2">
//                 <Label htmlFor="street" className="text-sm font-medium text-slate-700">
//                   Street Address *
//                 </Label>
//                 <Input
//                   id="street"
//                   value={addressData.street}
//                   onChange={(e) => handleAddressChange("street", e.target.value)}
//                   placeholder="Enter street address"
//                   className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="city" className="text-sm font-medium text-slate-700">
//                   City *
//                 </Label>
//                 <Input
//                   id="city"
//                   value={addressData.city}
//                   onChange={(e) => handleAddressChange("city", e.target.value)}
//                   placeholder="Enter city"
//                   className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="state" className="text-sm font-medium text-slate-700">
//                   State *
//                 </Label>
//                 <Input
//                   id="state"
//                   value={addressData.state}
//                   onChange={(e) => handleAddressChange("state", e.target.value)}
//                   placeholder="Enter state"
//                   className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="pincode" className="text-sm font-medium text-slate-700">
//                   Pincode *
//                 </Label>
//                 <Input
//                   id="pincode"
//                   value={addressData.pincode}
//                   onChange={(e) => handleAddressChange("pincode", e.target.value)}
//                   placeholder="Enter pincode"
//                   className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="country" className="text-sm font-medium text-slate-700">
//                   Country *
//                 </Label>
//                 <Input
//                   id="country"
//                   value={addressData.country}
//                   onChange={(e) => handleAddressChange("country", e.target.value)}
//                   placeholder="Enter country"
//                   className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Form Status */}
//             {hasChanges() && (
//               <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
//                 <p className="text-sm text-amber-800">
//                   <span className="font-medium">Unsaved changes detected.</span> Your address changes will be processed
//                   separately from other profile updates.
//                 </p>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 pt-4">
//               <Button
//                 onClick={handleSaveAddress}
//                 disabled={!isFormValid() || !hasChanges() || isLoading}
//                 className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
//               >
//                 {isLoading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Saving Address...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-4 w-4 mr-2" />
//                     Save Address
//                   </>
//                 )}
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={handleCancel}
//                 disabled={isLoading}
//                 className="flex-1 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 bg-transparent"
//               >
//                 Cancel
//               </Button>
//             </div>

//             {/* Help Text */}
//             <div className="text-xs text-slate-500 text-center">
//               * Required fields. Address changes require separate verification and may take longer to process.
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Current Address Display */}
//       <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mt-4">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <p className="font-medium text-slate-900">Street Address</p>
//             <p className="text-slate-600">{currentAddress.street}</p>
//           </div>
//           <div>
//             <p className="font-medium text-slate-900">City, State</p>
//             <p className="text-slate-600">
//               {currentAddress.city}, {currentAddress.state}
//             </p>
//           </div>
//           <div>
//             <p className="font-medium text-slate-900">Pincode</p>
//             <p className="text-slate-600">{currentAddress.pincode}</p>
//           </div>
//           <div>
//             <p className="font-medium text-slate-900">Country</p>
//             <p className="text-slate-600">{currentAddress.country}</p>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }


"use client"

import { useEffect, useState } from "react"
import { MapPin, Edit3, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useUpdateVendorAddressMutation } from "@/hooks/vendor/useAddVendorAdress"
import toast from "react-hot-toast"

interface AddressData {
  address: string
  street: string
  city: string
  state: string
  pincode: string
  country: string
}

interface AddressEditModalProps {
  currentAddress: AddressData
  onAddressUpdate: (newAddress: AddressData) => void
}

export function AddressEditModal({ currentAddress, onAddressUpdate }: AddressEditModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [addressData, setAddressData] = useState<AddressData>(currentAddress)
  const { mutate: updateAddress } = useUpdateVendorAddressMutation();

  useEffect(() => {
    setAddressData(currentAddress)
  }, [currentAddress])

  const handleAddressChange = (field: keyof AddressData, value: string) => {
    setAddressData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveAddress = async () => {
    if (!isFormValid()) return
    
    setIsLoading(true)
    
    updateAddress(addressData, {
      onSuccess: (response) => {
        toast.success(response.message || "Address updated successfully")
        onAddressUpdate(addressData) // Update parent component
        setIsOpen(false)
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to update address")
      },
      onSettled: () => {
        setIsLoading(false)
      }
    })
  }

  const handleCancel = () => {
    // Reset to original address data
    setAddressData(currentAddress)
    setIsOpen(false)
  }

  const isFormValid = () => {
    return (
      addressData.street.trim() !== "" &&
      addressData.city.trim() !== "" &&
      addressData.state.trim() !== "" &&
      addressData.pincode.trim() !== "" &&
      addressData.country.trim() !== ""
    )
  }

  const hasChanges = () => {
    return JSON.stringify(addressData) !== JSON.stringify(currentAddress)
  }

  return (
    <>
      {/* Trigger Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Address
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Edit Address
            </DialogTitle>
            <DialogDescription>
              Update your business address information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Address Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                  Address Line *
                </Label>
                <Input
                  id="address"
                  value={addressData.address}
                  onChange={(e) => handleAddressChange("address", e.target.value)}
                  placeholder="Enter address line"
                  className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="street" className="text-sm font-medium text-slate-700">
                  Street *
                </Label>
                <Input
                  id="street"
                  value={addressData.street}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                  placeholder="Enter street"
                  className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-slate-700">
                  City *
                </Label>
                <Input
                  id="city"
                  value={addressData.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="Enter city"
                  className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-slate-700">
                  State *
                </Label>
                <Input
                  id="state"
                  value={addressData.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  placeholder="Enter state"
                  className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-sm font-medium text-slate-700">
                  Pincode *
                </Label>
                <Input
                  id="pincode"
                  value={addressData.pincode}
                  onChange={(e) => handleAddressChange("pincode", e.target.value)}
                  placeholder="Enter pincode"
                  className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium text-slate-700">
                  Country *
                </Label>
                <Input
                  id="country"
                  value={addressData.country}
                  onChange={(e) => handleAddressChange("country", e.target.value)}
                  placeholder="Enter country"
                  className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleSaveAddress}
                disabled={!isFormValid() || !hasChanges() || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving Address...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Address
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Current Address Display */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-slate-900">Address</p>
            <p className="text-slate-600">{currentAddress.address}</p>
          </div>
          <div>
            <p className="font-medium text-slate-900">Street</p>
            <p className="text-slate-600">{currentAddress.street}</p>
          </div>
          <div>
            <p className="font-medium text-slate-900">City, State</p>
            <p className="text-slate-600">
              {currentAddress.city}, {currentAddress.state}
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-900">Pincode</p>
            <p className="text-slate-600">{currentAddress.pincode}</p>
          </div>
          <div>
            <p className="font-medium text-slate-900">Country</p>
            <p className="text-slate-600">{currentAddress.country}</p>
          </div>
        </div>
      </div>
    </>
  )
}