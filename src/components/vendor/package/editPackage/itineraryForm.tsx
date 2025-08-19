// "use client";

// import { useState } from "react";
// import { useFormikContext, type FormikErrors } from "formik";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Save } from "lucide-react";
// import toast from "react-hot-toast";
// import { useUpdateItineraryDetailsMutation } from "@/hooks/vendor/usePackage";
// import type { DayDto } from "@/types/packageType";
// import ConfirmationModal from "@/components/modals/ConfirmationModal";

// interface FormValues {
//   itinerary: DayDto[];
// }

// export function ItineraryForm({ itineraryId }: { itineraryId: string }) {
//   const { values, setFieldValue, errors, touched } =
//     useFormikContext<FormValues>();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//   const { mutate: updateItinerary } = useUpdateItineraryDetailsMutation();

//   const itineraryData = values.itinerary || [];

//   const handleItinerarySubmit = async () => {
//     setIsSubmitting(true);
//     try {
//       const sanitizedItinerary = itineraryData.map(
//         ({ activityDetails, ...rest }: any) => ({
//           ...rest,
//         })
//       );
//       console.log("Updating itinerary:", sanitizedItinerary);
//       updateItinerary(
//         { itineraryId, itineraryData: sanitizedItinerary },
//         {
//           onSuccess: (response) => {
//             toast.success(response?.message);
//           },
//           onError: (error: any) => {
//             toast.error(error?.response?.data?.message);
//             console.log(error);
//           },
//         }
//       );
//     } catch (error) {
//       console.error("Error updating itinerary:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const updateItineraryDay = (dayIndex: number, field: string, value: any) => {
//     const updatedItinerary = [...itineraryData];
//     updatedItinerary[dayIndex] = {
//       ...updatedItinerary[dayIndex],
//       [field]: value,
//     };
//     setFieldValue("itinerary", updatedItinerary);
//   };

//   return (
//     <div className="p-4 sm:p-6 space-y-6">
//       <ConfirmationModal
//         isOpen={isConfirmOpen}
//         onClose={() => setIsConfirmOpen(false)}
//         onConfirm={handleItinerarySubmit}
//         title="Save Itinerary"
//         message="Are you sure you want to save the itinerary changes?"
//         confirmText="Yes, Save"
//         cancelText="Cancel"
//         type="info"
//         isLoading={isSubmitting}
//       />
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
//         <div>
//           <h3 className="text-lg sm:text-xl font-semibold text-[#1a5f6b]">
//             Itinerary Details
//           </h3>
//           <p className="text-sm text-gray-600 mt-1">
//             {itineraryData.length} days configured
//           </p>
//         </div>
//         <Button
//           onClick={() => setIsConfirmOpen(true)} 
//           disabled={isSubmitting}
//           className="bg-[#2CA4BC] hover:bg-[#1a5f6b] text-white w-full sm:w-auto"
//         >
//           {isSubmitting ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
//               Saving...
//             </>
//           ) : (
//             <>
//               <Save className="h-4 w-4 mr-2" />
//               Save Itinerary
//             </>
//           )}
//         </Button>
//       </div>

//       <div className="space-y-6">
//         {itineraryData.map((day: any, dayIndex: number) => (
//           <Card key={day.dayNumber} className="border-[#2CA4BC]/20 shadow-lg">
//             <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
//               <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
//                 <div className="w-8 h-8 bg-[#2CA4BC] text-white rounded-full flex items-center justify-center text-sm font-bold">
//                   {day.dayNumber}
//                 </div>
//                 Day {day.dayNumber}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-4 sm:p-6 space-y-4">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Day Title *</Label>
//                   <Input
//                     value={day.title || ""}
//                     onChange={(e) =>
//                       updateItineraryDay(dayIndex, "title", e.target.value)
//                     }
//                     className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
//                     placeholder="e.g., Arrival in Kochi & City Tour"
//                   />
//                   {touched.itinerary?.[dayIndex]?.title &&
//                     (errors.itinerary?.[dayIndex] as FormikErrors<DayDto>)
//                       ?.title && (
//                       <p className="text-red-500 text-sm">
//                         {
//                           (errors.itinerary?.[dayIndex] as FormikErrors<DayDto>)
//                             .title
//                         }
//                       </p>
//                     )}
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Accommodation</Label>
//                   <Input
//                     value={day.accommodation || ""}
//                     onChange={(e) =>
//                       updateItineraryDay(
//                         dayIndex,
//                         "accommodation",
//                         e.target.value
//                       )
//                     }
//                     className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
//                     placeholder="e.g., Hotel Grand Plaza or similar"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>Day Description *</Label>
//                 <Textarea
//                   value={day.description || ""}
//                   onChange={(e) =>
//                     updateItineraryDay(dayIndex, "description", e.target.value)
//                   }
//                   rows={3}
//                   className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
//                   placeholder="Detailed description of the day's activities..."
//                 />
//                 {touched.itinerary?.[dayIndex]?.description &&
//                   (errors.itinerary?.[dayIndex] as FormikErrors<DayDto>)
//                     ?.description && (
//                     <p className="text-red-500 text-sm">
//                       {
//                         (errors.itinerary?.[dayIndex] as FormikErrors<DayDto>)
//                           .title
//                       }
//                     </p>
//                   )}
//               </div>

