// Custom hook for managing image uploads

import { useState } from 'react';

export function useImageUpload() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  return {
    imageFile,
    imagePreview,
    handleImageChange,
    resetImage,
  };
}

