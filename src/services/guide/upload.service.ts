import { travelMateBackend } from "@/api/instance";
import { GUIDE_API } from "@/constants/api/guide.api";

/**
 * Upload images to server for guide
 */
export const uploadGuideImages = async (
  files: File[]
): Promise<{ url: string; public_id: string }[]> => {
  const form = new FormData();
  files.forEach((f) => form.append("image", f));
  try {
    const response = await travelMateBackend.post(
      GUIDE_API.UPLOAD_IMAGES,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data as { url: string; public_id: string }[];
  } catch (error: unknown) {
    console.log(error);
    throw error;
  }
};


