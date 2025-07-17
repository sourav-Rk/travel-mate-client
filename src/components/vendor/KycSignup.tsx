// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { ArrowLeft, CheckCircle, FileText, Upload, X } from "lucide-react"
// import type { KYCFormData } from "@/types/kycType"

// interface KYCData {
//   pan: string
//   gstin: string
//   registrationNumber: string
//   documents: {
//     document1: File | null
//     document2: File | null
//     document3: File | null
//   }
// }

// interface KYCSignupProps {
//   onBack: () => void
//   onRegister: (data: KYCFormData) => Promise<void>
//   initialData?: KYCFormData
// }

// const DOCUMENT_LABELS = ["PAN Card", "GST Certificate", "Business Registration Certificate"]

// export default function KYCSignup({ onBack, onRegister, initialData }: KYCSignupProps) {
//   const [formData, setFormData] = useState<KYCFormData>(
//     initialData || {
//       pan: "",
//       gstin: "",
//       registrationNumber: "",
//       documents: {
//         document1: null,
//         document2: null,
//         document3: null,
//       },
//     },
//   )

//   const [errors, setErrors] = useState<{
//     pan?: string
//     gstin?: string
//     registrationNumber?: string
//     documents?: string
//   }>({})

//   const validatePAN = (pan: string): boolean => {
//     const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
//     return panRegex.test(pan)
//   }

//   const validateGSTIN = (gstin: string): boolean => {
//     const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
//     return gstinRegex.test(gstin)
//   }

//   const validateForm = (): boolean => {
//     const newErrors: typeof errors = {}

//     if (!formData.pan.trim()) {
//       newErrors.pan = "PAN number is required"
//     } else if (!validatePAN(formData.pan)) {
//       newErrors.pan = "Invalid PAN format (e.g., ABCDE1234F)"
//     }

//     if (!formData.gstin.trim()) {
//       newErrors.gstin = "GSTIN is required"
//     } else if (!validateGSTIN(formData.gstin)) {
//       newErrors.gstin = "Invalid GSTIN format (e.g., 22AAAAA0000A1Z5)"
//     }

//     if (!formData.registrationNumber.trim()) {
//       newErrors.registrationNumber = "Registration number is required"
//     }

//     const { document1, document2, document3 } = formData.documents
//     if (!document1 || !document2 || !document3) {
//       newErrors.documents = "All three documents are required"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (validateForm()) {
//       onRegister(formData)
//     }
//   }

//   const updateField = (field: keyof Omit<KYCData, "documents">, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//     // Clear error when user starts typing
//     if (errors) {
//       setErrors((prev) => ({ ...prev, [field]: undefined }))
//     }
//   }

//   const handleFileUpload = (documentKey: keyof KYCData["documents"], file: File | null) => {
//     setFormData((prev) => ({
//       ...prev,
//       documents: {
//         ...prev.documents,
//         [documentKey]: file,
//       },
//     }))
//     // Clear document error when file is uploaded
//     if (file && errors.documents) {
//       setErrors((prev) => ({ ...prev, documents: undefined }))
//     }
//   }

//   const removeFile = (documentKey: keyof KYCData["documents"]) => {
//     handleFileUpload(documentKey, null)
//   }

//   const formatFileSize = (bytes: number): string => {
//     if (bytes === 0) return "0 Bytes"
//     const k = 1024
//     const sizes = ["Bytes", "KB", "MB", "GB"]
//     const i = Math.floor(Math.log(bytes) / Math.log(k))
//     return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-2xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
//           <p className="text-gray-600 mt-2">Step 3 of 3 - Complete your business verification</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle>Business Verification Documents</CardTitle>
//             <CardDescription>
//               Please provide accurate business information and upload required documents for verification
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="pan">PAN Number *</Label>
//                   <Input
//                     id="panNumber"
//                     value={formData.pan}
//                     onChange={(e) => updateField("pan", e.target.value.toUpperCase())}
//                     placeholder="ABCDE1234F"
//                     maxLength={10}
//                     className={errors.pan ? "border-red-500" : ""}
//                   />
//                   {errors.pan && <p className="text-sm text-red-500">{errors.pan}</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="gstin">GSTIN *</Label>
//                   <Input
//                     id="gstin"
//                     value={formData.gstin}
//                     onChange={(e) => updateField("gstin", e.target.value.toUpperCase())}
//                     placeholder="22AAAAA0000A1Z5"
//                     maxLength={15}
//                     className={errors.gstin ? "border-red-500" : ""}
//                   />
//                   {errors.gstin && <p className="text-sm text-red-500">{errors.gstin}</p>}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="registrationNumber">Business Registration Number *</Label>
//                 <Input
//                   id="registrationNumber"
//                   value={formData.registrationNumber}
//                   onChange={(e) => updateField("registrationNumber", e.target.value)}
//                   placeholder="Enter business registration number"
//                   className={errors.registrationNumber ? "border-red-500" : ""}
//                 />
//                 {errors.registrationNumber && <p className="text-sm text-red-500">{errors.registrationNumber}</p>}
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <Label className="text-base font-medium">Upload Required Documents *</Label>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     Please upload clear, readable copies of the following documents (PDF, JPG, PNG - Max 5MB each)
//                   </p>
//                   {errors.documents && <p className="text-sm text-red-500 mt-1">{errors.documents}</p>}
//                 </div>

