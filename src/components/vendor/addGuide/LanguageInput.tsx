"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Import Select components

interface LanguageInputProps {
  value: string[]
  onChange: (languages: string[]) => void
  error?: string
  className?: string
}

export function LanguageInput({ value, onChange, error, className }: LanguageInputProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("") // State for the currently selected language in the dropdown

  const availableLanguages = [
    "English",
    "Malayalam",
    "Hindi",
    "Tamil",
    "Bengali",
    "Gujarati",
    "Kannada",
    "Assamese",
  ]

  const handleAddLanguage = (language: string) => {
    const trimmedLanguage = language.trim()
    if (trimmedLanguage && !value.includes(trimmedLanguage)) {
      onChange([...value, trimmedLanguage])
      setSelectedLanguage("") 
    }
  }

  const handleRemoveLanguage = (langToRemove: string) => {
    onChange(value.filter((lang) => lang !== langToRemove))
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <Select value={selectedLanguage} onValueChange={handleAddLanguage}>
          <SelectTrigger className={cn("flex-1 focus:ring-black-500", error ? "border-red-500" : "")}>
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map((lang) => (
              <SelectItem key={lang} value={lang} disabled={value.includes(lang)}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((lang) => (
            <Badge key={lang} variant="secondary" className="flex items-center gap-1 pr-1 py-1 text-sm">
              {lang}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full hover:bg-gray-200"
                onClick={() => handleRemoveLanguage(lang)}
                aria-label={`Remove ${lang}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