//               {/* Meals */}
//               <div className="space-y-2">
//                 <Label>Meals Included</Label>
//                 <div className="flex flex-wrap gap-4 sm:gap-6">
//                   {["breakfast", "lunch", "dinner"].map((meal) => (
//                     <div key={meal} className="flex items-center space-x-2">
//                       <Checkbox
//                         id={`${dayIndex}-${meal}`}
//                         checked={day.meals?.[meal] || false}
//                         onCheckedChange={(checked) => {
//                           const updatedMeals = {
//                             ...day.meals,
//                             [meal]: checked,
//                           };
//                           updateItineraryDay(dayIndex, "meals", updatedMeals);
//                         }}
//                         className="data-[state=checked]:bg-[#2CA4BC] data-[state=checked]:border-[#2CA4BC]"
//                       />
//                       <Label
//                         htmlFor={`${dayIndex}-${meal}`}
//                         className="capitalize font-medium text-sm"
//                       >
//                         {meal}
//                       </Label>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {itineraryData.length === 0 && (
//         <div className="text-center py-12 text-gray-500">
//           <p>
//             Please select start and end dates in Basic Details to generate your
//             itinerary days.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }


"use client"

import { useState } from "react"
import { useFormikContext, type FormikErrors } from "formik"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Save } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { useUpdateItineraryDetailsMutation } from "@/hooks/vendor/usePackage"
import type { DayDto } from "@/types/packageType"
import ConfirmationModal from "@/components/modals/ConfirmationModal"

interface FormValues {
  itinerary: DayDto[]
}

