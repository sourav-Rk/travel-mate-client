"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { X, UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onFilesChange: (files: File[]) => void
  existingFiles?: File[]
  maxFiles?: number
  className?: string
}

export function ImageUpload({ onFilesChange, existingFiles = [], maxFiles = 5, className }: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>(existingFiles)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [selectedFiles])

  useEffect(() => {
    setSelectedFiles(existingFiles)
  }, [existingFiles])

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
      const combinedFiles = [...selectedFiles, ...newFiles].slice(0, maxFiles)
      setSelectedFiles(combinedFiles)
      onFilesChange(combinedFiles)
    },
    [selectedFiles, maxFiles, onFilesChange],
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files)
  }

  const handleRemoveFile = (indexToRemove: number) => {
    const updatedFiles = selectedFiles.filter((_, index) => index !== indexToRemove)
    setSelectedFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragOver(false)
      handleFiles(event.dataTransfer.files)
    },
    [handleFiles],
  )

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200",
          isDragOver ? "border-blue-950 bg-emerald-50" : "border-gray-300 bg-gray-50 hover:border-gray-400",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud className="h-10 w-10 text-gray-400 mb-3" />
        <p className="text-sm text-gray-600 font-medium">Drag & drop images here, or</p>
        <label
          htmlFor="file-upload"
          className="mt-2 px-4 py-2 bg-blue-950 text-white rounded-md shadow-sm hover:bg-blue-900 cursor-pointer transition-colors duration-200"
        >
          Browse Files
        </label>
        <Input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={selectedFiles.length >= maxFiles}
          className="hidden"
        />
        {selectedFiles.length >= maxFiles && (
          <p className="text-sm text-red-500 mt-2">Maximum {maxFiles} files reached.</p>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-md overflow-hidden border border-gray-200 shadow-sm"
            >
              <img src={url || "/placeholder.svg"} alt={`Preview ${index + 1}`}   />
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-gray-600 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100 shadow-md"
                aria-label={`Remove file ${index + 1}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
