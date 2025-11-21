import * as Yup from "yup";

export const POST_CATEGORIES = [
  "hidden-spots",
  "restaurants",
  "safety",
  "culture",
  "stays",
  "transportation",
  "shopping",
  "entertainment",
  "nature",
  "history",
  "other",
] as const;

export const POST_STATUSES = ["draft", "published", "archived", "hidden"] as const;

export const volunteerPostSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters"),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),

  content: Yup.string()
    .required("Content is required")
    .min(50, "Content must be at least 50 characters")
    .max(10000, "Content cannot exceed 10000 characters"),

  category: Yup.string()
    .oneOf(POST_CATEGORIES, "Please select a valid category")
    .required("Category is required"),

  location: Yup.object().shape({
    coordinates: Yup.array()
      .of(Yup.number().required())
      .length(2, "Coordinates must be [longitude, latitude]")
      .test(
        "valid-coordinates",
        "Valid coordinates are required",
        (value) => {
          if (!value || value.length !== 2) return false;
          const [lon, lat] = value;
          if (lon === 0 && lat === 0) return true; // Allow [0,0] initially
          return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
        }
      )
      .required("Coordinates are required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
  }),

  images: Yup.array()
    .of(Yup.string().url("Each image must be a valid URL"))
    .max(10, "Maximum 10 images allowed")
    .optional(),

  tags: Yup.array()
    .of(Yup.string().required("Tag cannot be empty"))
    .max(20, "Maximum 20 tags allowed")
    .optional(),

  offersGuideService: Yup.boolean().required(
    "Please specify if you offer guide service"
  ),

  status: Yup.string()
    .oneOf(POST_STATUSES, "Please select a valid status")
    .optional(),
});

export const updateVolunteerPostSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),

  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  content: Yup.string()
    .min(50, "Content must be at least 50 characters")
    .max(10000, "Content cannot exceed 10000 characters")
    .optional(),

  category: Yup.string()
    .oneOf(POST_CATEGORIES, "Please select a valid category")
    .optional(),

  location: Yup.object()
    .shape({
      coordinates: Yup.array()
        .of(Yup.number().required())
        .length(2, "Coordinates must be [longitude, latitude]")
        .test(
          "valid-coordinates",
          "Valid coordinates are required",
          (value) => {
            if (!value || value.length !== 2) return false;
            const [lon, lat] = value;
            if (lon === 0 && lat === 0) return true;
            return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
          }
        )
        .required("Coordinates are required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
    })
    .optional(),

  images: Yup.array()
    .of(Yup.string().url("Each image must be a valid URL"))
    .max(10, "Maximum 10 images allowed")
    .optional(),

  tags: Yup.array()
    .of(Yup.string().required("Tag cannot be empty"))
    .max(20, "Maximum 20 tags allowed")
    .optional(),

  offersGuideService: Yup.boolean().optional(),

  status: Yup.string()
    .oneOf(POST_STATUSES, "Please select a valid status")
    .optional(),
});