//                 {(["document1", "document2", "document3"] as const).map((docKey, index) => (
//                   <div key={docKey} className="space-y-3">
//                     <Label className="text-sm font-medium">
//                       {index + 1}. {DOCUMENT_LABELS[index]}
//                     </Label>

//                     {!formData.documents[docKey] ? (
//                       <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
//                         <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
//                         <div className="space-y-2">
//                           <p className="text-sm text-gray-600">Click to upload {DOCUMENT_LABELS[index]}</p>
//                           <Button
//                             type="button"
//                             variant="outline"
//                             onClick={() => document.getElementById(`file-${docKey}`)?.click()}
//                             className="mx-auto"
//                           >
//                             Choose File
//                           </Button>
//                         </div>
//                         <input
//                           id={`file-${docKey}`}
//                           type="file"
//                           accept=".pdf,.jpg,.jpeg,.png"
//                           onChange={(e) => {
//                             const file = e.target.files?.[0] || null
//                             if (file) {
//                               // Check file size (5MB limit)
//                               if (file.size > 5 * 1024 * 1024) {
//                                 alert("File size must be less than 5MB")
//                                 e.target.value = "" // Clear the input
//                                 return
//                               }
//                               handleFileUpload(docKey, file)
//                             }
//                           }}
//                           style={{ display: "none" }}
//                         />
//                         <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</p>
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <FileText className="w-5 h-5 text-green-600" />
//                           <div>
//                             <p className="text-sm font-medium text-green-800">{formData.documents[docKey]?.name}</p>
//                             <p className="text-xs text-green-600">
//                               {formData.documents[docKey] && formatFileSize(formData.documents[docKey]!.size)}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             type="button"
//                             variant="outline"
//                             size="sm"
//                             onClick={() => document.getElementById(`file-${docKey}`)?.click()}
//                             className="text-blue-600 hover:text-blue-800"
//                           >
//                             Change
//                           </Button>
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeFile(docKey)}
//                             className="text-red-600 hover:text-red-800 hover:bg-red-50"
//                           >
//                             <X className="w-4 h-4" />
//                           </Button>
//                         </div>
//                         <input
//                           id={`file-${docKey}`}
//                           type="file"
//                           accept=".pdf,.jpg,.jpeg,.png"
//                           onChange={(e) => {
//                             const file = e.target.files?.[0] || null
//                             if (file) {
//                               // Check file size (5MB limit)
//                               if (file.size > 5 * 1024 * 1024) {
//                                 alert("File size must be less than 5MB")
//                                 e.target.value = "" // Clear the input
//                                 return
//                               }
//                               handleFileUpload(docKey, file)
//                             }
//                           }}
//                           style={{ display: "none" }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div className="flex justify-between pt-6">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={onBack}
//                   className="flex items-center gap-2 px-6 bg-transparent"
//                 >
//                   <ArrowLeft className="w-4 h-4" />
//                   Back
//                 </Button>
//                 <Button type="submit" className="flex items-center gap-2 px-8">
//                   Complete Registration
//                   <CheckCircle className="w-4 h-4" />
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle, FileText, Upload, X, Shield, Loader2 } from "lucide-react"
import type { KYCFormData } from "@/types/kycType"

interface KYCData {
  pan: string
  gstin: string
  registrationNumber: string
  documents: {
    document1: File | null
    document2: File | null
    document3: File | null
  }
}

interface KYCSignupProps {
  onBack: () => void
  onRegister: (data: KYCFormData) => Promise<void>
  isUpdating : boolean
  initialData?: KYCFormData
}

const DOCUMENT_LABELS = ["PAN Card", "GST Certificate", "Business Registration Certificate"]

