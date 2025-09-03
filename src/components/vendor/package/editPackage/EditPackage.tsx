"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { differenceInDays } from "date-fns"
import { ArrowLeft, FileText, Utensils, Edit3 } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useGetPackageDetailsQuery } from "@/hooks/vendor/usePackage"
import { Spinner } from "@/components/Spinner"
import type { BasicDetails, TravelPackage } from "@/types/packageType"
import { PackagePreview } from "./PackagePreview"
import { BasicDetailsForm } from "./BasicDetailsForm"
import { ItineraryForm } from "./itineraryForm"
import { ActivitiesForm } from "./ActivitiesForm"
import { Formik, Form, type FormikTouched } from "formik"
import * as Yup from "yup"

interface EditPackageProps {
  className?: string
}

export interface FormValues {
  basicDetails: BasicDetails
  itinerary: any[]
  activities: any[]
}

type FormikErrors<T> = {
  [K in keyof T]?: T[K] extends object ? FormikErrors<T[K]> : string
}

function createNewDay(dayNumber: number) {
  return {
    dayNumber,
    title: "",
    description: "",
    accommodation: "",
    transfers: [],
    meals: { breakfast: false, lunch: false, dinner: false },
    activityDetails: [],
  }
}

// Validation schemas
const basicDetailsSchema = Yup.object().shape({
  basicDetails: Yup.object().shape({
    packageName: Yup.string().required("Package name is required").min(3, "Package name must be at least 3 characters"),
    title: Yup.string().required("Title is required").min(5, "Title must be at least 5 characters"),
    description: Yup.string().required("Description is required").min(50, "Description must be at least 50 characters"),
    category: Yup.string().required("Category is required"),
    maxGroupSize: Yup.number().required("Max group size is required").min(1, "Group size must be at least 1"),
    minGroupSize: Yup.number().required("Max group size is required").min(1, "Group size must be at least 1"),
    price: Yup.number().required("Price is required").min(500, "Price must be greater than 500"),
    meetingPoint: Yup.string().required("Meeting point is required"),
    startDate: Yup.date().required("Start date is required").nullable(),
    endDate: Yup.date().required("End date is required").nullable(),
    cancellationPolicy: Yup.string().required("Cancellation policy is required"),
    termsAndConditions: Yup.string().required("Terms and conditions are required"),
    images: Yup.array().min(1, "Please upload at least 1 image").required("Images are required"),
  }),
  itinerary: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Day title is required"),
      description: Yup.string().required("Day description is required"),
    }),
  ),
})

