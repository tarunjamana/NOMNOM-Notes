export interface UserState { 
    uid: string; // Firebase user ID
    displayName: string; // Full name of the user
    firstName: string;
    lastName: string; 
    email: string;
    isLoggedIn: boolean;
}

export interface UserProfile {
    uid: string;
    firstName: string;
    lastName: string;
    gender: string;
    dob: string; 
    height: string; 
    currentWeight: string;
    targetWeight: string;
    activityLevel: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
    photoURL?: string;
    bio?: string;
    interests?: string[];
    [key: string]: unknown; // Support for future dynamic fields
  }
  
  export type Interest = {
    id: string;
    name: string;
  };