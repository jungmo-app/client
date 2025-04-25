import { useCallback, useState } from 'react';
import { getImageDataUrl, validateImageFile } from '@/utils/image';

interface UseImageUploadProps {
  initialImage?: string | null;
}

export const useImageUpload = ({ initialImage }: UseImageUploadProps = {}) => {
  const [preview, setPreview] = useState<string>(initialImage ?? '/sample.jpg');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const errorMessage = validateImageFile(file);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      const dataUrl = await getImageDataUrl(file);
      setFile(file);
      setPreview(dataUrl);
      setError(null);
    } catch (err) {
      setError('이미지 처리 중 오류가 발생했습니다.');
    }
  }, []);

  const resetImage = useCallback(() => {
    setPreview(initialImage ?? 'sample.jpg');
    setFile(null);
    setError(null);
  }, [initialImage]);

  return {
    file,
    preview,
    error,
    handleImageChange,
    resetImage,
  };
};
