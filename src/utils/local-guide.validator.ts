import * as Yup from "yup";
import { GUIDE_SPECIALTIES } from "@/constants/local-guide.constants";

export const localGuideVerificationSchema = Yup.object().shape({
  idProof: Yup.string()
    .optional(), // Validated separately via file upload

  addressProof: Yup.string()
    .optional(), // Validated separately via file upload

  additionalDocuments: Yup.array()
    .of(Yup.string().url("Each document must be a valid URL"))
    .optional(),

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
          // Allow [0,0] initially but validate on submit
          if (lon === 0 && lat === 0) return true;
          return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
        }
      )
      .required("Coordinates are required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    country: Yup.string().required("Country is required"),
    address: Yup.string().optional(),
    formattedAddress: Yup.string().optional(),
  }),

  hourlyRate: Yup.number()
    .min(0, "Hourly rate cannot be negative")
    .max(10000, "Hourly rate cannot exceed 10000")
    .optional(),

  languages: Yup.array()
    .of(Yup.string().required())
    .min(1, "At least one language is required")
    .required("Languages are required"),

  specialties: Yup.array()
    .of(
      Yup.string().oneOf(
        Object.values(GUIDE_SPECIALTIES),
        "Invalid specialty selected"
      )
    )
    .optional(),

  bio: Yup.string()
    .max(1000, "Bio cannot exceed 1000 characters")
    .optional(),

  profileImage: Yup.string().url("Profile image must be a valid URL").optional(),

  isAvailable: Yup.boolean().optional(),

  availabilityNote: Yup.string().optional(),
});

