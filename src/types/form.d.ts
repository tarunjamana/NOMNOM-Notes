export interface SignupFormValues {
    firstName: string;
    lastName: string;
    gender: 'male' | 'female' | 'other' | ''; 
    dob: string;
    height: number | '';
    currentWeight: number | ''; 
    targetWeight: number | ''; 
    activityLevel: 'low' | 'moderate' | 'active' | 'veryActive' | ''; 
    email: string;
    password: string;
}
  
export interface LoginFormValues {
    email: string;
    password: string;
}