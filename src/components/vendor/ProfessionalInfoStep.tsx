"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import type { FormikProps } from "formik"

interface ProfessionalInfoStepProps {
  formik: FormikProps<any>
}

export function ProfessionalInfoStep({ formik }: ProfessionalInfoStepProps) {
  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label htmlFor="yearOfExperience" className="text-sm font-medium text-gray-700">
          Years of Experience
        </Label>
        <Select
          value={formik.values.yearOfExperience}
          onValueChange={(value) => {
            formik.setFieldValue("yearOfExperience", value)
            formik.setFieldTouched("yearOfExperience", true, false)
          }}
        >
          <SelectTrigger
            id="yearOfExperience"
            className={formik.touched.yearOfExperience && formik.errors.yearOfExperience ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select years of experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0-1">0-1 Year</SelectItem>
            <SelectItem value="1-3">1-3 Years</SelectItem>
            <SelectItem value="3-5">3-5 Years</SelectItem>
            <SelectItem value="5-10">5-10 Years</SelectItem>
            <SelectItem value="10+">10+ Years</SelectItem>
          </SelectContent>
        </Select>
        {formik.touched.yearOfExperience && formik.errors.yearOfExperience && (
          <p className="text-red-500 text-xs mt-1">{formik?.errors.yearOfExperience}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="languageSpoken" className="text-sm font-medium text-gray-700">
          Languages Spoken (comma-separated)
        </Label>
        <Input
          id="languageSpoken"
          name="languageSpoken"
          placeholder="English, Spanish, French"
          value={formik.values.languageSpoken.join(", ")}
          onChange={(e) => {
            formik.setFieldValue(
              "languageSpoken",
              e.target.value
                .split(",")
                .map((lang: string) => lang.trim())
                .filter(Boolean),
            )
          }}
          onBlur={formik.handleBlur}
          className={formik.touched.languageSpoken && formik.errors.languageSpoken ? "border-red-500" : ""}
        />
        <p className="text-sm text-muted-foreground">
          Enter languages separated by commas (e.g., English, Spanish, French).
        </p>
        {formik.touched.languageSpoken && formik.errors.languageSpoken && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.languageSpoken}</p>
        )}
      </div>
    </div>
  )
}
