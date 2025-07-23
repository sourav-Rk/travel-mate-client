import * as Yup from 'yup';

export const clientProfileSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .matches(/^[A-Za-z]+$/, 'First name must contain only letters')
    .min(2, 'First name must be at least 2 characters')
    .required('First name is required'),

  lastName: Yup.string()
    .trim()
    .matches(/^[A-Za-z]+$/, 'Last name must contain only letters')
    .min(1, 'Last name must be at least 1 character')
    .required('Last name is required'),

  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),

  phone: Yup.string()
    .matches(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),

  gender: Yup.string()
    .oneOf(['male', 'female', 'other'], 'Please select a valid gender')
    .required('Gender is required'),
});

