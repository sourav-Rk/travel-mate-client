import * as Yup from 'yup';

export const guideSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(1, 'Last name must be at least 1 characters')
    .required('Last name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  alternatePhone: Yup.string()
    .matches(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .nullable(),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender')
    .required('Gender is required'),
  dob: Yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .required('Date of birth is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .matches(/(?=.*\d)/, 'Password must contain at least one number')
    .required('Password is required'),
  yearOfExperience: Yup.string().required("Years of Experience is required"),
  languageSpoken: Yup.array()
    .min(1, "At least one language is required")
    .of(Yup.string().required("Language is required")),
  documents: Yup.array()
    .min(1, 'At least one document is required')
    .required('Documents are required')
});