export default function KYCSignup({ onBack, onRegister, initialData,isUpdating }: KYCSignupProps) {
  const [formData, setFormData] = useState<KYCFormData>(
    initialData || {
      pan: "",
      gstin: "",
      registrationNumber: "",
      documents: {
        document1: null,
        document2: null,
        document3: null,
      },
    },
  )

  const [errors, setErrors] = useState<{
    pan?: string
    gstin?: string
    registrationNumber?: string
    documents?: string
  }>({})

  const validatePAN = (pan: string): boolean => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    return panRegex.test(pan)
  }

  const validateGSTIN = (gstin: string): boolean => {
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    return gstinRegex.test(gstin)
  }

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formData.pan.trim()) {
      newErrors.pan = "PAN number is required"
    } else if (!validatePAN(formData.pan)) {
      newErrors.pan = "Invalid PAN format (e.g., ABCDE1234F)"
    }

    if (!formData.gstin.trim()) {
      newErrors.gstin = "GSTIN is required"
    } else if (!validateGSTIN(formData.gstin)) {
      newErrors.gstin = "Invalid GSTIN format (e.g., 22AAAAA0000A1Z5)"
    }

    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required"
    }

    const { document1, document2, document3 } = formData.documents
    if (!document1 || !document2 || !document3) {
      newErrors.documents = "All three documents are required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onRegister(formData)
    }
  }

  const updateField = (field: keyof Omit<KYCData, "documents">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileUpload = (documentKey: keyof KYCData["documents"], file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentKey]: file,
      },
    }))
    // Clear document error when file is uploaded
    if (file && errors.documents) {
      setErrors((prev) => ({ ...prev, documents: undefined }))
    }
  }

  const removeFile = (documentKey: keyof KYCData["documents"]) => {
    handleFileUpload(documentKey, null)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            KYC Verification
          </h1>
          <p className="text-gray-600 text-lg">Step 3 of 3 - Complete your business verification</p>
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
              <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
              <div className="w-8 h-1 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <CardTitle className="text-2xl font-bold text-gray-800">Business Verification Documents</CardTitle>
            </div>
            <CardDescription className="text-gray-600 text-base">
              Please provide accurate business information and upload required documents for verification
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="panNumber" className="text-sm font-medium text-gray-700">PAN Number *</Label>
                  <Input
                    id="panNumber"
                    value={formData.pan}
                    onChange={(e) => updateField("pan", e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      errors.pan ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.pan && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.pan}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstin" className="text-sm font-medium text-gray-700">GSTIN *</Label>
                  <Input
                    id="gstin"
                    value={formData.gstin}
                    onChange={(e) => updateField("gstin", e.target.value.toUpperCase())}
                    placeholder="22AAAAA0000A1Z5"
                    maxLength={15}
                    className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      errors.gstin ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.gstin && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.gstin}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationNumber" className="text-sm font-medium text-gray-700">Business Registration Number *</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => updateField("registrationNumber", e.target.value)}
                  placeholder="Enter business registration number"
                  className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                    errors.registrationNumber ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                  }`}
                />
                {errors.registrationNumber && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.registrationNumber}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium text-gray-700">Upload Required Documents *</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Please upload clear, readable copies of the following documents (PDF, JPG, PNG - Max 5MB each)
                  </p>
                  {errors.documents && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.documents}
                    </p>
                  )}
                </div>

                {(["document1", "document2", "document3"] as const).map((docKey, index) => (
                  <div key={docKey} className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      {index + 1}. {DOCUMENT_LABELS[index]}
                    </Label>

                    {!formData.documents[docKey] ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-all duration-200 bg-gray-50/50 hover:bg-blue-50/50">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">Click to upload {DOCUMENT_LABELS[index]}</p>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById(`file-${docKey}`)?.click()}
                            className="mx-auto border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                          >
                            Choose File
                          </Button>
                        </div>
                        <input
                          id={`file-${docKey}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            if (file) {
                              // Check file size (5MB limit)
                              if (file.size > 5 * 1024 * 1024) {
                                alert("File size must be less than 5MB")
                                e.target.value = "" // Clear the input
                                return
                              }
                              handleFileUpload(docKey, file)
                            }
                          }}
                          style={{ display: "none" }}
                        />
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800">{formData.documents[docKey]?.name}</p>
                            <p className="text-xs text-green-600">
                              {formData.documents[docKey] && formatFileSize(formData.documents[docKey]!.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`file-${docKey}`)?.click()}
                            className="text-blue-600 hover:text-blue-800 border-blue-200 hover:bg-blue-50"
                          >
                            Change
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(docKey)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <input
                          id={`file-${docKey}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null
                            if (file) {
                              // Check file size (5MB limit)
                              if (file.size > 5 * 1024 * 1024) {
                                alert("File size must be less than 5MB")
                                e.target.value = "" // Clear the input
                                return
                              }
                              handleFileUpload(docKey, file)
                            }
                          }}
                          style={{ display: "none" }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex items-center gap-2 px-6 bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
        type="submit"
        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        disabled={isUpdating} // Disable when updating is true
      >
        {isUpdating? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* Show spinner */}
            Updating... {/* Show fallback text */}
          </>
        ) : (
          <>
            Complete Registration
            <CheckCircle className="w-4 h-4" />
          </>
        )}
      </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}