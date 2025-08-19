import { guideAxiosInstance } from "@/api/guide.axios";
import type { PasswordChangeFormType, ResetFormType } from "@/types/authTypes";

//--------guide profile api---------
export const guideProfile = async () => {
  try {
    const response = await guideAxiosInstance.get("/_gu/guide/details");
    return response.data;
  } catch (error: any) {
    throw error.response.data.message || error;
  }
};


//---------update password api------------
export const updateGuidePassword = async (data: PasswordChangeFormType) => {
  try {
    const response = await guideAxiosInstance.put(
      "/_gu/guide/update-password",
      data
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};


//--------reset password api----------
export const resetPassword = async (data: ResetFormType) => {
  const response = await guideAxiosInstance.post(
    "/_gu/guide/reset-password",
    data
  );
  return response.data;
};
