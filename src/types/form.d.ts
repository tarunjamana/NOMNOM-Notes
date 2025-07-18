export interface SignupFormValues {
    firstName: string;
    lastName: string;
    gender: 'male' | 'female' | 'other' | ''; // enum-like
    dob: string; // ISO string for dates, works well with <input type="date" />
    height: number | ''; // in cm
    currentWeight: number | ''; // in kg
    targetWeight: number | ''; // in kg
    activityLevel: 'low' | 'moderate' | 'active' | 'veryActive' | ''; // select options
    email: string;
    password: string;
}
  
export interface LoginFormValues {
    email: string;
    password: string;
}