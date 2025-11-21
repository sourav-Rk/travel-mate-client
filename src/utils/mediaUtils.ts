/**
 * Determines the media type from a file's MIME type
 */
export const getMediaType = (mimeType: string): "image" | "video" | "file" | "voice" => {
  if (mimeType.startsWith("image/")) {
    return "image";
  }
  if (mimeType.startsWith("video/")) {
    return "video";
  }
  if (mimeType.startsWith("audio/")) {
    return "voice";
  }
  return "file";
};

/**
 * Formats file size to human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

/**
 * Validates file size based on type
 */
export const validateFileSize = (
  file: File,
  maxImageSize = 10 * 1024 * 1024, // 10MB
  maxVideoSize = 50 * 1024 * 1024, // 50MB
  maxAudioSize = 10 * 1024 * 1024, // 10MB
  maxFileSize = 50 * 1024 * 1024 // 50MB
): { valid: boolean; error?: string } => {
  const mediaType = getMediaType(file.type);
  const fileSize = file.size;

  switch (mediaType) {
    case "image":
      if (fileSize > maxImageSize) {
        return { valid: false, error: `Image size exceeds ${formatFileSize(maxImageSize)} limit` };
      }
      break;
    case "video":
      if (fileSize > maxVideoSize) {
        return { valid: false, error: `Video size exceeds ${formatFileSize(maxVideoSize)} limit` };
      }
      break;
    case "voice":
      if (fileSize > maxAudioSize) {
        return { valid: false, error: `Audio file size exceeds ${formatFileSize(maxAudioSize)} limit` };
      }
      break;
    default:
      if (fileSize > maxFileSize) {
        return { valid: false, error: `File size exceeds ${formatFileSize(maxFileSize)} limit` };
      }
  }

  return { valid: true };
};

/**
 * Creates a thumbnail URL for videos (using first frame)
 */
export const createVideoThumbnail = (videoFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.preload = "metadata";
    video.onloadedmetadata = () => {
      video.currentTime = 0.1; // Seek to 0.1 seconds
    };

    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailUrl = canvas.toDataURL("image/jpeg", 0.7);
      resolve(thumbnailUrl);
    };

    video.onerror = () => {
      reject(new Error("Failed to create video thumbnail"));
    };

    video.src = URL.createObjectURL(videoFile);
  });
};

/**
 * Gets video duration
 */
export const getVideoDuration = (videoFile: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.onerror = () => {
      reject(new Error("Failed to get video duration"));
    };
    video.src = URL.createObjectURL(videoFile);
  });
};

/**
 * Gets audio duration
 */
export const getAudioDuration = (audioFile: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      window.URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    };
    audio.onerror = () => {
      reject(new Error("Failed to get audio duration"));
    };
    audio.src = URL.createObjectURL(audioFile);
  });
};















