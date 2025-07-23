"use client"

import { useState } from "react"
import AddressSignup from "./AddressSignup"
import KYCSignup from "./KycSignup"
import { useNavigate } from "react-router-dom"
import { useAddVendorAddressMutation } from "@/hooks/vendor/useAddVendorAdress"
import { useAddKycMutation } from "@/hooks/vendor/useAddVendorKyc"
import { useUploadImagesMutation } from "@/hooks/common/useUploadImages"
import type { KYCRequestPayload } from "@/types/kycType"
import toast from "react-hot-toast"
import { useUpdateVendorStatusMutation } from "@/hooks/vendor/useUpdateVendorStatus"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import type { StatusPayload } from "@/types/authTypes"
import { useDispatch } from "react-redux"
import { setVendorStatus } from "@/store/slices/vendor.slice"

interface AddressData {
  street: string
  city: string
  address: string
  state: string
  pincode: string
  country: string
}

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

export default function VendorSignupFlow() {
  const [currentStep, setCurrentStep] = useState<"address" | "kyc">("address")
  const [addressData, setAddressData] = useState<AddressData | null>(null)
  const [kycData, setKYCData] = useState<KYCData | null>(null);
  const [isUpdating,setIsUpdating] = useState(false);
  const vendorId = useSelector((state : RootState) => state.vendor.vendor?.id);

  const navigate = useNavigate();
  const  {mutateAsync : addAddres} = useAddVendorAddressMutation();
  const  {mutateAsync : addKyc} = useAddKycMutation();
  const {mutateAsync : updateStatus} = useUpdateVendorStatusMutation();
  const {mutateAsync : uploadImages} = useUploadImagesMutation();
  const dispatch = useDispatch();
  

  const handleAddressNext = (data: AddressData) => {
    setAddressData(data)
    setCurrentStep("kyc")
  }

  const handleKYCBack = () => {
    setCurrentStep("address")
  }

  const handleRegistrationComplete = async (data: KYCData) => {
    console.log("triggerd");
    if(!addressData) return;
    setKYCData(data);
    setIsUpdating(true);
    try{

      const urls = await uploadImages([
        data.documents.document1!,
        data.documents.document2!,
        data.documents.document3!
      ]);

      const payload : KYCRequestPayload ={
        pan : data.pan,
        gstin : data.gstin,
        registrationNumber : data.registrationNumber,
        documents : urls.map((img) => img.public_id),
      }

      const statusPayload : StatusPayload = {
        vendorId : vendorId,
        status : "reviewing"
      }

       await addAddres(addressData);

       await addKyc(payload);
       await updateStatus(statusPayload);
       dispatch(setVendorStatus("reviewing"));

      navigate('/vendor/locked')
    }catch(error : any){
  
      console.log(error)
      toast.error(error);
    }finally{
      setIsUpdating(false);
    }

    
  }

  if (currentStep === "address") {
    return <AddressSignup onNext={handleAddressNext} initialData={addressData || undefined} />
  }

  return <KYCSignup onBack={handleKYCBack} onRegister={handleRegistrationComplete} isUpdating={isUpdating} initialData={kycData || undefined} />
}
