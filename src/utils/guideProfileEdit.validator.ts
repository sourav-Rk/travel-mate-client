import * as Yup from "yup";

export const guideProfileEditSchema = Yup.object().shape({
  profileImage: Yup.string().url("Profile image must be a valid URL").nullable(),
  
  bio: Yup.string()
    .max(500, "Bio must be less than 500 characters")
    .nullable(),
  
  languageSpoken: Yup.array()
    .of(Yup.string().required("Language is required"))
    .min(1, "At least one language must be selected")
    .required("Languages spoken is required"),
  
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  
  alternatePhone: Yup.string()
    .matches(/^[0-9]{10}$/, "Alternate phone must be exactly 10 digits")
    .nullable()
    .test("different-phone", "Alternate phone must be different from primary phone", function (value) {
      const { phone } = this.parent;
      if (value && phone && value === phone) {
        return this.createError({
          message: "Alternate phone must be different from primary phone",
        });
      }
      return true;
    }),
});

export type GuideProfileEditFormValues = {
  profileImage: string | null;
  bio: string | null;
  languageSpoken: string[];
  phone: string;
  alternatePhone: string | null;
};

