import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

const uploadImageToFirebase = async (file) => {
  try {
    const storageRef = ref(storage, `Imgs${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(snapshot.ref);
    console.log("Image uploaded successfully. URL:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image to Firebase:", error);
    throw error;
  }
};

export { uploadImageToFirebase };