export function EditPackage({ className }: EditPackageProps) {
  const { packageId } = useParams<{ packageId: string }>();
  if(!packageId) return <div>No package id</div>
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("basic-details")
  const [packageData, setPackageData] = useState<TravelPackage | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const { data, isLoading, isError, error } = useGetPackageDetailsQuery(packageId,"vendor");

  const initialValues = {
    basicDetails: {
      packageName: "",
      title: "",
      description: "",
      category: "",
      tags: [],
      meetingPoint: "",
      maxGroupSize: 1,
      minGroupSize : 1,
      price: 0,
      startDate: null,
      endDate: null,
      duration: { days: 1, nights: 0 },
      inclusions: [],
      exclusions: [],
      cancellationPolicy: "",
      termsAndConditions: "",
      images: [],
    },
    itinerary: [],
    activities: [],
  }

  useEffect(() => {
    if (packageId && data?.packages) {
      const pkg = data.packages
      setPackageData(pkg)
    }
  }, [packageId, data])


  if (isLoading) return <Spinner />
  if (isError) return <div>Error: {error.message}</div>

    if (packageData && packageData.status !== "draft") {
    return (
      <div className={cn("lg:ml-64 min-h-screen bg-gradient-to-br from-slate-100 to-blue-100/80", className)}>
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate(`/vendor/packages/${packageId}`)}
                variant="ghost"
                size="sm"
                className="hover:bg-white/80 border border-slate-300 transition-all duration-200 hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Package Details
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1a5f6b]">Edit Package</h1>
                <p className="text-sm text-slate-600">Package ID: {packageId}</p>
              </div>
            </div>
          </div>

          {/* Disabled Message */}
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-8 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                  <Edit3 className="h-8 w-8 text-yellow-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Package Cannot Be Edited</h2>
                <p className="text-gray-600">
                  This package cannot be edited because its current status is{" "}
                  <span className="font-semibold text-gray-900">"{packageData.status}"</span>. Only packages with
                  "draft" status can be edited.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => navigate(`/vendor/packages/${packageId}`)}
                    className="bg-[#2CA4BC] hover:bg-[#1a5f6b] text-white"
                  >
                    View Package Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Create preview data combining current form values
  const getPreviewData = (values: any) => {
    return {
      ...packageData,
      ...values.basicDetails,
      itineraryDetails: { days: values.itinerary },
      _id: packageId,
      status: packageData?.status || "draft",
      rating: 4.8,
      totalBookings: 156,
    }
  }

  const handleFormSubmit = (values: any) => {
    console.log("Form submitted:", values)
  }

  return (
    <Formik<FormValues>
      initialValues={initialValues}
      validationSchema={basicDetailsSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ values, setFieldValue, errors, touched, dirty }) => {
        const formErrors = errors as FormikErrors<FormValues>
        const formTouched = touched as FormikTouched<FormValues>

        // Auto-update itinerary when dates change
        const autoUpdateItinerary = () => {
          if (values.basicDetails.startDate && values.basicDetails.endDate) {
            const days = differenceInDays(values.basicDetails.endDate, values.basicDetails.startDate) + 1
            const nights = Math.max(0, days - 1)

            // Update duration
            setFieldValue("basicDetails.duration", { days, nights })

            // Update itinerary days - preserve existing data where possible
            const newItinerary = Array.from({ length: days }, (_, i) => {
              const existingDay = values.itinerary[i]
              return existingDay || createNewDay(i + 1)
            })
            setFieldValue("itinerary", newItinerary)
          }
        }

        // Initialize form with package data
        const initializeForm = () => {
          if (packageData) {
            setFieldValue("basicDetails", {
              packageName: packageData.packageName,
              title: packageData.title,
              description: packageData.description,
              category: packageData.category ||"",
              tags: packageData.tags || [],
              meetingPoint: packageData.meetingPoint,
              maxGroupSize: packageData.maxGroupSize,
              price: packageData.price,
              startDate: new Date(packageData.startDate),
              endDate: new Date(packageData.endDate),
              duration: packageData.duration,
              inclusions: packageData.inclusions || [],
              exclusions: packageData.exclusions || [],
              cancellationPolicy: packageData.cancellationPolicy,
              termsAndConditions: packageData.termsAndConditions,
              images: packageData.images || [],
            })
            setFieldValue("itinerary", packageData.itineraryDetails?.days || []);
          }
        }

        useEffect(() => {
          autoUpdateItinerary()
        }, [values.basicDetails.startDate, values.basicDetails.endDate])

        useEffect(() => {
          initializeForm()
        }, [packageData])

        // If in preview mode, show the preview component
        if (isPreviewMode) {
          return (
            <PackagePreview
              packageData={getPreviewData(values)}
              onExitPreview={() => setIsPreviewMode(false)}
              isEditMode={true}
            />
          )
        }

        return (
          <div className={cn("lg:ml-64 min-h-screen bg-gradient-to-br from-slate-100 to-blue-100/80", className)}>
            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 shadow-lg">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => navigate(`/vendor/packages/${packageId}`)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/80 border border-slate-300 transition-all duration-200 hover:shadow-md"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Package Details
                  </Button>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[#1a5f6b]">Edit Package</h1>
                    <p className="text-sm text-slate-600">Package ID: {packageId}</p>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="p-0">
                  <Form>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-slate-200 border border-slate-300 rounded-t-lg">
                        <TabsTrigger
                          value="basic-details"
                          className="data-[state=active]:bg-[#2CA4BC] data-[state=active]:text-white data-[state=active]:shadow-md text-xs sm:text-sm"
                        >
                          <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Basic Details</span>
                          <span className="sm:hidden">Basic</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="itinerary"
                          className="data-[state=active]:bg-[#2CA4BC] data-[state=active]:text-white data-[state=active]:shadow-md text-xs sm:text-sm"
                        >
                          <Utensils className="h-4 w-4 mr-1 sm:mr-2" />
                          Itinerary
                        </TabsTrigger>
                        <TabsTrigger
                          value="activities"
                          className="data-[state=active]:bg-[#2CA4BC] data-[state=active]:text-white data-[state=active]:shadow-md text-xs sm:text-sm"
                        >
                          <Edit3 className="h-4 w-4 mr-1 sm:mr-2" />
                          Activities
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic-details">
                        <BasicDetailsForm  packageId={packageId!} />
                      </TabsContent>

                      <TabsContent value="itinerary">
                        <ItineraryForm itineraryId={packageData?.itineraryId!} />
                      </TabsContent>

                      <TabsContent value="activities">
                        <ActivitiesForm itineraryId={packageData?.itineraryId!} />
                      </TabsContent>
                    </Tabs>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      }}
    </Formik>
  )
}
