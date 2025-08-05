// components/FormField.tsx

import { AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FormFieldProps {
  id: string
  label: string
  value: string
  error?: string
  placeholder?: string
  required?: boolean
  type?: 'input' | 'textarea'
  maxLength?: number
  onChange: (value: string) => void
  onBlur?: () => void
  showCounter?: boolean
  counterMax?: number
  counterMin?: number
}

export function FormField({
  id,
  label,
  value,
  error,
  placeholder,
  required = false,
  type = 'input',
  maxLength,
  onChange,
  onBlur,
  showCounter = false,
  counterMax,
  counterMin
}: FormFieldProps) {
  const hasError = !!error
  const inputClasses = `bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 ${
    hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
  }`

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label} {required && '*'}
      </Label>
      
      {type === 'input' ? (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={inputClasses}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      ) : (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`${inputClasses} min-h-[120px] resize-none`}
          placeholder={placeholder}
          maxLength={maxLength}
        />
      )}

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      {showCounter && (
        <p className={`text-xs ${
          counterMin && value.length < counterMin ? 'text-red-500' : 'text-slate-500'
        }`}>
          {value.length}{counterMax ? `/${counterMax}` : ''} characters
          {counterMin && ` (minimum ${counterMin} required)`}
        </p>
      )}
    </div>
  )
}