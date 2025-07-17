"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface PersonalInfoStepProps {
  formData: any
  setFormData: (data: any) => void
  errors: Record<string, string>
}

export function PersonalInfoStep({ formData, setFormData, errors }: PersonalInfoStepProps) {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name
          </Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className={cn("focus-visible:ring-black-500", errors.firstName && "border-red-500")}
          />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name
          </Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className={cn("focus-visible:ring-black-500", errors.lastName && "border-red-500")}
          />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={cn("focus-visible:ring-black-500", errors.email && "border-red-500")}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="123-456-7890"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={cn("focus-visible:ring-black-500", errors.phone && "border-red-500")}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="alternatePhone" className="text-sm font-medium text-gray-700">
            Alternate Phone (Optional)
          </Label>
          <Input
            id="alternatePhone"
            name="alternatePhone"
            type="tel"
            placeholder="987-654-3210"
            value={formData.alternatePhone}
            onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
            className="focus-visible:ring-black-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
            Gender
          </Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger id="gender" className={cn("focus:ring-black-500", errors.gender && "border-red-500")}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
            Date of Birth
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal focus-visible:ring-black-500",
                  !formData.dob && "text-muted-foreground",
                  errors.dob && "border-red-500",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dob ? format(formData.dob, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dob}
                onSelect={(date) => setFormData({ ...formData, dob: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
        </div>
      </div>
    </div>
  )
}
