interface UploadImage {
  uri: string;
  mimeType?: string;
  fileName?: string;
}

// For web browser File upload
export const uploadFileToCloudinary = async (file: File): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary environment variables are missing.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Upload failed");
    }

    return result.secure_url as string;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

// For React Native (if the project also uses RN or Expo)
export const uploadImageToCloudinary = async (
  image: UploadImage
): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary environment variables are missing.");
  }

  const data = new FormData();

  // When using FormData entries in React Native, the shape is different
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data.append("file", {
    uri: image.uri,
    type: image.mimeType || "image/jpeg",
    name: image.fileName || "upload.jpg",
  } as any);

  data.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Upload failed");
    }

    return result.secure_url as string;
  } catch (error) {
    console.error("Cloudinary upload error (RN):", error);
    throw error;
  }
};
