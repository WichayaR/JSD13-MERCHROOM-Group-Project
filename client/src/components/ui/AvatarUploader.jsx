// src/components/ui/AvatarUploader.jsx
import React, { useRef } from 'react';

export const AvatarUploader = ({ currentAvatar, onUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) await onUpload(file);
  };

  return (
    <div className="flex items-center gap-6 p-5 bg-cream border border-ink rounded-btn">
      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-ink shrink-0 bg-white">
        <img
          src={currentAvatar || 'https://via.placeholder.com/150'}
          alt="Avatar Preview"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 items-start">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-ink text-cream-text font-sans font-bold text-xs tracking-wider px-4 py-2 rounded-btn hover:bg-primary hover:text-white transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          UPLOAD NEW
        </button>
        <span className="text-[11px] font-medium text-muted tracking-wide">
          RECOMMENDED: 400x400PX (PNG, JPG UP TO 2MB)
        </span>
      </div>
    </div>
  );
};