// utils/validation.ts

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