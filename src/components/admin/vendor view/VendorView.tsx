"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserDetailsQuery } from "@/hooks/admin/useUserDetails";
import { getUserDetails } from "@/services/admin/admin.service";
import { useVendorStatusUpdateMutation } from "@/hooks/admin/useVendorStatusUpdate";
import { Spinner } from "@/components/Spinner";
import type { VendorData } from "@/types/User";
import toast from "react-hot-toast";
import { VendorHeader } from "./VendorHeader";
import { VendorBasicInfo } from "./VendorBasicInfo";
import { VendorAddress } from "./VendorAddress";
import { VendorKYC } from "./VendorKyc";
import { DocumentModal } from "./DocumentModal";
import { RejectReasonModal } from "@/components/modals/RejectReasonModal";
import { useGetSignedUrlsMutation } from "@/hooks/common/useSignedUrls";

export default function VendorView() {
  const { userId } = useParams<{ userId: string }>();
  const [docUrls, setDocUrls] = useState<string[]>([]);
  const [vendor, setVendor] = useState<VendorData>();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    url: string;
    index: number;
  } | null>(null);

  if (!userId) return <div>Invalid user</div>;

  const { mutate: updateStatus } = useVendorStatusUpdateMutation();
  const { mutate: getSignedUrls } = useGetSignedUrlsMutation("admin");
  const { data, isLoading } = useUserDetailsQuery<VendorData>(
    getUserDetails,
    "vendor",
    userId
  );

  useEffect(() => {
    const fetchUrlsAndSetVendor = async () => {
      if(!data?.user) return;
      setVendor(data.user);

      if(data?.user?.kycDetails.documents?.length > 0){
        await getUrls(data?.user?.kycDetails?.documents)
      }
    };
    fetchUrlsAndSetVendor()
  }, [data]);

  if (!userId) return <div>Invalid User Id</div>;
  if (isLoading) return <Spinner />;

  const handleStatusUpdate = async (
    vendorId: string,
    newStatus: "verified" | "rejected",
    reason?: string
  ) => {
    setIsUpdating(true);
    updateStatus(
      { vendorId, status: newStatus, reason },
      {
        onSuccess: (response) => {
          toast.success(`${response.message}`);
          setVendor((prev) => (prev ? { ...prev, status: newStatus } : prev));
        },
        onError: (error: unknown) => {
          toast.error(error as string);
        },
      }
    );
    setIsUpdating(false);
  };

  const getUrls = async (documents : string[]) => {
    if(!documents || documents.length === 0){
      console.log("no documents to fetch urls for");
      return;
    }
    console.log("fetching signed urls",documents)
   
      getSignedUrls(documents, {
        onSuccess: (data) => {
          setDocUrls(data || []);
        },
        onError :(error) =>{
          console.log("error fetching urls",error)
          
        }
      });

  };

  const handleRejectVendor = () => {
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = (reason: string) => {
    handleStatusUpdate(vendor?._id, "rejected", reason);
    setIsRejectModalOpen(false);
  };

  const handleDocumentView = (docUrl: string, index: number) => {
    setSelectedDocument({ url: docUrl, index });
  };

  const handleRejectModalClose = () => {
    setIsRejectModalOpen(false);
  };

  const handleDownload = (docUrl: string) => {
    const link = document.createElement("a");
    link.href = docUrl;
    link.download = `document-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="ml-0 lg:ml-64 min-h-screen bg-slate-50 transition-all duration-300">
      <div className="p-4 lg:p-8 pt-16 lg:pt-8 space-y-8">
        <VendorHeader
          isUpdating={isUpdating}
          vendorStatus={vendor?.status}
          vendorId={vendor?._id}
          onStatusUpdate={handleStatusUpdate}
          onReject={handleRejectVendor}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <VendorBasicInfo vendor={vendor} />
          <VendorAddress vendor={vendor} />
        </div>

        <VendorKYC
          vendor={vendor}
          urls={docUrls}
          onDocumentView={handleDocumentView}
          onDownload={handleDownload}
        />

        <DocumentModal
          selectedDocument={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDownload={handleDownload}
        />

        <RejectReasonModal
          isOpen={isRejectModalOpen}
          onClose={handleRejectModalClose}
          onConfirm={handleRejectConfirm}
          isLoading={isUpdating}
          vendorName={vendor?.agencyName}
        />
      </div>
    </div>
  );
}
