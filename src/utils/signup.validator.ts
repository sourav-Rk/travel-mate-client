import * as Yup from "yup";

type UserType = "client" | "admin" | "vendor";

// Base schema with common fields
const baseSchema = {
  firstName: Yup.string()
    .matches(/^[a-zA-Z]+$/, "First name should only contain letters")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .matches(/^[a-zA-Z]+$/, "Last name should only contain letters")
    .min(1, "Last name must be at least 1 characters")
    .max(50, "Last name must not exceed 50 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Contact number is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password") as unknown as string], "Passwords must match")
    .required("Confirm Password is required"),
};

// Role-specific schemas
const clientAdminSchema = Yup.object().shape({
  ...baseSchema,
  gender: Yup.string().required("Gender is required"),
});

const vendorSchema = Yup.object().shape({
  ...baseSchema,
  agencyName: Yup.string()
    .min(2, "Agency name must be at least 2 characters")
    .max(100, "Agency name must not exceed 100 characters")
    .required("Agency name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters")
    .optional(),
});

// Function to get schema based on user type
export const getSignupSchema = (userType: UserType) => {
  switch (userType) {
    case "vendor":
      return vendorSchema;
    case "client":
    case "admin":
    default:
      return clientAdminSchema;
  }
};

// Export the original schema for backward compatibility
export const signupSchema = clientAdminSchema;