import { useState } from 'react';
import { getImageDataUrl, validateImageFile } from '@/utils/image';

interface UseImageUploadProps {
  onImageChange?: (file: File, preview: string) => void;
  initialImage?: string | null;
}

export const useImageUpload = ({ onImageChange, initialImage }: UseImageUploadProps = {}) => {
  const [preview, setPreview] = useState<string | null>(initialImage ?? null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const errorMessage = validateImageFile(file);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      const dataUrl = await getImageDataUrl(file);
      setPreview(dataUrl);
      setError(null);
      onImageChange?.(file, dataUrl);
    } catch (err) {
      setError('이미지 처리 중 오류가 발생했습니다.');
    }
  };

  const resetImage = () => {
    setPreview(initialImage ?? null);
    setError(null);
  };

  return {
    preview,
    error,
    handleImageChange,
    resetImage,
  };
};
