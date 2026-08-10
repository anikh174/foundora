import { extractError } from "./api";

export const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_UPLOAD_API;

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async (file, { onProgress } = {}) => {
  if (!file) throw new Error("Please select an image first");

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed");
  }

  if (file.size > 4 * 1024 * 1024) {
    throw new Error("Image must be smaller than 4MB");
  }

  const base64 = await fileToBase64(file);
  const body = new URLSearchParams();
  body.append("key", IMGBB_API_KEY);
  body.append("image", base64.split(",")[1] || base64);

  if (onProgress) onProgress(40);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(extractError(data, "Image upload failed. Please try again."));
  }

  if (onProgress) onProgress(100);
  return data.data.url;
};
