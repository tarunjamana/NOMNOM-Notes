import { doc, getDoc , updateDoc,DocumentData,WithFieldValue,DocumentReference } from "firebase/firestore";
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
 
export const updateEditableFields = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  currentValues: T,
  initialValues: T,
  editableConfig: Partial<Record<keyof T, boolean>>
): Promise<Partial<T>> => {
  const updates: Partial<T> = {};

  // Type-safe iteration over editable fields only
  (Object.keys(editableConfig) as Array<keyof T>).forEach((key) => {
    if (editableConfig[key] && currentValues[key] !== initialValues[key]) {
      updates[key] = currentValues[key];
    }
  });

  if (Object.keys(updates).length > 0) {
    // Create a properly typed document reference
    const docRef = doc(db, collectionName, docId) as DocumentReference<T>;
    await updateDoc(docRef, updates as WithFieldValue<T>);
  }

  return updates;
};