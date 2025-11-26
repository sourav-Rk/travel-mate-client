import * as Yup from "yup";

interface BasicDetailsForm {
  packageName: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  meetingPoint: string;
  images: File[];
  maxGroupSize: number;
  minGroupSize: number;
  price: number;
  cancellationPolicy: string;
  termsAndConditions: string;
  startDate: Date;
  endDate: Date;
  duration: {
    days: number;
    nights: number;
  };
  inclusions: string[];
  exclusions: string[];
}

interface ActivityForm {
  name: string;
  dayNumber: number;
  description?: string;
  duration?: string;
  category?: string;
  priceIncluded: boolean;
}

interface DayForm {
  dayNumber: number;
  title: string;
  description: string;
  accommodation?: string;
  transfers: string[];
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  activities: ActivityForm[];
}

interface PackageForm {
  basicDetails: BasicDetailsForm;
  itinerary: DayForm[];
}

// Basic Details validation schema
const basicDetailsSchema = Yup.object().shape({
  packageName: Yup.string()
    .required("Package name is required")
    .min(3, "Package name must be at least 3 characters")
    .max(100, "Package name must not exceed 100 characters"),

  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title must not exceed 150 characters"),

  slug: Yup.string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .min(3, "Slug must be at least 3 characters")
    .max(100, "Slug must not exceed 100 characters"),

  description: Yup.string()
    .required("Description is required")
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description must not exceed 2000 characters"),

  category: Yup.string()
    .required("Category is required")
    .oneOf(
      [
        "adventure",
        "cultural",
        "nature",
        "beach",
        "mountain",
        "wildlife",
        "heritage",
      ],
      "Please select a valid category"
    ),

  tags: Yup.array()
    .of(Yup.string().required("Tag cannot be empty"))
    .min(1, "At least one tag is required")
    .max(10, "Maximum 10 tags allowed"),

  meetingPoint: Yup.string()
    .required("Meeting point is required")
    .min(10, "Meeting point must be at least 10 characters")
    .max(200, "Meeting point must not exceed 200 characters"),

  images: Yup.array()
    .of(
      Yup.mixed()
        .test("fileSize", "Each image must be less than 10MB", (value) => {
          if (!value) return true;
          return value instanceof File ? value.size <= 10 * 1024 * 1024 : true;
        })
        .test("fileType", "Only image files are allowed", (value) => {
          if (!value) return true;
          return value instanceof File ? value.type.startsWith("image/") : true;
        })
    )
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),

  maxGroupSize: Yup.number()
    .required("Maximum group size is required")
    .min(10, "Group size must be at least 10")
    .max(50, "Group size cannot exceed 50")
    .integer("Group size must be a whole number"),
  minGroupSize: Yup.number()
    .required("Minimum group size is required")
    .min(10, "Group size must be at least 10")
    .max(50, "Group size cannot exceed 50")
    .integer("Group size must be a whole number"),

  price: Yup.number()
    .required("Price is required")
    .min(500, "Price must be greater than 500")
    .max(1000000, "Price cannot exceed ₹10,00,000"),

  cancellationPolicy: Yup.string()
    .required("Cancellation policy is required")
    .min(20, "Cancellation policy must be at least 20 characters")
    .max(1000, "Cancellation policy must not exceed 1000 characters"),

  termsAndConditions: Yup.string()
    .required("Terms and conditions are required")
    .min(50, "Terms and conditions must be at least 50 characters")
    .max(2000, "Terms and conditions must not exceed 2000 characters"),

  startDate: Yup.date()
    .required("Start date is required")
    .min(new Date(), "Start date cannot be in the past"),

  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date")
    .test(
      "maxDuration",
      "Package duration cannot exceed 30 days",
      function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        const diffTime = Math.abs(value.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      }
    ),

  duration: Yup.object().shape({
    days: Yup.number()
      .required("Duration days is required")
      .min(1, "Duration must be at least 1 day")
      .max(30, "Duration cannot exceed 30 days"),
    nights: Yup.number()
      .required("Duration nights is required")
      .min(0, "Nights cannot be negative")
      .max(29, "Nights cannot exceed 29"),
  }),

  inclusions: Yup.array()
    .of(Yup.string().required("Inclusion cannot be empty"))
    .min(1, "At least one inclusion is required")
    .max(20, "Maximum 20 inclusions allowed"),

  exclusions: Yup.array()
    .of(Yup.string().required("Exclusion cannot be empty"))
    .max(20, "Maximum 20 exclusions allowed"),
});

