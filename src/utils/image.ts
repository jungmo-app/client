export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const validateImageFile = (file: File, size?: number): string | null => {
  if (!file) return '이미지를 선택해주세요.';
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return '지원하지 않는 파일 형식입니다.';
  if (size && file.size > size * 1024 * 1024) return `파일 크기는 ${size}MB 이하여야 합니다.`;
  return null;
};

export const getImageDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
