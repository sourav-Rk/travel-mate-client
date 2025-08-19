import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Camera,X } from "lucide-react";

export default function ImageUploadSection({ images, handleImageUpload, removeImage, error }: any) {
  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <Camera className="h-4 w-4 text-[#2CA4BC]" />
        Package Images *
      </Label>
      <div className="border-2 border-dashed border-[#2CA4BC]/30 rounded-xl p-8 text-center hover:border-[#2CA4BC]/50 transition-colors">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Camera className="h-16 w-16 text-[#2CA4BC] mx-auto mb-4" />
          <p className="text-[#1a5f6b] font-medium text-lg">Click to upload images</p>
          <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB each • Minimum 3 images recommended</p>
        </label>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image: File, index: number) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(image) || "/placeholder.svg"}
                alt={`Package ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600 rounded-full shadow-lg"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
