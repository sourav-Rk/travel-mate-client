export type KYCFormData = {
  pan: string;
  gstin: string;
  documents: {
    document1: File | null;
    document2: File | null;
    document3: File | null;
  };
  registrationNumber: string;
};


// types/kycTypes.ts
export interface KYCRequestPayload {
  pan: string
  gstin: string
  registrationNumber: string
  documents: string[]        
}
