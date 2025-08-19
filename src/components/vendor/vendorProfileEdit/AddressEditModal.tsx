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
import { useFormik } from "formik"
import * as Yup from "yup"

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

// Validation Schema for Address Data
const addressValidationSchema = Yup.object({
  address: Yup.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .required('Address is required'),
  street: Yup.string()
    .min(2, 'Street must be at least 2 characters')
    .max(100, 'Street must be less than 100 characters')
    .required('Street is required'),
  city: Yup.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .required('City is required'),
  state: Yup.string()
    .min(2, 'State must be at least 2 characters')
    .max(50, 'State must be less than 50 characters')
    .required('State is required'),
  pincode: Yup.string()
    .matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits')
    .required('Pincode is required'),
  country: Yup.string()
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country must be less than 50 characters')
    .required('Country is required')
})

export function AddressEditModal({ currentAddress, onAddressUpdate }: AddressEditModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { mutate: updateAddress } = useUpdateVendorAddressMutation()

  // Formik for address data
  const formik = useFormik<AddressData>({
    initialValues: {
      address: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
    validationSchema: addressValidationSchema,
    onSubmit: async (values) => {
      handleSaveAddress(values)
    },
  })

  useEffect(() => {
    formik.setValues(currentAddress)
  }, [currentAddress])

  const handleSaveAddress = async (values: AddressData) => {
    setIsLoading(true)
    
    updateAddress(values, {
      onSuccess: (response) => {
        toast.success(response.message || "Address updated successfully")
        onAddressUpdate(values) // Update parent component
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
    formik.setValues(currentAddress)
    formik.setTouched({})
    setIsOpen(false)
  }

  const hasChanges = () => {
    return JSON.stringify(formik.values) !== JSON.stringify(currentAddress)
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

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Address Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-slate-700">
                  Address Line *
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter address line"
                  className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                    formik.touched.address && formik.errors.address
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                />
                {formik.touched.address && formik.errors.address && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="street" className="text-sm font-medium text-slate-700">
                  Street *
                </Label>
                <Input
                  id="street"
                  name="street"
                  value={formik.values.street}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter street"
                  className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                    formik.touched.street && formik.errors.street
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                />
                {formik.touched.street && formik.errors.street && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.street}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-slate-700">
                  City *
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formik.values.city}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter city"
                  className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                    formik.touched.city && formik.errors.city
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                />
                {formik.touched.city && formik.errors.city && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-slate-700">
                  State *
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter state"
                  className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                    formik.touched.state && formik.errors.state
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                />
                {formik.touched.state && formik.errors.state && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.state}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-sm font-medium text-slate-700">
                  Pincode *
                </Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formik.values.pincode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter pincode"
                  className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                    formik.touched.pincode && formik.errors.pincode
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                />
                {formik.touched.pincode && formik.errors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.pincode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-medium text-slate-700">
                  Country *
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter country"
                  className={`bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
                    formik.touched.country && formik.errors.country
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                />
                {formik.touched.country && formik.errors.country && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.country}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={!formik.isValid || !hasChanges() || isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Current Address Display */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-slate-900">Address</p>
            <p className="text-slate-600">{currentAddress.address || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium text-slate-900">Street</p>
            <p className="text-slate-600">{currentAddress.street || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium text-slate-900">City, State</p>
            <p className="text-slate-600">
              {currentAddress.city || "Not provided"}, {currentAddress.state || "Not provided"}
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-900">Pincode</p>
            <p className="text-slate-600">{currentAddress.pincode || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium text-slate-900">Country</p>
            <p className="text-slate-600">{currentAddress.country || "Not provided"}</p>
          </div>
        </div>
      </div>
    </>
  )
}