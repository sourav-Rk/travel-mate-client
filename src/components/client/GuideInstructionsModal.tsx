// "use client"

// import { useState } from "react"
// import { X, Info, MapPin, MessageSquare, Calendar, AlertTriangle } from "lucide-react"
// import type { IGuideInstructionDto, INSTRUCTION_PRIORITY, INSTRUCTION_TYPE } from "@/types/instructionType"

// interface GuideInstructionModalProps {
//   instructions: IGuideInstructionDto[]
//   isOpen: boolean
//   onClose: () => void
//   onMarkAsRead: (instructionId: string) => void
//   onMarkAllAsRead: () => void
// }

// export function GuideInstructionModal({ 
//   instructions, 
//   isOpen, 
//   onClose, 
//   onMarkAsRead,
//   onMarkAllAsRead 
// }: GuideInstructionModalProps) {
//   const [expandedId, setExpandedId] = useState<string | null>(null)

//   if (!isOpen) return null

//   const getPriorityStyles = (priority?: INSTRUCTION_PRIORITY) => {
//     const baseStyles = "border-l-4 rounded-lg p-4 transition-all duration-200"

//     switch (priority) {
//       case "URGENT":
//         return `${baseStyles} bg-red-50 dark:bg-red-950 border-red-500 dark:border-red-400`
//       case "HIGH":
//         return `${baseStyles} bg-orange-50 dark:bg-orange-950 border-orange-500 dark:border-orange-400`
//       case "MEDIUM":
//         return `${baseStyles} bg-yellow-50 dark:bg-yellow-950 border-yellow-500 dark:border-yellow-400`
//       case "LOW":
//       default:
//         return `${baseStyles} bg-blue-50 dark:bg-blue-950 border-blue-500 dark:border-blue-400`
//     }
//   }

//   const getPriorityTextColor = (priority?: INSTRUCTION_PRIORITY) => {
//     switch (priority) {
//       case "URGENT":
//         return "text-red-900 dark:text-red-100"
//       case "HIGH":
//         return "text-orange-900 dark:text-orange-100"
//       case "MEDIUM":
//         return "text-yellow-900 dark:text-yellow-100"
//       case "LOW":
//       default:
//         return "text-blue-900 dark:text-blue-100"
//     }
//   }

//   const getPriorityBadgeColor = (priority?: INSTRUCTION_PRIORITY) => {
//     switch (priority) {
//       case "URGENT":
//         return "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
//       case "HIGH":
//         return "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200"
//       case "MEDIUM":
//         return "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
//       case "LOW":
//       default:
//         return "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
//     }
//   }

//   const getTypeIcon = (type: INSTRUCTION_TYPE) => {
//     switch (type) {
//       case "MEETING_POINT":
//         return <MapPin className="w-5 h-5" />
//       case "ITINERARY_UPDATE":
//         return <Calendar className="w-5 h-5" />
//       case "SAFETY_INFO":
//         return <AlertTriangle className="w-5 h-5" />
//       case "REMINDER":
//         return <Info className="w-5 h-5" />
//       case "GENERAL":
//       default:
//         return <MessageSquare className="w-5 h-5" />
//     }
//   }

//   const getTypeDisplayName = (type: INSTRUCTION_TYPE) => {
//     switch (type) {
//       case "MEETING_POINT":
//         return "Meeting Point"
//       case "ITINERARY_UPDATE":
//         return "Itinerary Update"
//       case "SAFETY_INFO":
//         return "Safety Info"
//       case "REMINDER":
//         return "Reminder"
//       case "GENERAL":
//       default:
//         return "General"
//     }
//   }

//   const handleMarkAsRead = (instructionId: string) => {
//     onMarkAsRead(instructionId);
    
//     if (expandedId === instructionId) {
//       setExpandedId(null);
//     }
//   }

//   const handleMarkAllAsRead = () => {
//     onMarkAllAsRead();
//     onClose();
//   }

//   const handleClose = () => {
//     setExpandedId(null);
//     onClose();
//   }

