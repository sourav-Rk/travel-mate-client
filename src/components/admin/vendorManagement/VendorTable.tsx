import { Users } from "lucide-react";
import type { Vendor } from "./VendorManagement";
import { cn } from "@/lib/utils";

export const VendorTable = ({ vendors, page, limit, isUpdating, setUserToBlock, setIsConfirmationModalOpen, handleView }: any) => {
  const statusColors = {
    unblocked: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blocked: "bg-red-50 text-red-700 border-red-200",
    verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    reviewing: "bg-blue-50 text-blue-700 border-blue-200"
  };

  if (vendors?.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 bg-gray-100 rounded-full">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-lg font-medium">No vendors found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Agency Details</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 hidden md:table-cell">Profile</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Verification</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Block/Unblock</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors?.map((vendor: Vendor, index: number) => (
            <tr key={vendor._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-600">{(page - 1) * limit + index + 1}</td>
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <div className="font-semibold text-gray-900 truncate">{vendor.agencyName}</div>
                  <div className="text-sm text-gray-600 truncate">{`${vendor.firstName} ${vendor.lastName}`}</div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="space-y-1">
                  <div className="text-sm text-gray-900 truncate">{vendor.email}</div>
                  <div className="text-sm text-gray-600">{vendor.phone}</div>
                </div>
              </td>
              <td className="px-4 py-3 text-center hidden md:table-cell">
                <div className="flex justify-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {vendor.profileImage ? (
                      <img src={vendor.profileImage} alt={vendor.firstName} className="h-10 w-10 rounded-full" />
                    ) : (
                      <span className="text-blue-600 font-semibold">{vendor.firstName.charAt(0)}</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[vendor?.status]}`}>
                  {vendor?.status}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[vendor.isBlocked ? "blocked" : "unblocked"]}`}>
                  {vendor.isBlocked ? "Blocked" : "Active"}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => {
                    setUserToBlock(() => ({ type: "vendor", id: vendor._id }));
                    setIsConfirmationModalOpen(true);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 ${
                    vendor.isBlocked ? 'bg-red-500' : 'bg-emerald-500'
                  } ${isUpdating === vendor?._id ? 'opacity-50' : 'hover:shadow-md'}`}
                  disabled={isUpdating === vendor?._id}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                    vendor.isBlocked ? 'translate-x-1' : 'translate-x-6'
                  }`} />
                </button>
              </td>
              <td className="px-4 py-3 text-center">
                <div
                title={vendor.status === "pending" ? "Wait for vendor to update the details" : ""}
                >
                <button
                  disabled={vendor.status === "pending"}
                  onClick={() => handleView(vendor._id)}
                  className={cn(
                    "h-8 w-8 p-0 transition-colors duration-200 rounded-md flex items-center justify-center",
                    vendor.status === "pending"
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "hover:bg-blue-50 hover:text-blue-600"
                  )}

                  >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
