"use client"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ImageUpload } from "./ImageUpload"

interface AccountDocumentsStepProps {
  formData: any
  setFormData: (data: any) => void
  errors: Record<string, string>
}

export function AccountDocumentsStep({ formData, setFormData, errors }: AccountDocumentsStepProps) {
  return (
    <div className="grid gap-6">
  
      <div className="space-y-2">
        <Label htmlFor="documents" className="text-sm font-medium text-gray-700">
          Documents (Image Files Only)
        </Label>
        <ImageUpload
          onFilesChange={(files) => setFormData({ ...formData, documents: files })}
          existingFiles={formData.documents}
          className={cn(errors.documents && "border-red-500 rounded-lg")} 
        />
        <p className="text-sm text-muted-foreground">
          Upload relevant documents (e.g., ID, certifications). Max 5 files.
        </p>
        {errors.documents && <p className="text-red-500 text-xs mt-1">{errors.documents}</p>}
      </div>
    </div>
  )
}
