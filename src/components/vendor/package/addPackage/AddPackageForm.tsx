"use client"

import React, { useState } from "react"
import { Formik, Form } from "formik"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft, Save, FileText, Utensils, Upload, Check } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { BasicDetailsForm } from "./BasicDetailsForm"
import { ItineraryForm } from "./itineraryForm"
import { ReviewForm } from "./ReviewForm"
import { packageFormSchema } from "@/utils/packageFormValidation"
import { useAddPackageMutation } from "@/hooks/vendor/usePackage"
import toast from "react-hot-toast"
import { useUploadImagesMutation } from "@/hooks/common/useUploadImages"
import type { PackageFormData } from "@/types/packageType"

export function createNewDay(dayNumber: number) {
  return {
    dayNumber,
    title: "",
    description: "",
    accommodation: "",
    transfers: [],
    meals: { breakfast: false, lunch: false, dinner: false },
    activities: [],
  }
}

export default function AddPackageForm() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {mutate : addPackage} = useAddPackageMutation();
  const {mutateAsync : uploadImages} = useUploadImagesMutation();

  const initialValues: PackageFormData = {
    basicDetails: {
      packageName: "",
      title: "",
      slug: "",
      description: "",
      category: "",
      tags: [],
      meetingPoint: "",
      images: [],
      maxGroupSize: 1,
      price: 0,
      cancellationPolicy: "",
      termsAndConditions: "",
      startDate: null,
      endDate: null,
      duration: { days: 1, nights: 0 },
      inclusions: [],
      exclusions: [],
    },
    itinerary: [createNewDay(1)],
  }

  const steps = [
    { title: "Package Details", description: "Basic information and pricing", icon: FileText },
    { title: "Itinerary", description: "Daily activities and schedule", icon: Utensils },
    { title: "Final Review", description: "Review and submit package", icon: Upload },
  ]

  const handleSubmit = async (values: PackageFormData) => {
    console.log("submit triggered");
    setIsSubmitting(true)
    
    try {
      
      let imageUrls : string[] = [];

      if(values.basicDetails.images.length > 0){
        const uploadedImages = await uploadImages(values.basicDetails.images);
        imageUrls = uploadedImages.map(img => img.url);
      }

      const updatedBasicDetails = {
        ...values.basicDetails,
        images : imageUrls
      }

      const apiData = {
        data: {
          basicDetails: updatedBasicDetails,
          itinerary: values.itinerary,
        },
      }

      console.log("Submitting package data:", apiData)

      addPackage(apiData, {
        onSuccess: (response) => {
          toast.success(response.message);
          setIsSubmitting(false);
          navigate("/vendor/profile")
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || error.message || "An error occurred");
          setIsSubmitting(false)
        }
      })

    } catch (error) {
      console.error("Error submitting package:", error)
      toast.error("Failed to create package")
      setIsSubmitting(false)
    }
  }

  const validateCurrentStep = async (values: PackageFormData, validateForm: any, setFieldTouched: any) => {
    try {
      // Trigger full form validation
      const errors = await validateForm(values);
      
      // Check for errors in current step
      if (currentStep === 0) {
        // Basic Details validation - mark fields as touched to show errors
        const basicDetailsFields = [
          'packageName', 'title', 'description', 'category', 'meetingPoint', 
          'maxGroupSize', 'price', 'cancellationPolicy', 'termsAndConditions',
          'startDate', 'endDate'
        ];
        
        const hasBasicDetailsErrors = errors.basicDetails && Object.keys(errors.basicDetails).length > 0;
        
        if (hasBasicDetailsErrors) {
          // Mark all basic details fields as touched to show validation errors
          basicDetailsFields.forEach(field => {
            setFieldTouched(`basicDetails.${field}`, true);
          });
          
          toast.error("Please fix all required fields in Package Details");
          return false;
        }
      } else if (currentStep === 1) {
        // Itinerary validation
        const hasItineraryErrors = errors.itinerary && errors.itinerary.length > 0;
        console.log(errors.itinerary)
        
        if (hasItineraryErrors) {
          values.itinerary.forEach((_, index) => {
            setFieldTouched(`itinerary.${index}.title`, true);
            setFieldTouched(`itinerary.${index}.description`, true);
          });
          
          toast.error("Please fix all required fields in Itinerary");
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Please check all required fields");
      return false;
    }
  }

  return (
    <div className="lg:ml-64 p-4 md:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-[#2CA4BC]/5 to-[#1a5f6b]/5">
      <Formik
        initialValues={initialValues}
        validationSchema={packageFormSchema}
        onSubmit={(values) => { 
          console.log("Formik submitting", values); 
          handleSubmit(values); 
        }}
        enableReinitialize
      >
        {({ values, submitForm,validateForm,setFieldTouched }) => {
          return (
            <Form>
              <Card className="w-full max-w-6xl mx-auto shadow-2xl border-0">
                <CardHeader className="bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] text-white p-8">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(-1)}
                      className="text-white hover:bg-white/20 hover:text-white"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <div className="flex-1">
                      <CardTitle className="text-3xl font-bold">Create New Package</CardTitle>
                      <CardDescription className="text-white/90 text-lg mt-2">
                        {steps[currentStep].description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  {/* Enhanced Step Indicator - Fixed Icon Issue */}
                  <div className="flex justify-center items-center gap-8 mb-12">
                    {steps.map((step, index) => {
                      // Use the individual step's icon, not the current step's icon
                      const StepIcon = step.icon
                      
                      return (
                        <React.Fragment key={index}>
                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                "w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-lg",
                                currentStep === index
                                  ? "bg-[#2CA4BC] text-white scale-110"
                                  : currentStep > index
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-600",
                              )}
                            >
                              {currentStep > index ? (
                                <Check className="h-6 w-6" />
                              ) : (
                                <StepIcon className="h-6 w-6" />
                              )}
                            </div>
                            <span
                              className={cn(
                                "mt-3 text-sm font-semibold text-center transition-colors",
                                currentStep === index ? "text-[#2CA4BC]" : "text-gray-500",
                              )}
                            >
                              {step.title}
                            </span>
                          </div>
                          {index < steps.length - 1 && (
                            <div
                              className={cn(
                                "flex-1 h-1 rounded-full transition-all duration-300",
                                currentStep > index ? "bg-green-500" : "bg-gray-300",
                              )}
                            />
                          )}
                        </React.Fragment>
                      )
                    })}
                  </div>

                  {/* Form Content */}
                  <div className="min-h-[600px]">
                    {currentStep === 0 && (
                      <BasicDetailsForm/>
                    )}
                    {currentStep === 1 && <ItineraryForm />}
                    {currentStep === 2 && <ReviewForm />}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between p-8 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="border-[#2CA4BC]/30 text-[#1a5f6b] hover:bg-[#2CA4BC]/10 px-8 py-3"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  )}

                  {currentStep < steps.length - 1 ? (
                    <Button
                      type="button"
                      onClick={async () => {
                        const isValid = await validateCurrentStep(values, validateForm, setFieldTouched);
                        if (isValid) {
                          setCurrentStep((prev) => prev + 1);
                        }
                      }}
                      className="ml-auto bg-[#2CA4BC] hover:bg-[#1a5f6b] px-8 py-3 text-lg"
                    >
                      Next Step
                      <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => {
                        // Add any final validation or confirmation here if needed
                        console.log("Create Package button clicked");
                        submitForm(); // Manually trigger form submission
                      }}
                      className="ml-auto bg-gradient-to-r from-[#2CA4BC] to-[#1a5f6b] hover:from-[#2CA4BC]/90 hover:to-[#1a5f6b]/90 px-8 py-3 text-lg shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                          Creating Package...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-3" />
                          Create Package
                        </>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </Form>
          )
        }}
      </Formik>
    </div>
  )
}