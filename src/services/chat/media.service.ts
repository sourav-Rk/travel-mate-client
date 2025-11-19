import { travelMateBackend } from "@/api/instance";
import { CLIENT_API } from "@/constants/api/client.api";
import { VENDOR_API } from "@/constants/api/vendor.api";
import { GUIDE_API } from "@/constants/api/guide.api";
import type { MediaAttachment } from "@/types/chat";
import { getMediaType, validateFileSize, createVideoThumbnail, getVideoDuration, getAudioDuration } from "@/utils/mediaUtils";

type Role = "client" | "guide" | "vendor";

/**
 * Uploads chat media files (images, videos, audio, files)
 */
export const uploadChatMedia = async (
  files: File[],
  role: Role
): Promise<MediaAttachment[]> => {
 
  for (const file of files) {
    const validation = validateFileSize(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
  }

  let endpoint: string;
  switch (role) {
    case "client":
      endpoint = CLIENT_API.UPLOAD_IMAGES; 
      break;
    case "guide":
      endpoint = GUIDE_API.UPLOAD_IMAGES;
      break;
    case "vendor":
      endpoint = VENDOR_API.UPLOAD_IMAGES;
      break;
    default:
      throw new Error(`Invalid role: ${role}`);
  }

  // Upload files
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("image", file); 
  });

  try {
    const response = await travelMateBackend.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const uploadedFiles: { url: string; public_id: string }[] = response.data.data;

    const mediaAttachments: MediaAttachment[] = await Promise.all(
      uploadedFiles.map(async (uploadedFile, index) => {
        const file = files[index];
        const mediaType = getMediaType(file.type);
        const attachment: MediaAttachment = {
          url: uploadedFile.url,
          publicId: uploadedFile.public_id,
          type: mediaType,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        };

        if (mediaType === "video") {
          try {
            const thumbnailUrl = await createVideoThumbnail(file);
            attachment.thumbnailUrl = thumbnailUrl;
            const duration = await getVideoDuration(file);
            attachment.duration = Math.round(duration);
          } catch (error) {
            console.warn("Failed to create video thumbnail:", error);
          }
        }

        if (mediaType === "voice") {
          try {
            const duration = await getAudioDuration(file);
            attachment.duration = Math.round(duration);
          } catch (error) {
            console.warn("Failed to get audio duration:", error);
          }
        }

        return attachment;
      })
    );

    return mediaAttachments;
  } catch (error: any) {
    console.error("Error uploading chat media:", error);
    throw new Error(error.response?.data?.message || "Failed to upload media files");
  }
};












