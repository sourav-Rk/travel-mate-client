import { travelMateBackend } from "@/api/instance";
import { CLIENT_API } from "@/constants/api/client.api";
import type { GuideChatMediaAttachment } from "@/types/guide-chat";
import { getMediaType, validateFileSize, createVideoThumbnail, getVideoDuration, getAudioDuration } from "@/utils/mediaUtils";

/**
 * Uploads guide chat media files (images, videos, audio, files)
 * Uses the same endpoint as regular chat
 */
export const uploadGuideChatMedia = async (
  files: File[]
): Promise<GuideChatMediaAttachment[]> => {
  // Validate files
  for (const file of files) {
    const validation = validateFileSize(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
  }

  // Upload files using the common upload endpoint
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("image", file);
  });

  try {
    const response = await travelMateBackend.post(CLIENT_API.UPLOAD_IMAGES, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const uploadedFiles: { url: string; public_id: string }[] = response.data.data;

    const mediaAttachments: GuideChatMediaAttachment[] = await Promise.all(
      uploadedFiles.map(async (uploadedFile, index) => {
        const file = files[index];
        const mediaType = getMediaType(file.type);
        const attachment: GuideChatMediaAttachment = {
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
  } catch (error: unknown) {
    console.error("Error uploading guide chat media:", error);
    const errorMessage = error && typeof error === "object" && "response" in error
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
      : undefined;
    throw new Error(errorMessage || "Failed to upload media files");
  }
};






