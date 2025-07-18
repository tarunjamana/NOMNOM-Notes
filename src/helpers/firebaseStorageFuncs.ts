import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import imageCompression from "browser-image-compression";

export const uploadAvatar = async (file: File, uid: string): Promise<string> => {
    if (!file) throw new Error("No file provided for upload");
    
    const options = {
        maxSizeMB: 1, // Compress to max 1MB
        maxWidthOrHeight: 512, // Resize }
    }

    const compressedFile = await imageCompression(file, options);
  const storageRef = ref(storage, `avatars/${uid}/${file.name}`);
  await uploadBytes(storageRef, compressedFile);

  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};