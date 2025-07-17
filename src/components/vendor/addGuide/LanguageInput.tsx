
"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface LanguageInputProps {
  value: string[]
  onChange: (languages: string[]) => void
  error?: string
  className?: string
}

export function LanguageInput({ value, onChange, error, className }: LanguageInputProps) {
  const [currentLanguage, setCurrentLanguage] = useState("")

  const handleAddLanguage = () => {
    const trimmedLanguage = currentLanguage.trim()
    if (trimmedLanguage && !value.includes(trimmedLanguage)) {
      onChange([...value, trimmedLanguage])
      setCurrentLanguage("")
    }
  }

  const handleRemoveLanguage = (langToRemove: string) => {
    onChange(value.filter((lang) => lang !== langToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault() // Prevent form submission
      handleAddLanguage()
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Type a language"
          value={currentLanguage}
          onChange={(e) => setCurrentLanguage(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn("flex-1 focus-visible:ring-black-500", error ? "border-red-500" : "")}
        />
        <Button type="button" onClick={handleAddLanguage} variant="outline" className="shrink-0 bg-transparent">
          <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
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
