import { doc, getDoc , updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { UserProfile } from "../types/user";

export const getUserById = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return null;

  const data = userSnap.data();

  // Basic validation to match required UserProfile fields
  const requiredFields = [
    "uid",
    "firstName",
    "lastName",
    "gender",
    "dob",
    "height",
    "currentWeight",
    "targetWeight",
    "activityLevel",
    "email",
  ];

  const isValid = requiredFields.every((field) => typeof data[field] === "string");

  if (!isValid) {
    console.warn("Invalid user profile data format:", data);
    return null;
  }

  return data as UserProfile;
};


export const updateUserAvatarInFirestore = async (uid: string, photoURL: string): Promise<void> => { 
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { photoURL });
 }