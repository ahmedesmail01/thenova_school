import { useState, useRef } from "react";
import { Upload, Loader2, Check, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../../../lib/api";

interface ProfileImageUploadProps {
  image?: string;
}

export function ProfileImageUpload({ image }: ProfileImageUploadProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Use local preview, passed image, or default fallback
  const displayImage = preview || image || "/images/user-placeholder.png";

  const { mutate: uploadImage, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      return api.post("user/change-profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Profile image updated successfully!");
      setPreview(null);
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
    onError: (error: unknown) => {
      let message = "Failed to update profile image";
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response: { data?: { message?: string } };
        };
        message = axiosError.response.data?.message || message;
      }
      toast.error(message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast.error("Image size must be under 20MB");
      return;
    }

    // Store the file and show preview — don't upload yet
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      uploadImage(selectedFile);
    }
  };

  const handleCancelPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    // Reset the input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileSelect = () => {
    if (!isPending) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-[#f2f5f8] rounded-2xl mb-4 w-[240px] flex flex-col items-center p-6 border border-slate-50">
        <div className="relative w-full aspect-square rounded-xl overflow-hidden group shadow-sm">
          <img
            src={displayImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />

          {/* Bottom Overlay - simpler as per screenshot */}
          {selectedFile && !isPending ? (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 z-10">
              <button
                type="button"
                onClick={handleCancelPreview}
                className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
                title="Cancel"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleConfirmUpload}
                className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-colors"
                title="Save"
              >
                <Check className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={triggerFileSelect}
              disabled={isPending}
              className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-4 py-2.5 flex items-center justify-center gap-2 cursor-pointer hover:bg-black/70 transition-colors z-10 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" />
                  <span className="text-white text-[12px] font-medium">
                    Uploading...
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-white shrink-0" />
                  <span className="text-white text-[12px] font-medium">
                    Upload Photo
                  </span>
                </>
              )}
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-[10px] leading-relaxed max-w-[180px]">
            Image size should be under 1MB and image ratio needs to be 1:1
          </p>
        </div>
      </div>
    </div>
  );
}