export function ItineraryForm({ itineraryId }: { itineraryId: string }) {
  const { values, setFieldValue, errors, touched, validateForm, setTouched } = useFormikContext<FormValues>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { mutate: updateItinerary } = useUpdateItineraryDetailsMutation()

  const itineraryData = values.itinerary || []

  const handleSaveClick = async () => {
    // Trigger validation for itinerary fields
    const validationErrors = await validateForm()

    // Mark all itinerary fields as touched to show validation errors
    const touchedItinerary = itineraryData.map(() => ({
      title: true,
      description: true,
    }))

    setTouched({
      ...touched,
      itinerary: touchedItinerary,
    })

    // Check if there are validation errors in itinerary
    if (validationErrors?.itinerary && Array.isArray(validationErrors.itinerary)) {
      const hasErrors = validationErrors.itinerary.some((dayError: any) => dayError && Object.keys(dayError).length > 0)
      if (hasErrors) {
        toast.error("Please fix the validation errors before saving")
        return
      }
    }

    // Check for empty required fields manually since they might not be in validation schema
    const hasEmptyFields = itineraryData.some((day) => !day.title?.trim() || !day.description?.trim())
    if (hasEmptyFields) {
      toast.error("Please fill in all required fields (Title and Description) for each day")
      return
    }

    setIsConfirmOpen(true)
  }

  const handleItinerarySubmit = async () => {
    setIsSubmitting(true)
    setIsConfirmOpen(false)

    try {
      const sanitizedItinerary = itineraryData.map(({ activityDetails, ...rest }: any) => ({
        ...rest,
      }))
      console.log("Updating itinerary:", sanitizedItinerary)
      updateItinerary(
        { itineraryId, itineraryData: sanitizedItinerary },
        {
          onSuccess: (response) => {
            toast.success(response?.message)
            setIsSubmitting(false)
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message)
            console.log(error)
            setIsSubmitting(false)
          },
        },
      )
    } catch (error) {
      console.error("Error updating itinerary:", error)
      toast.error("An error occurred while updating the itinerary")
      setIsSubmitting(false)
    }
  }

  const updateItineraryDay = (dayIndex: number, field: string, value: any) => {
    const updatedItinerary = [...itineraryData]
    updatedItinerary[dayIndex] = {
      ...updatedItinerary[dayIndex],
      [field]: value,
    }
    setFieldValue("itinerary", updatedItinerary)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => !isSubmitting && setIsConfirmOpen(false)}
        onConfirm={handleItinerarySubmit}
        title="Save Itinerary"
        message="Are you sure you want to save the itinerary changes?"
        confirmText="Yes, Save"
        cancelText="Cancel"
        type="info"
        isLoading={isSubmitting}
      />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#1a5f6b]">Itinerary Details</h3>
          <p className="text-sm text-gray-600 mt-1">{itineraryData.length} days configured</p>
        </div>
        <Button
          onClick={handleSaveClick}
          disabled={isSubmitting}
          className="bg-[#2CA4BC] hover:bg-[#1a5f6b] text-white w-full sm:w-auto"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Itinerary
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {itineraryData.map((day: any, dayIndex: number) => (
          <Card key={day.dayNumber} className="border-[#2CA4BC]/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-[#2CA4BC]/10 to-[#1a5f6b]/10">
              <CardTitle className="text-[#1a5f6b] flex items-center gap-2">
                <div className="w-8 h-8 bg-[#2CA4BC] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {day.dayNumber}
                </div>
                Day {day.dayNumber}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Day Title *</Label>
                  <Input
                    value={day.title || ""}
                    onChange={(e) => updateItineraryDay(dayIndex, "title", e.target.value)}
                    className={cn(
                      "focus:border-[#2CA4BC] focus:ring-[#2CA4BC]",
                      touched.itinerary?.[dayIndex]?.title &&
                        (errors.itinerary?.[dayIndex] as FormikErrors<DayDto>)?.title &&
                        "border-red-500",
                      !day.title?.trim() && touched.itinerary?.[dayIndex]?.title && "border-red-500",
                    )}
                    placeholder="e.g., Arrival in Kochi & City Tour"
                  />
                  {touched.itinerary?.[dayIndex]?.title &&
                    ((errors.itinerary?.[dayIndex] as FormikErrors<DayDto>)?.title || !day.title?.trim()) && (
                      <p className="text-red-500 text-sm">
                        {(errors.itinerary?.[dayIndex] as FormikErrors<DayDto>)?.title || "Day title is required"}
                      </p>
                    )}
                </div>
                <div className="space-y-2">
                  <Label>Accommodation</Label>
                  <Input
                    value={day.accommodation || ""}
                    onChange={(e) => updateItineraryDay(dayIndex, "accommodation", e.target.value)}
                    className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
                    placeholder="e.g., Hotel Grand Plaza or similar"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Day Description *</Label>
                <Textarea
                  value={day.description || ""}
                  onChange={(e) => updateItineraryDay(dayIndex, "description", e.target.value)}
                  rows={3}
                  className={cn(
                    "focus:border-[#2CA4BC] focus:ring-[#2CA4BC]",
                    touched.itinerary?.[dayIndex]?.description &&
                      (errors.itinerary?.[dayIndex] as FormikErrors<DayDto>)?.description &&
                      "border-red-500",
                    !day.description?.trim() && touched.itinerary?.[dayIndex]?.description && "border-red-500",
                  )}
                  placeholder="Detailed description of the day's activities..."
                />
                {touched.itinerary?.[dayIndex]?.description &&
                  ((errors.itinerary?.[dayIndex] as FormikErrors<DayDto>)?.description || !day.description?.trim()) && (
                    <p className="text-red-500 text-sm">
                      {(errors.itinerary?.[dayIndex] as FormikErrors<DayDto>)?.description ||
                        "Day description is required"}
                    </p>
                  )}
              </div>

              {/* Meals */}
              <div className="space-y-2">
                <Label>Meals Included</Label>
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  {["breakfast", "lunch", "dinner"].map((meal) => (
                    <div key={meal} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${dayIndex}-${meal}`}
                        checked={day.meals?.[meal] || false}
                        onCheckedChange={(checked) => {
                          const updatedMeals = {
                            ...day.meals,
                            [meal]: checked,
                          }
                          updateItineraryDay(dayIndex, "meals", updatedMeals)
                        }}
                        className="data-[state=checked]:bg-[#2CA4BC] data-[state=checked]:border-[#2CA4BC]"
                      />
                      <Label htmlFor={`${dayIndex}-${meal}`} className="capitalize font-medium text-sm">
                        {meal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {itineraryData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Please select start and end dates in Basic Details to generate your itinerary days.</p>
        </div>
      )}
    </div>
  )
}