// Activity validation schema
const activitySchema = Yup.object().shape({
  name: Yup.string()
    .required("Activity name is required")
    .min(3, "Activity name must be at least 3 characters")
    .max(100, "Activity name must not exceed 100 characters"),

  dayNumber: Yup.number()
    .required("Day number is required")
    .min(1, "Day number must be at least 1")
    .integer("Day number must be a whole number"),

  description: Yup.string().max(
    500,
    "Activity description must not exceed 500 characters"
  ),

  duration: Yup.string().max(50, "Duration must not exceed 50 characters"),

  category: Yup.string().oneOf(
    [
      "sightseeing",
      "adventure",
      "cultural",
      "nature",
      "water-sports",
      "food",
      "shopping",
      "relaxation",
    ],
    "Please select a valid activity category"
  ),

  priceIncluded: Yup.boolean().required("Price inclusion status is required"),
});

// Day validation schema
const daySchema = Yup.object().shape({
  dayNumber: Yup.number()
    .required("Day number is required")
    .min(1, "Day number must be at least 1")
    .integer("Day number must be a whole number"),

  title: Yup.string()
    .required("Day title is required")
    .min(5, "Day title must be at least 5 characters")
    .max(100, "Day title must not exceed 100 characters"),

  description: Yup.string()
    .required("Day description is required")
    .min(20, "Day description must be at least 20 characters")
    .max(1000, "Day description must not exceed 1000 characters"),

  accommodation: Yup.string().max(
    200,
    "Accommodation details must not exceed 200 characters"
  ),

  transfers: Yup.array()
    .of(Yup.string().required("Transfer cannot be empty"))
    .max(10, "Maximum 10 transfers allowed per day"),

  meals: Yup.object().shape({
    breakfast: Yup.boolean().required("Breakfast selection is required"),
    lunch: Yup.boolean().required("Lunch selection is required"),
    dinner: Yup.boolean().required("Dinner selection is required"),
  }),

  activities: Yup.array()
    .of(activitySchema)
    .max(10, "Maximum 10 activities allowed per day"),
});

// Itinerary validation schema
const itinerarySchema = Yup.array()
  .of(daySchema)
  .min(1, "At least one day is required in the itinerary")
  .max(30, "Maximum 30 days allowed in the itinerary")
  .test(
    "consecutive-days",
    "Day numbers must be consecutive starting from 1",
    function (value) {
      if (!value || value.length === 0) return true;

      const dayNumbers = value
        .map((day) => day.dayNumber)
        .sort((a, b) => a - b);

      for (let i = 0; i < dayNumbers.length; i++) {
        if (dayNumbers[i] !== i + 1) {
          return this.createError({
            message: `Day ${
              i + 1
            } is missing or day numbers are not consecutive`,
            path: `itinerary[${i}].dayNumber`,
          });
        }
      }

      return true;
    }
  );

// Main package form validation schema
export const packageFormSchema = Yup.object().shape({
  basicDetails: basicDetailsSchema,
  itinerary: itinerarySchema,
});

// Individual step validation schemas for step-by-step validation
export const stepValidationSchemas = {
  0: Yup.object().shape({
    basicDetails: basicDetailsSchema,
  }),
  1: Yup.object().shape({
    itinerary: itinerarySchema,
  }),
  2: Yup.object().shape({
    basicDetails: basicDetailsSchema,
    itinerary: itinerarySchema,
  }),
};

// Validation helper functions
export const validateStep = async (stepIndex: number, values: PackageForm) => {
  try {
    const schema =
      stepValidationSchemas[stepIndex as keyof typeof stepValidationSchemas];
    await schema.validate(values, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: "Validation failed" } };
  }
};

// Custom validation messages
export const validationMessages = {
  required: "This field is required",
  email: "Please enter a valid email address",
  min: (min: number) => `Must be at least ${min} characters`,
  max: (max: number) => `Must not exceed ${max} characters`,
  number: "Must be a valid number",
  positive: "Must be a positive number",
  integer: "Must be a whole number",
  date: "Please select a valid date",
  futureDate: "Date must be in the future",
  fileSize: "File size must be less than 10MB",
  fileType: "Only image files are allowed",
  url: "Please enter a valid URL",
  phone: "Please enter a valid phone number",
};

