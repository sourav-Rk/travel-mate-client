import { clientAxiosInstance } from "@/api/client.axios"
import type { PasswordChangeFormType } from "@/types/authTypes";

export type Client = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  phone: string;
  profileImage?: string;
  bio ?: string;
  googleId ?: string;
  isBlocked ?: string;
  gender ?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ClientResponse = {
    success : boolean;
    client : Client;
}

//-----get client details api----------
export const getClientDetails = async () => {
    try{
        const response = await clientAxiosInstance.get<ClientResponse>("/_cl/client/details");
        return response.data;
    }catch(error : any){
        throw error
    }
}

//------update client details api--------
export const updateClientDetails = async(data : Partial<Client>) =>{
  try{
     const response = await clientAxiosInstance.put("/_cl/client/details",data);
     return response.data;
  }catch(error : any){
     throw error
  }
}

//-------update password api------------
export const updateClientPassword = async(data : PasswordChangeFormType) => {
   const response = await clientAxiosInstance.put("/_cl/client/update-password",data);
   return response.data;
}

//-------upload images api------------
export const uploadImages = async (
  files: File[]
): Promise<{ url: string; public_id: string }[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("image", f));
  try {
    const response = await clientAxiosInstance.post(
      "/_cl/client/images/upload",
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data as { url: string; public_id: string }[];
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