//   return (
//     <>
//       <div
//         className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-opacity duration-200"
//         onClick={handleClose}
//         aria-hidden="true"
//       />

//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
//         <div className="w-full max-w-2xl lg:max-w-4xl max-h-[90vh] bg-background dark:bg-slate-950 rounded-xl shadow-2xl border border-border dark:border-slate-800 flex flex-col overflow-hidden">
//           <div className="flex items-center justify-between p-6 border-b border-border dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
//             <div className="flex items-center gap-3">
//               <MessageSquare className="w-6 h-6 text-blue-500" />
//               <h2 className="text-xl sm:text-2xl font-bold text-foreground">New Guide Instructions</h2>
//               <span className="ml-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
//                 {instructions.length} New {instructions.length === 1 ? "Instruction" : "Instructions"}
//               </span>
//             </div>
//             <button
//               onClick={handleClose}
//               className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors duration-150"
//               aria-label="Close modal"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-6 space-y-4">
//             {instructions.map((instruction) => (
//               <div
//                 key={instruction._id!}
//                 className={`${getPriorityStyles(instruction.priority)} cursor-pointer hover:shadow-md`}
//                 onClick={() => setExpandedId(expandedId === instruction._id! ? null : instruction._id!)}
//               >
//                 <div className="flex items-start gap-4">
//                   <div className={`mt-1 flex-shrink-0 ${getPriorityTextColor(instruction.priority)}`}>
//                     {getTypeIcon(instruction.type)}
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <h3 className={`text-lg font-semibold ${getPriorityTextColor(instruction.priority)}`}>
//                         {instruction.title}
//                       </h3>
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeColor(
//                           instruction.priority,
//                         )}`}
//                       >
//                         {instruction.priority || "LOW"}
//                       </span>
//                       <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
//                         {getTypeDisplayName(instruction.type)}
//                       </span>
//                     </div>

//                     <p
//                       className={`mt-2 text-sm leading-relaxed ${getPriorityTextColor(
//                         instruction.priority,
//                       )} line-clamp-2`}
//                     >
//                       {instruction.message}
//                     </p>

//                     {expandedId === instruction._id && (
//                       <div className="mt-4 pt-4 border-t border-current border-opacity-20 space-y-3 animate-in fade-in duration-200">
//                         <div>
//                           <p className={`text-sm leading-relaxed ${getPriorityTextColor(instruction.priority)}`}>
//                             {instruction.message}
//                           </p>
//                         </div>

//                         {instruction.location && (
//                           <div className="bg-white dark:bg-slate-800 rounded-lg p-3 space-y-2">
//                             <div className="flex items-center gap-2">
//                               <MapPin className="w-4 h-4 flex-shrink-0" />
//                               <span className="font-semibold text-sm">{instruction.location.name}</span>
//                             </div>
//                             <p className="text-xs text-muted-foreground ml-6">{instruction.location.address}</p>
//                             {instruction.location.coordinates && (
//                               <p className="text-xs text-muted-foreground ml-6">
//                                 📍 {instruction.location.coordinates.lat},
//                                 {instruction.location.coordinates.lng}
//                               </p>
//                             )}
//                           </div>
//                         )}

//                         <div className="text-xs text-muted-foreground space-y-1">
//                           <p>
//                             <span className="font-semibold">Sent:</span>{" "}
//                             {new Date(instruction.sentAt || instruction.createdAt).toLocaleString()}
//                           </p>
//                         </div>

//                         <div className="flex justify-end pt-2">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleMarkAsRead(instruction._id!);
//                             }}
//                             className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
//                           >
//                             Mark as Read
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex-shrink-0 mt-1">
//                     <svg
//                       className={`w-5 h-5 transition-transform duration-200 ${
//                         expandedId === instruction._id ? "rotate-180" : ""
//                       }`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 14l-7 7m0 0l-7-7m7 7V3"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="border-t border-border dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900 flex gap-3 justify-end">
//             <button
//               onClick={handleClose}
//               className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-foreground hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-150 font-medium"
//             >
//               Close
//             </button>
//             <button
//               onClick={handleMarkAllAsRead}
//               className="px-4 py-2 rounded-lg bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-150 font-medium"
//             >
//               Mark All as Read
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// "use client"

// import { useState } from "react"
// import { X, Info, MapPin, MessageSquare, Calendar, AlertTriangle, Package } from "lucide-react"
// import type { INSTRUCTION_PRIORITY, INSTRUCTION_TYPE } from "@/types/instructionType"
// import type { GuideInstructionWithPackageDto } from "@/types/instructionType"

// interface GuideInstructionModalProps {
//   instructions: GuideInstructionWithPackageDto[]
//   isOpen: boolean
//   onClose: () => void
//   onMarkAsRead: (instructionId: string) => void
//   onMarkAllAsRead: () => void
// }

// export function GuideInstructionModal({ 
//   instructions, 
//   isOpen, 
//   onClose, 
//   onMarkAsRead,
//   onMarkAllAsRead 
// }: GuideInstructionModalProps) {
//   const [expandedId, setExpandedId] = useState<string | null>(null)

//   if (!isOpen) return null

//   const getPriorityStyles = (priority?: INSTRUCTION_PRIORITY) => {
//     const baseStyles = "border-l-4 rounded-lg p-4 transition-all duration-200"

//     switch (priority) {
//       case "URGENT":
//         return `${baseStyles} bg-red-50 dark:bg-red-950 border-red-500 dark:border-red-400`
//       case "HIGH":
//         return `${baseStyles} bg-orange-50 dark:bg-orange-950 border-orange-500 dark:border-orange-400`
//       case "MEDIUM":
//         return `${baseStyles} bg-yellow-50 dark:bg-yellow-950 border-yellow-500 dark:border-yellow-400`
//       case "LOW":
//       default:
//         return `${baseStyles} bg-blue-50 dark:bg-blue-950 border-blue-500 dark:border-blue-400`
//     }
//   }

//   const getPriorityTextColor = (priority?: INSTRUCTION_PRIORITY) => {
//     switch (priority) {
//       case "URGENT":
//         return "text-red-900 dark:text-red-100"
//       case "HIGH":
//         return "text-orange-900 dark:text-orange-100"
//       case "MEDIUM":
//         return "text-yellow-900 dark:text-yellow-100"
//       case "LOW":
//       default:
//         return "text-blue-900 dark:text-blue-100"
//     }
//   }

//   const getPriorityBadgeColor = (priority?: INSTRUCTION_PRIORITY) => {
//     switch (priority) {
//       case "URGENT":
//         return "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
//       case "HIGH":
//         return "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200"
//       case "MEDIUM":
//         return "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
//       case "LOW":
//       default:
//         return "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
//     }
//   }

//   const getTypeIcon = (type: INSTRUCTION_TYPE) => {
//     switch (type) {
//       case "MEETING_POINT":
//         return <MapPin className="w-5 h-5" />
//       case "ITINERARY_UPDATE":
//         return <Calendar className="w-5 h-5" />
//       case "SAFETY_INFO":
//         return <AlertTriangle className="w-5 h-5" />
//       case "REMINDER":
//         return <Info className="w-5 h-5" />
//       case "GENERAL":
//       default:
//         return <MessageSquare className="w-5 h-5" />
//     }
//   }

//   const getTypeDisplayName = (type: INSTRUCTION_TYPE) => {
//     switch (type) {
//       case "MEETING_POINT":
//         return "Meeting Point"
//       case "ITINERARY_UPDATE":
//         return "Itinerary Update"
//       case "SAFETY_INFO":
//         return "Safety Info"
//       case "REMINDER":
//         return "Reminder"
//       case "GENERAL":
//       default:
//         return "General"
//     }
//   }

//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     }).format(new Date(date));
//   }

//   const formatDateTime = (date: Date) => {
//     return new Intl.DateTimeFormat("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(new Date(date));
//   }

//   const handleMarkAsRead = (instructionId: string) => {
//     onMarkAsRead(instructionId);
    
//     if (expandedId === instructionId) {
//       setExpandedId(null);
//     }
//   }

//   const handleMarkAllAsRead = () => {
//     onMarkAllAsRead();
//     onClose();
//   }

//   const handleClose = () => {
//     setExpandedId(null);
//     onClose();
//   }

//   return (
//     <>
//       <div
//         className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-opacity duration-200"
//         onClick={handleClose}
//         aria-hidden="true"
//       />

//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
//         <div className="w-full max-w-2xl lg:max-w-4xl max-h-[90vh] bg-background dark:bg-slate-950 rounded-xl shadow-2xl border border-border dark:border-slate-800 flex flex-col overflow-hidden">
//           <div className="flex items-center justify-between p-6 border-b border-border dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
//             <div className="flex items-center gap-3">
//               <MessageSquare className="w-6 h-6 text-blue-500" />
//               <h2 className="text-xl sm:text-2xl font-bold text-foreground">New Guide Instructions</h2>
//               <span className="ml-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
//                 {instructions.length} New {instructions.length === 1 ? "Instruction" : "Instructions"}
//               </span>
//             </div>
//             <button
//               onClick={handleClose}
//               className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors duration-150"
//               aria-label="Close modal"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto p-6 space-y-4">
//             {instructions.map((instruction) => (
//               <div
//                 key={instruction._id!}
//                 className={`${getPriorityStyles(instruction.priority)} cursor-pointer hover:shadow-md`}
//                 onClick={() => setExpandedId(expandedId === instruction._id! ? null : instruction._id!)}
//               >
//                 <div className="flex items-start gap-4">
//                   <div className={`mt-1 flex-shrink-0 ${getPriorityTextColor(instruction.priority)}`}>
//                     {getTypeIcon(instruction.type)}
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     {/* Package Info Header */}
//                     {instruction.packageDetails && (
//                       <div className="mb-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
//                         <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
//                           <Package className="w-4 h-4" />
//                           <span>{instruction.packageDetails.packageName}</span>
//                           <span className="text-slate-500 dark:text-slate-400">•</span>
//                           <span className="text-slate-600 dark:text-slate-400">
//                             {formatDate(instruction.packageDetails.startDate)} - {formatDate(instruction.packageDetails.endDate)}
//                           </span>
//                         </div>
//                         {instruction.packageDetails.meetingPoint && (
//                           <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-1">
//                             <MapPin className="w-3 h-3" />
//                             {instruction.packageDetails.meetingPoint}
//                           </p>
//                         )}
//                       </div>
//                     )}

//                     <div className="flex items-center gap-2 flex-wrap">
//                       <h3 className={`text-lg font-semibold ${getPriorityTextColor(instruction.priority)}`}>
//                         {instruction.title}
//                       </h3>
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeColor(
//                           instruction.priority,
//                         )}`}
//                       >
//                         {instruction.priority || "LOW"}
//                       </span>
//                       <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
//                         {getTypeDisplayName(instruction.type)}
//                       </span>
//                     </div>

//                     <p
//                       className={`mt-2 text-sm leading-relaxed ${getPriorityTextColor(
//                         instruction.priority,
//                       )} line-clamp-2`}
//                     >
//                       {instruction.message}
//                     </p>

//                     {expandedId === instruction._id && (
//                       <div className="mt-4 pt-4 border-t border-current border-opacity-20 space-y-3 animate-in fade-in duration-200">
//                         {/* Full Message */}
//                         <div>
//                           <p className={`text-sm leading-relaxed ${getPriorityTextColor(instruction.priority)}`}>
//                             {instruction.message}
//                           </p>
//                         </div>

//                         {/* Instruction Location */}
//                         {instruction.location && (
//                           <div className="bg-white dark:bg-slate-800 rounded-lg p-3 space-y-2 border border-blue-200 dark:border-blue-800">
//                             <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
//                               <MapPin className="w-4 h-4 flex-shrink-0" />
//                               <span className="font-semibold text-sm">{instruction.location.name}</span>
//                             </div>
//                             <p className="text-xs text-blue-600 dark:text-blue-400 ml-6">{instruction.location.address}</p>
//                             {instruction.location.coordinates && (
//                               <p className="text-xs text-blue-500 dark:text-blue-500 ml-6">
//                                 📍 {instruction.location.coordinates.lat.toFixed(6)},
//                                 {instruction.location.coordinates.lng.toFixed(6)}
//                               </p>
//                             )}
//                           </div>
//                         )}

//                         {/* Package Details in Expanded View */}
//                         {instruction.packageDetails && (
//                           <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 space-y-2 border border-slate-200 dark:border-slate-700">
//                             <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
//                               <Package className="w-4 h-4" />
//                               <span className="font-semibold text-sm">Package Details</span>
//                             </div>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs ml-6">
//                               <div>
//                                 <span className="font-medium text-slate-600 dark:text-slate-400">Name:</span>
//                                 <p className="text-slate-800 dark:text-slate-200">{instruction.packageDetails.packageName}</p>
//                               </div>
//                               <div>
//                                 <span className="font-medium text-slate-600 dark:text-slate-400">Title:</span>
//                                 <p className="text-slate-800 dark:text-slate-200">{instruction.packageDetails.title}</p>
//                               </div>
//                               <div>
//                                 <span className="font-medium text-slate-600 dark:text-slate-400">Dates:</span>
//                                 <p className="text-slate-800 dark:text-slate-200">
//                                   {formatDate(instruction.packageDetails.startDate)} - {formatDate(instruction.packageDetails.endDate)}
//                                 </p>
//                               </div>
//                               {instruction.packageDetails.meetingPoint && (
//                                 <div>
//                                   <span className="font-medium text-slate-600 dark:text-slate-400">Meeting Point:</span>
//                                   <p className="text-slate-800 dark:text-slate-200">{instruction.packageDetails.meetingPoint}</p>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         )}

//                         {/* Metadata */}
//                         <div className="text-xs text-muted-foreground space-y-1">
//                           <p>
//                             <span className="font-semibold">Sent:</span>{" "}
//                             {formatDateTime(instruction.sentAt || instruction.createdAt)}
//                           </p>
//                         </div>

//                         {/* Mark as Read Button */}
//                         <div className="flex justify-end pt-2">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleMarkAsRead(instruction._id!);
//                             }}
//                             className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
//                           >
//                             Mark as Read
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex-shrink-0 mt-1">
//                     <svg
//                       className={`w-5 h-5 transition-transform duration-200 ${
//                         expandedId === instruction._id ? "rotate-180" : ""
//                       }`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 14l-7 7m0 0l-7-7m7 7V3"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="border-t border-border dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900 flex gap-3 justify-end">
//             <button
//               onClick={handleClose}
//               className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-foreground hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-150 font-medium"
//             >
//               Close
//             </button>
//             <button
//               onClick={handleMarkAllAsRead}
//               className="px-4 py-2 rounded-lg bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-600 transition-colors duration-150 font-medium"
//             >
//               Mark All as Read
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }


"use client"

import { useState } from "react"
import { X, Info, MapPin, MessageSquare, Calendar, AlertTriangle, Package, CheckCircle, Eye, EyeOff } from "lucide-react"
import type { INSTRUCTION_PRIORITY, INSTRUCTION_TYPE } from "@/types/instructionType"
import type { GuideInstructionWithPackageDto } from "@/types/instructionType"
import { useClientAuth } from "@/hooks/auth/useAuth"

interface GuideInstructionModalProps {
  allInstructions: GuideInstructionWithPackageDto[]
  isOpen: boolean
  onClose: () => void
  onMarkAsRead: (instructionId: string) => void
  onMarkAllAsRead: () => void
}

export function GuideInstructionModal({ 
  allInstructions=[], 
  isOpen, 
  onClose, 
  onMarkAsRead,
  onMarkAllAsRead 
}: GuideInstructionModalProps) {
  const {clientInfo} = useClientAuth()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showReadInstructions, setShowReadInstructions] = useState(false)

  if (!isOpen) return null

  // Separate instructions into read and unread
  const unreadInstructions = allInstructions.filter(instruction => 
    instruction.readBy.length === 0 || 
    !instruction.readBy.includes(clientInfo?.id) // You'll need to replace this with actual user ID logic
  )
  
  const readInstructions = allInstructions.filter(instruction => 
    instruction.readBy.length > 0 && 
    instruction.readBy.includes(clientInfo?.id) // You'll need to replace this with actual user ID logic
  )

  const displayedInstructions = showReadInstructions 
    ? [...unreadInstructions, ...readInstructions] 
    : unreadInstructions

  const getPriorityStyles = (priority?: INSTRUCTION_PRIORITY, isRead: boolean = false) => {
    const baseStyles = "border-l-4 rounded-lg p-4 transition-all duration-200"
    const readStyles = isRead ? "opacity-70 bg-gray-50 dark:bg-gray-900" : ""

    switch (priority) {
      case "URGENT":
        return `${baseStyles} ${readStyles} ${isRead ? 'border-gray-300 dark:border-gray-600' : 'bg-red-50 dark:bg-red-950 border-red-500 dark:border-red-400'}`
      case "HIGH":
        return `${baseStyles} ${readStyles} ${isRead ? 'border-gray-300 dark:border-gray-600' : 'bg-orange-50 dark:bg-orange-950 border-orange-500 dark:border-orange-400'}`
      case "MEDIUM":
        return `${baseStyles} ${readStyles} ${isRead ? 'border-gray-300 dark:border-gray-600' : 'bg-yellow-50 dark:bg-yellow-950 border-yellow-500 dark:border-yellow-400'}`
      case "LOW":
      default:
        return `${baseStyles} ${readStyles} ${isRead ? 'border-gray-300 dark:border-gray-600' : 'bg-blue-50 dark:bg-blue-950 border-blue-500 dark:border-blue-400'}`
    }
  }

  const getPriorityTextColor = (priority?: INSTRUCTION_PRIORITY, isRead: boolean = false) => {
    if (isRead) return "text-gray-500 dark:text-gray-400"
    
    switch (priority) {
      case "URGENT":
        return "text-red-900 dark:text-red-100"
      case "HIGH":
        return "text-orange-900 dark:text-orange-100"
      case "MEDIUM":
        return "text-yellow-900 dark:text-yellow-100"
      case "LOW":
      default:
        return "text-blue-900 dark:text-blue-100"
    }
  }

  const getPriorityBadgeColor = (priority?: INSTRUCTION_PRIORITY, isRead: boolean = false) => {
    if (isRead) return "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
    
    switch (priority) {
      case "URGENT":
        return "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
      case "HIGH":
        return "bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200"
      case "MEDIUM":
        return "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
      case "LOW":
      default:
        return "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
    }
  }

  const getTypeIcon = (type: INSTRUCTION_TYPE, isRead: boolean = false) => {
    const iconColor = isRead ? "text-gray-400" : ""
    
    switch (type) {
      case "MEETING_POINT":
        return <MapPin className={`w-5 h-5 ${iconColor}`} />
      case "ITINERARY_UPDATE":
        return <Calendar className={`w-5 h-5 ${iconColor}`} />
      case "SAFETY_INFO":
        return <AlertTriangle className={`w-5 h-5 ${iconColor}`} />
      case "REMINDER":
        return <Info className={`w-5 h-5 ${iconColor}`} />
      case "GENERAL":
      default:
        return <MessageSquare className={`w-5 h-5 ${iconColor}`} />
    }
  }

  const getTypeDisplayName = (type: INSTRUCTION_TYPE) => {
    switch (type) {
      case "MEETING_POINT":
        return "Meeting Point"
      case "ITINERARY_UPDATE":
        return "Itinerary Update"
      case "SAFETY_INFO":
        return "Safety Info"
      case "REMINDER":
        return "Reminder"
      case "GENERAL":
      default:
        return "General"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  const isInstructionRead = (instruction: GuideInstructionWithPackageDto): boolean => {
    // Replace this with your actual user ID logic
    return instruction.readBy.length > 0 && instruction.readBy.includes("current-user-id")
  }

  const handleMarkAsRead = (instructionId: string) => {
    onMarkAsRead(instructionId);
    
    if (expandedId === instructionId) {
      setExpandedId(null);
    }
  }

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead();
  }

  const handleClose = () => {
    setExpandedId(null);
    setShowReadInstructions(false);
    onClose();
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-opacity duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl lg:max-w-4xl max-h-[90vh] bg-background dark:bg-slate-950 rounded-xl shadow-2xl border border-border dark:border-slate-800 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border dark:border-slate-800 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Guide Instructions</h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {unreadInstructions.length} Unread
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    {readInstructions.length} Read
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors duration-150"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Filter Toggle */}
          <div className="px-6 py-4 border-b border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReadInstructions(!showReadInstructions)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    showReadInstructions 
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {showReadInstructions ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hide Read
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Show Read ({readInstructions.length})
                    </>
                  )}
                </button>
              </div>
              
              {unreadInstructions.length > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark All as Read
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {displayedInstructions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {showReadInstructions ? "No instructions found" : "No unread instructions"}
                </h3>
                <p className="text-muted-foreground">
                  {showReadInstructions 
                    ? "You don't have any instructions yet" 
                    : "You're all caught up! No new instructions"}
                </p>
              </div>
            ) : (
              displayedInstructions.map((instruction) => {
                const isRead = isInstructionRead(instruction)
                
                return (
                  <div
                    key={instruction._id!}
                    className={`${getPriorityStyles(instruction.priority, isRead)} cursor-pointer hover:shadow-md transition-all ${
                      isRead ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : ''
                    }`}
                    onClick={() => setExpandedId(expandedId === instruction._id! ? null : instruction._id!)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <div className={`mt-1 flex-shrink-0 ${getPriorityTextColor(instruction.priority, isRead)}`}>
                          {getTypeIcon(instruction.type, isRead)}
                        </div>
                        {isRead && (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Package Info Header */}
                        {instruction.packageDetails && (
                          <div className={`mb-3 p-3 rounded-lg border ${
                            isRead 
                              ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                          }`}>
                            <div className={`flex items-center gap-2 text-sm font-medium ${
                              isRead ? 'text-gray-600 dark:text-gray-400' : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              <Package className="w-4 h-4" />
                              <span>{instruction.packageDetails.packageName}</span>
                              <span className="text-slate-500 dark:text-slate-400">•</span>
                              <span className="text-slate-600 dark:text-slate-400">
                                {formatDate(instruction.packageDetails.startDate)} - {formatDate(instruction.packageDetails.endDate)}
                              </span>
                            </div>
                            {instruction.packageDetails.meetingPoint && (
                              <p className={`text-xs mt-1 flex items-center gap-1 ${
                                isRead ? 'text-gray-500 dark:text-gray-500' : 'text-slate-600 dark:text-slate-400'
                              }`}>
                                <MapPin className="w-3 h-3" />
                                {instruction.packageDetails.meetingPoint}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-lg font-semibold ${getPriorityTextColor(instruction.priority, isRead)}`}>
                            {instruction.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityBadgeColor(
                              instruction.priority,
                              isRead
                            )}`}
                          >
                            {instruction.priority || "LOW"}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            isRead 
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                          }`}>
                            {getTypeDisplayName(instruction.type)}
                          </span>
                          {isRead && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                              Read
                            </span>
                          )}
                        </div>

                        <p
                          className={`mt-2 text-sm leading-relaxed ${getPriorityTextColor(
                            instruction.priority,
                            isRead
                          )} line-clamp-2`}
                        >
                          {instruction.message}
                        </p>

                        {expandedId === instruction._id && (
                          <div className="mt-4 pt-4 border-t border-current border-opacity-20 space-y-3 animate-in fade-in duration-200">
                            {/* Full Message */}
                            <div>
                              <p className={`text-sm leading-relaxed ${getPriorityTextColor(instruction.priority, isRead)}`}>
                                {instruction.message}
                              </p>
                            </div>

                            {/* Instruction Location */}
                            {instruction.location && (
                              <div className={`rounded-lg p-3 space-y-2 border ${
                                isRead
                                  ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                  : 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-800'
                              }`}>
                                <div className={`flex items-center gap-2 ${
                                  isRead ? 'text-gray-600 dark:text-gray-400' : 'text-blue-700 dark:text-blue-300'
                                }`}>
                                  <MapPin className="w-4 h-4 flex-shrink-0" />
                                  <span className="font-semibold text-sm">{instruction.location.name}</span>
                                </div>
                                <p className={`text-xs ml-6 ${
                                  isRead ? 'text-gray-500 dark:text-gray-500' : 'text-blue-600 dark:text-blue-400'
                                }`}>
                                  {instruction.location.address}
                                </p>
                                {instruction.location.coordinates && (
                                  <p className={`text-xs ml-6 ${
                                    isRead ? 'text-gray-500 dark:text-gray-500' : 'text-blue-500 dark:text-blue-500'
                                  }`}>
                                    📍 {instruction.location.coordinates.lat.toFixed(6)},
                                    {instruction.location.coordinates.lng.toFixed(6)}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Package Details in Expanded View */}
                            {instruction.packageDetails && (
                              <div className={`rounded-lg p-3 space-y-2 border ${
                                isRead
                                  ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                              }`}>
                                <div className={`flex items-center gap-2 ${
                                  isRead ? 'text-gray-600 dark:text-gray-400' : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                  <Package className="w-4 h-4" />
                                  <span className="font-semibold text-sm">Package Details</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs ml-6">
                                  <div>
                                    <span className={`font-medium ${
                                      isRead ? 'text-gray-500 dark:text-gray-500' : 'text-slate-600 dark:text-slate-400'
                                    }`}>Name:</span>
                                    <p className={isRead ? 'text-gray-700 dark:text-gray-300' : 'text-slate-800 dark:text-slate-200'}>
                                      {instruction.packageDetails.packageName}
                                    </p>
                                  </div>
                                  <div>
                                    <span className={`font-medium ${
                                      isRead ? 'text-gray-500 dark:text-gray-500' : 'text-slate-600 dark:text-slate-400'
                                    }`}>Title:</span>
                                    <p className={isRead ? 'text-gray-700 dark:text-gray-300' : 'text-slate-800 dark:text-slate-200'}>
                                      {instruction.packageDetails.title}
                                    </p>
                                  </div>
                                  <div>
                                    <span className={`font-medium ${
                                      isRead ? 'text-gray-500 dark:text-gray-500' : 'text-slate-600 dark:text-slate-400'
                                    }`}>Dates:</span>
                                    <p className={isRead ? 'text-gray-700 dark:text-gray-300' : 'text-slate-800 dark:text-slate-200'}>
                                      {formatDate(instruction.packageDetails.startDate)} - {formatDate(instruction.packageDetails.endDate)}
                                    </p>
                                  </div>
                                  {instruction.packageDetails.meetingPoint && (
                                    <div>
                                      <span className={`font-medium ${
                                        isRead ? 'text-gray-500 dark:text-gray-500' : 'text-slate-600 dark:text-slate-400'
                                      }`}>Meeting Point:</span>
                                      <p className={isRead ? 'text-gray-700 dark:text-gray-300' : 'text-slate-800 dark:text-slate-200'}>
                                        {instruction.packageDetails.meetingPoint}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Metadata */}
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>
                                <span className="font-semibold">Sent:</span>{" "}
                                {formatDateTime(instruction.sentAt || instruction.createdAt)}
                              </p>
                            </div>

                            {/* Mark as Read Button - Only show for unread instructions */}
                            {!isRead && (
                              <div className="flex justify-end pt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(instruction._id!);
                                  }}
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                >
                                  Mark as Read
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0 mt-1">
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${
                            expandedId === instruction._id ? "rotate-180" : ""
                          } ${isRead ? 'text-gray-400' : 'text-current'}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <div className="border-t border-border dark:border-slate-800 p-6 bg-slate-50 dark:bg-slate-900 flex gap-3 justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-foreground hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-150 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}