// Field-specific validation rules
export const fieldValidationRules = {
  packageName: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-&'.,()]+$/,
    patternMessage: "Package name contains invalid characters",
  },
  slug: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-z0-9-]+$/,
    patternMessage:
      "Slug can only contain lowercase letters, numbers, and hyphens",
  },
  price: {
    min: 1,
    max: 1000000,
    step: 1,
  },
  maxGroupSize: {
    min: 1,
    max: 50,
    step: 1,
  },
  duration: {
    minDays: 1,
    maxDays: 30,
    maxNights: 29,
  },
  images: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    maxCount: 10,
    minCount: 1,
  },
  tags: {
    maxCount: 10,
    minCount: 1,
    maxLength: 50,
  },
  inclusions: {
    maxCount: 20,
    minCount: 1,
    maxLength: 200,
  },
  exclusions: {
    maxCount: 20,
    maxLength: 200,
  },
  activities: {
    maxPerDay: 10,
    nameMaxLength: 100,
    descriptionMaxLength: 500,
  },
  transfers: {
    maxPerDay: 10,
    maxLength: 200,
  },
};

// Validation utility functions
export const validateImageFile = (
  file: File
): { isValid: boolean; error?: string } => {
  const { maxSize, allowedTypes } = fieldValidationRules.images;

  if (file.size > maxSize) {
    return { isValid: false, error: "File size must be less than 10MB" };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Only image files (JPEG, PNG, GIF, WebP) are allowed",
    };
  }

  return { isValid: true };
};

export const validateDateRange = (
  startDate: Date,
  endDate: Date
): { isValid: boolean; error?: string } => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (startDate < now) {
    return { isValid: false, error: "Start date cannot be in the past" };
  }

  if (endDate <= startDate) {
    return { isValid: false, error: "End date must be after start date" };
  }

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > fieldValidationRules.duration.maxDays) {
    return {
      isValid: false,
      error: `Package duration cannot exceed ${fieldValidationRules.duration.maxDays} days`,
    };
  }

  return { isValid: true };
};

export const validateSlug = (
  slug: string
): { isValid: boolean; error?: string } => {
  const { pattern, patternMessage, minLength, maxLength } =
    fieldValidationRules.slug;

  if (slug.length < minLength) {
    return {
      isValid: false,
      error: `Slug must be at least ${minLength} characters`,
    };
  }

  if (slug.length > maxLength) {
    return {
      isValid: false,
      error: `Slug must not exceed ${maxLength} characters`,
    };
  }

  if (!pattern.test(slug)) {
    return { isValid: false, error: patternMessage };
  }

  return { isValid: true };
};

// Generate slug from package name
export const generateSlug = (packageName: string): string => {
  return packageName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
};

// Calculate duration from dates
export const calculateDuration = (
  startDate: Date,
  endDate: Date
): { days: number; nights: number } => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const nights = Math.max(0, days - 1);

  return { days, nights };
};

// Validation error formatter
export const formatValidationError = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error && error?.message) {
    return error.message;
  }

  return "Validation error occurred";
};

// Form errors and touched fields types
interface FormErrors {
  basicDetails?: Record<string, string>;
  itinerary?: Record<string, string>[] | Record<string, string>;
}

interface FormTouched {
  basicDetails?: Record<string, boolean>;
  itinerary?: Record<string, boolean>[] | Record<string, boolean>;
}

// Check if form step is valid
export const isStepValid = (
  stepIndex: number,
  errors: FormErrors,
  touched: FormTouched
): boolean => {
  const stepFields = {
    0: ["basicDetails"],
    1: ["itinerary"],
    2: ["basicDetails", "itinerary"],
  };

  const fieldsToCheck = stepFields[stepIndex as keyof typeof stepFields] || [];

  return fieldsToCheck.every((field) => {
    const fieldErrors = errors[field as keyof FormErrors];
    const fieldTouched = touched[field as keyof FormTouched];

    if (!fieldTouched) return true;

    if (typeof fieldErrors === "object" && fieldErrors !== null) {
      return Object.keys(fieldErrors).length === 0;
    }

    return !fieldErrors;
  });
};
