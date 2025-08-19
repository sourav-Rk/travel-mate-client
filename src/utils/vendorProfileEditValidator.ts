// utils/validation.ts
import * as Yup from "yup";

export interface ValidationErrors {
  firstName?: string
  lastName?: string
  phone?: string
  description?: string
}

export interface VendorFormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  description: string
  profileImage: string
}

export const validateFirstName = (value: string): string | undefined => {
  if (!value.trim()) return "First name is required"
  if (!/^[A-Za-z\s]+$/.test(value)) return "Only letters allowed"
  if (value.trim().length < 2) return "Minimum 2 characters required"
  return undefined
}

export const validateLastName = (value: string): string | undefined => {
  if (!value.trim()) return "Last name is required"
  if (!/^[A-Za-z\s]+$/.test(value)) return "Only letters allowed"
  if (value.trim().length < 2) return "Minimum 2 characters required"
  return undefined
}

export const validatePhone = (value: string): string | undefined => {
  if (!value.trim()) return "Phone number is required"
  if (!/^\d+$/.test(value)) return "Only numbers allowed"
  if (value.length !== 10) return "Must be exactly 10 digits"
  return undefined
}

export const validateDescription = (value: string): string | undefined => {
  if (!value.trim()) return "Description is required"
  if (value.trim().length < 10) return "Minimum 10 characters required"
  return undefined
}

export const validateField = (field: keyof VendorFormData, value: string): string | undefined => {
  switch (field) {
    case 'firstName':
      return validateFirstName(value)
    case 'lastName':
      return validateLastName(value)
    case 'phone':
      return validatePhone(value)
    case 'description':
      return validateDescription(value)
    default:
      return undefined
  }
}

export const validateAllFields = (formData: VendorFormData): ValidationErrors => {
  return {
    firstName: validateFirstName(formData.firstName),
    lastName: validateLastName(formData.lastName),
    phone: validatePhone(formData.phone),
    description: validateDescription(formData.description),
  }
}

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.values(errors).some(error => error !== undefined)
}

export const filterInput = (field: keyof VendorFormData, value: string): string => {
  switch (field) {
    case 'firstName':
    case 'lastName':
      return value.replace(/[^A-Za-z\s]/g, '')
    case 'phone':
      return value.replace(/\D/g, '').slice(0, 10)
    default:
      return value
  }
}



export const vendorValidationSchema = Yup.object({
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, 'First name must contain only letters')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),

  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, 'Last name must contain only letters')
    .min(1, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),

  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .required('Business description is required'),

  profileImage: Yup.string()
});

// Validation Schema for Address Data
// Validation Schema for Address Data
export const addressValidationSchema = Yup.object({
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