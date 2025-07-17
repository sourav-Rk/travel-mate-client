"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { LanguageInput } from "./LanguageInput"

interface ProfessionalInfoStepProps {
  formData: any
  setFormData: (data: any) => void
  errors: Record<string, string>
}

export function ProfessionalInfoStep({ formData, setFormData, errors }: ProfessionalInfoStepProps) {
  return (
    <div className="grid gap-6">
      <div className="space-y-2">
        <Label htmlFor="yearOfExperience" className="text-sm font-medium text-gray-700">
          Years of Experience
        </Label>
        <Select
          value={formData.yearOfExperience}
          onValueChange={(value) => setFormData({ ...formData, yearOfExperience: value })}
        >
          <SelectTrigger
            id="yearOfExperience"
            className={cn("focus:ring-emerald-500", errors.yearOfExperience && "border-red-500")}
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
        {errors.yearOfExperience && <p className="text-red-500 text-xs mt-1">{errors.yearOfExperience}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="languageSpoken" className="text-sm font-medium text-gray-700">
          Languages Spoken
        </Label>
        <LanguageInput
          value={formData.languageSpoken}
          onChange={(languages) => setFormData({ ...formData, languageSpoken: languages })}
          error={errors.languageSpoken}
        />
        <p className="text-sm text-muted-foreground">Add languages one by one.</p>
      </div>
    </div>
  )
}
