"use client"

import { useEffect, useState } from "react"
import { useFormikContext } from "formik"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import ActivitiesSection from "./ActivitiesSection"
import MealsSection from "./MealsSection"
import TransfersSection from "./TransfersSection"
import { createNewDay } from "./AddPackageForm"

interface ItineraryFormProps {
  className?: string
}

export function ItineraryForm({ className }: ItineraryFormProps) {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>()
  const [newTransfer, setNewTransfer] = useState("");

    useEffect(() => {
    const calculatedDays = values.basicDetails?.duration?.days || 1
    const currentItinerary = values.itinerary || []

    if (currentItinerary.length !== calculatedDays) {
      const newItinerary = Array.from({ length: calculatedDays }, (_, i) => {
        const existingDay = currentItinerary[i]
        return existingDay || createNewDay(i + 1)
      })
      setFieldValue("itinerary", newItinerary)
    }
  }, [values.basicDetails?.duration?.days, values.itinerary, setFieldValue])

  const updateDay = (dayIndex: number, field: string, value: any) => {
    const updatedDays = [...(values.itinerary || [])]
    updatedDays[dayIndex] = { ...updatedDays[dayIndex], [field]: value }
    setFieldValue("itinerary", updatedDays)
  }

  const addTransfer = (dayIndex: number) => {
    if (newTransfer.trim()) {
      const updatedDays = [...(values.itinerary || [])]
      updatedDays[dayIndex].transfers.push(newTransfer.trim())
      setFieldValue("itinerary", updatedDays)
      setNewTransfer("")
    }
  }

  const removeTransfer = (dayIndex: number, transferIndex: number) => {
    const updatedDays = [...(values.itinerary || [])]
    updatedDays[dayIndex] = {
      ...updatedDays[dayIndex],
      transfers: updatedDays[dayIndex].transfers.filter((_: any, index: number) => index !== transferIndex),
    }
    setFieldValue("itinerary", updatedDays)
  }

  const addActivity = (dayIndex: number) => {
    const newActivity = {
      name: "",
      dayNumber: dayIndex + 1,
      description: "",
      duration: "",
      category: "",
      priceIncluded: false,
    }
    const updatedDays = [...(values.itinerary || [])]
    updatedDays[dayIndex].activities.push(newActivity)
    setFieldValue("itinerary", updatedDays)
  }

  const updateActivity = (dayIndex: number, activityIndex: number, field: string, value: any) => {
    const updatedDays = [...(values.itinerary || [])]
    updatedDays[dayIndex].activities[activityIndex] = {
      ...updatedDays[dayIndex].activities[activityIndex],
      [field]: value,
    }
    setFieldValue("itinerary", updatedDays)
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updatedDays = [...(values.itinerary || [])]
    updatedDays[dayIndex].activities.splice(activityIndex, 1)
    setFieldValue("itinerary", updatedDays)
  }

   // Get the current itinerary or create default days
  const currentItinerary = values.itinerary || []
  const calculatedDays = values.basicDetails?.duration?.days || 1

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#1a5f6b] mb-2">Plan Your Itinerary</h3>
        <p className="text-gray-600">Create detailed daily schedules for your {calculatedDays}-day package</p>
        {currentItinerary.length !== calculatedDays && (
          <p className="text-amber-600 text-sm mt-2">Updating itinerary to match {calculatedDays} days...</p>
        )}
      </div>

      {currentItinerary.map((day: any, dayIndex: number) => (
        <DayCard
          key={dayIndex}
          day={day}
          dayIndex={dayIndex}
          updateDay={updateDay}
          newTransfer={newTransfer}
          setNewTransfer={setNewTransfer}
          addTransfer={addTransfer}
          removeTransfer={removeTransfer}
          addActivity={addActivity}
          updateActivity={updateActivity}
          removeActivity={removeActivity}
          errors={errors}
          touched={touched}
        />
      ))}
    </div>
  )
}

function DayCard({
  day,
  dayIndex,
  updateDay,
  newTransfer,
  setNewTransfer,
  addTransfer,
  removeTransfer,
  addActivity,
  updateActivity,
  removeActivity,
  errors,
  touched,
}: any) {
  return (
    <Card className="border-[#2CA4BC]/20 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
        <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
          <div className="w-8 h-8 bg-[#2CA4BC] text-white rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-lg">
            {day.dayNumber}
          </div>
          Day {day.dayNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Day Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Day Title *</Label>
            <Input
              value={day.title}
              onChange={(e) => updateDay(dayIndex, "title", e.target.value)}
              placeholder="Arrival in Kochi & City Tour"
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
            {touched.itinerary?.[dayIndex]?.title && errors.itinerary?.[dayIndex]?.title && (
              <p className="text-red-500 text-sm">{errors.itinerary[dayIndex].title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Accommodation</Label>
            <Input
              value={day.accommodation}
              onChange={(e) => updateDay(dayIndex, "accommodation", e.target.value)}
              placeholder="Hotel Grand Plaza or similar"
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Day Description *</Label>
          <Textarea
            value={day.description}
            onChange={(e) => updateDay(dayIndex, "description", e.target.value)}
            placeholder="Detailed description of the day's activities..."
            rows={3}
            className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
          />
          {touched.itinerary?.[dayIndex]?.description && errors.itinerary?.[dayIndex]?.description && (
            <p className="text-red-500 text-sm">{errors.itinerary[dayIndex].description}</p>
          )}
        </div>

        {/* Transfers */}
        <TransfersSection
          transfers={day.transfers}
          newTransfer={newTransfer}
          setNewTransfer={setNewTransfer}
          addTransfer={() => addTransfer(dayIndex)}
          removeTransfer={(transferIndex: number) => removeTransfer(dayIndex, transferIndex)}
        />

        {/* Meals */}
        <MealsSection
          meals={day.meals}
          updateMeals={(meals: any) => updateDay(dayIndex, "meals", meals)}
          dayIndex={dayIndex}
        />

        {/* Activities */}
        <ActivitiesSection
          activities={day.activities}
          addActivity={() => addActivity(dayIndex)}
          updateActivity={(activityIndex: number, field: string, value: any) =>
            updateActivity(dayIndex, activityIndex, field, value)
          }
          removeActivity={(activityIndex: number) => removeActivity(dayIndex, activityIndex)}
          errors={errors}
          touched={touched}
          dayIndex={dayIndex}
        />
      </CardContent>
    </Card>
  )
}
