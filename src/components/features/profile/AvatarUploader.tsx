'use client';

import React, { useRef, useState } from 'react';
import { Camera, CheckCircle2, Loader2, AlertCircle, UploadCloud, User } from 'lucide-react';
import { uploadAvatarApi } from '@/lib/api/upload.api';

interface AvatarUploaderProps {
  currentAvatarUrl?: string | null;
  onAvatarUploaded: (url: string) => void;
}

export function AvatarUploader({ currentAvatarUrl, onAvatarUploaded }: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const displayUrl = previewUrl || currentAvatarUrl;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset messages
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('ขนาดไฟล์เกิน 2MB กรุณาเลือกไฟล์ใหม่');
      return;
    }

    // Validate image format
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMsg('รองรับเฉพาะไฟล์รูปภาพ .png, .jpg, .jpeg, .webp เท่านั้น');
      return;
    }

    // Show instant local preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload to Cloudinary via backend API
    setIsUploading(true);
    try {
      const res = await uploadAvatarApi(file);
      onAvatarUploaded(res.url);
      setSuccessMsg('อัปโหลดรูปโปรไฟล์ไปยัง Cloudinary สำเร็จแล้ว');
    } catch (err: any) {
      setErrorMsg(err?.message || 'การอัปโหลดไฟล์ล้มเหลว กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-3 p-2 w-full transition-all">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />

      <div className="relative group cursor-pointer" onClick={handleTriggerFileSelect}>
        {/* Avatar Ring Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>

        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 flex items-center justify-center shadow-md">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="User Avatar"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <User className="w-14 h-14 text-slate-500" />
          )}

          {/* Overlay Hover Icon */}
          <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs">
            <Camera className="w-7 h-7 text-white mb-1 animate-bounce" />
            <span className="text-[11px] font-medium text-slate-200">เปลี่ยนรูป</span>
          </div>

          {/* Uploading Overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center backdrop-blur-sm z-10">
              <Loader2 className="w-7 h-7 text-emerald-400 animate-spin mb-1" />
              <span className="text-[11px] text-emerald-300 font-medium">กำลังอัปโหลด...</span>
            </div>
          )}
        </div>

        {/* Floating Upload Badge */}
        <div className="absolute bottom-1 right-1 bg-emerald-500 hover:bg-emerald-400 text-white p-2 rounded-full shadow-lg border border-slate-900 transition-colors">
          <UploadCloud className="w-4 h-4" />
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={handleTriggerFileSelect}
          disabled={isUploading}
          className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 hover:underline focus:outline-none transition-colors whitespace-nowrap cursor-pointer"
        >
          อัปโหลดรูปโปรไฟล์ใหม่
        </button>
        <p className="text-[11px] text-slate-400 mt-1">
          ไฟล์ .PNG, .JPG, .WEBP ขนาดไม่เกิน 2MB
        </p>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 px-3 py-2 rounded-xl w-full max-w-xs animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-2 rounded-xl w-full max-w-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
