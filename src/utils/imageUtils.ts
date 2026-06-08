export const MAX_IMAGE_SIZE_BYTES = 1024 * 1024;

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg'];

export function isValidImageType(file: File): boolean {
  if (ALLOWED_MIME_TYPES.includes(file.type)) {
    return true;
  }

  const extension = file.name.split('.').pop()?.toLowerCase();

  return extension === 'png' || extension === 'jpeg' || extension === 'jpg';
}

export function isValidImageSize(file: File): boolean {
  return file.size > 0 && file.size <= MAX_IMAGE_SIZE_BYTES;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }

      reject(new Error('Failed to convert image to base64'));
    };

    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };

    reader.readAsDataURL(file);
  });
}
