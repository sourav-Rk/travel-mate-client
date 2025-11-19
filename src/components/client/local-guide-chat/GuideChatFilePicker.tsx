import { useState, useRef, useCallback } from "react";
import { X, Image, Video, File, Mic, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilePreview {
  file: File;
  preview?: string;
  type: "image" | "video" | "file" | "voice";
}

interface GuideChatFilePickerProps {
  onFilesSelected: (files: File[]) => Promise<void>;
  onAttachmentsReady: (attachments: any[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
];
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/mov",
  "video/avi",
  "video/wmv",
  "video/flv",
  "video/webm",
];
const ACCEPTED_AUDIO_TYPES = [
  "audio/mp3",
  "audio/wav",
  "audio/ogg",
  "audio/m4a",
  "audio/aac",
];

export function GuideChatFilePicker({
  onFilesSelected,
  onAttachmentsReady,
  disabled = false,
  maxFiles = 5,
}: GuideChatFilePickerProps) {
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): "image" | "video" | "file" | "voice" => {
    if (ACCEPTED_IMAGE_TYPES.includes(file.type)) return "image";
    if (ACCEPTED_VIDEO_TYPES.includes(file.type)) return "video";
    if (ACCEPTED_AUDIO_TYPES.includes(file.type)) return "voice";
    return "file";
  };

  const validateFile = (file: File): string | null => {
    const fileType = getFileType(file);

    if (fileType === "image" && file.size > MAX_IMAGE_SIZE) {
      return "Image size exceeds 10MB limit";
    }
    if (
      fileType !== "image" &&
      fileType !== "voice" &&
      file.size > MAX_FILE_SIZE
    ) {
      return "File size exceeds 50MB limit";
    }

    return null;
  };

  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      const fileType = getFileType(file);
      if (fileType === "image") {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      const remainingSlots = maxFiles - previews.length;
      if (files.length > remainingSlots) {
        alert(`You can only upload ${remainingSlots} more file(s)`);
        return;
      }

      const validFiles: FilePreview[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
          continue;
        }

        const type = getFileType(file);
        const preview = await createPreview(file);
        validFiles.push({ file, preview, type });
      }

      if (errors.length > 0) {
        alert(errors.join("\n"));
      }

      if (validFiles.length > 0) {
        const newPreviews = [...previews, ...validFiles];
        setPreviews(newPreviews);

        // Auto-upload files
        setUploading(true);
        try {
          const filesToUpload = validFiles.map((p) => p.file);
          await onFilesSelected(filesToUpload);
        } catch (error) {
          console.error("Upload failed:", error);
          alert("Failed to upload files. Please try again.");
          // Remove failed uploads from previews
          setPreviews(previews);
        } finally {
          setUploading(false);
        }
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [previews, maxFiles, onFilesSelected]
  );

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const getFileIcon = (type: "image" | "video" | "file" | "voice") => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "voice":
        return <Mic className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={[
          ...ACCEPTED_IMAGE_TYPES,
          ...ACCEPTED_VIDEO_TYPES,
          ...ACCEPTED_AUDIO_TYPES,
          "*",
        ].join(",")}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-white/50 rounded-lg border border-slate-200/60">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white"
            >
              {preview.type === "image" && preview.preview ? (
                <img
                  src={preview.preview}
                  alt={preview.file.name}
                  className="w-20 h-20 object-cover"
                />
              ) : (
                <div className="w-20 h-20 flex flex-col items-center justify-center bg-slate-50">
                  {getFileIcon(preview.type)}
                  <span className="text-[10px] text-slate-600 mt-1 truncate max-w-[80px]">
                    {preview.file.name}
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removePreview(index)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                aria-label="Remove file"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-1 py-0.5 truncate">
                {formatFileSize(preview.file.size)}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || uploading || previews.length >= maxFiles}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          disabled || uploading || previews.length >= maxFiles
            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
            : "bg-[#F5F1E8] text-[#8C6A3B] hover:bg-[#E3D5C5] border border-[#E3D5C5]"
        )}
        aria-label="Attach file"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <Image className="w-4 h-4" />
            <span>Attach</span>
          </>
        )}
      </button>
    </div>
  );
}
