"use client";

import React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { ProfessionalInfoStep } from "./ProfessionalInfoStep";
import { AccountDocumentsStep } from "./AccountDocumentStep";
import { cn } from "@/lib/utils";
import { uploadImages } from "@/services/vendor/vendorService";
import { useAddGuideMutation } from "@/hooks/vendor/useGuide";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

// Define the type for form data
interface GuideFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  yearOfExperience: string;
  languageSpoken: string[];
  alternatePhone: string;
  role: "guide";
  documents: File[];
}

export default function AddGuideForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<GuideFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    yearOfExperience: "",
    languageSpoken: [],
    alternatePhone: "",
    role: "guide" as const,
    documents: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { mutateAsync: addGuide,isPending } = useAddGuideMutation();

  // Validation function for each step
  const validateStep = (stepIndex: number): boolean => {
    const currentStepErrors: Record<string, string> = {};
    let isValid = true;

    switch (stepIndex) {
      case 0: // Personal Information
        if (!formData.firstName.trim())
          currentStepErrors.firstName = "First Name is required";
        if (!formData.lastName.trim())
          currentStepErrors.lastName = "Last Name is required";
        if (!formData.email.trim()) {
          currentStepErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          currentStepErrors.email = "Invalid email address";
        }
        if (!formData.phone.trim())
          currentStepErrors.phone = "Phone number is required";
        if (!formData.gender) currentStepErrors.gender = "Gender is required";
        if (!formData.dob) currentStepErrors.dob = "Date of Birth is required";
        break;
      case 1: // Professional Information
        if (!formData.yearOfExperience)
          currentStepErrors.yearOfExperience =
            "Years of Experience is required";
        if (formData.languageSpoken.length === 0)
          currentStepErrors.languageSpoken =
            "At least one language is required";
        break;
      case 2: // Account & Documents
        if (formData.documents.length === 0)
          currentStepErrors.documents = "At least one document is required";
        break;
      default:
        break;
    }

    setErrors(currentStepErrors);
    isValid = Object.keys(currentStepErrors).length === 0;
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
      setErrors({});
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      try {
        const urls = await uploadImages(formData.documents.map((file) => file));

        const payload = {
          ...formData,
          documents: urls.map((img) => img.url),
          dob: new Date(formData.dob),
        };
        const response = await addGuide(payload);
        toast.success(response.message);
        navigate("/vendor/dashboard");
      } catch (error: any) {
        console.log(error);
        toast.error(error);
      }
    } else {
      console.log("Form has errors:", errors);
    }
  };

  const steps = [
    {
      title: "Personal Information",
      description: "Provide your basic details.",
      component: (
        <PersonalInfoStep
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
      ),
    },
    {
      title: "Professional Information",
      description: "Share your experience and language skills.",
      component: (
        <ProfessionalInfoStep
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
      ),
    },
    {
      title: "Account & Documents",
      description: "Set up your account and upload necessary documents.",
      component: (
        <AccountDocumentsStep
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
      ),
    },
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto my-8 shadow-xl rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
        <CardTitle className="text-3xl font-extrabold tracking-tight">
          Add New Guide
        </CardTitle>
        <CardDescription className="text-gray-300 mt-2">
          {steps[currentStep].description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        {/* Step Indicator */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300",
                    currentStep === index
                      ? "bg-blue-950 text-white shadow-md"
                      : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
                  )}
                >
                  {index + 1}
                </div>
                <span
                  className={cn(
                    "mt-2 text-sm font-medium transition-colors duration-300",
                    currentStep === index ? "text-black-600" : "text-gray-500"
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 bg-gray-300 transition-colors duration-300",
                    currentStep > index ? "bg-blue-950" : ""
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Content */}
        {steps[currentStep].component}
      </CardContent>
      <CardFooter className="flex justify-between p-6 border-t border-gray-200 bg-gray-50">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={handlePrevious}
            className="px-6 py-2 text-gray-700 border-gray-300 hover:bg-gray-100 bg-transparent"
          >
            Previous
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button
            onClick={handleNext}
            className="ml-auto px-6 py-2 bg-blue-950 hover:bg-blue-900 text-white"
          >
            Next
          </Button>
        )}
        {currentStep === steps.length - 1 && (
         <Button
          type="submit"
          onClick={handleSubmit}
          className={cn(
            "ml-auto px-6 py-2 text-white",
            isPending 
              ? "bg-blue-800 cursor-not-allowed" 
              : "bg-blue-950 hover:bg-blue-900" 
          )}
          disabled={isPending} 
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* Loading spinner */}
              Adding...
            </>
          ) : (
            "Add Guide"
          )}
        </Button>
        )}
      </CardFooter>
    </Card>
  );
}
