import { collection, doc, getDoc , updateDoc } from "firebase/firestore";
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
 
// utils/firestoreHelpers.ts
export const updateEditableFields = async (
  collectionName: string,
  docId: string,
  currentValues: Record<string, any>,
  initialValues: Record<string, any>,
  editableConfig: Record<string, boolean>
) => {
  console.log("initalValues", initialValues);
  console.log("currentValues", currentValues);
  const updates = Object.keys(currentValues).reduce((acc, key) => {
    if (editableConfig[key] && currentValues[key] !== initialValues[key]) {
      acc[key] = currentValues[key];
    }
    return acc;
  }, {} as Record<string, any>);

  if (Object.keys(updates).length > 0) {
    await updateDoc(doc(db, collectionName, docId), updates);
  }

  return updates; // Return the fields that were updated
};