export interface WaterLog {
    date: string; // YYYY-MM-DD
    totalIntake: number;
    goal: number;
}
  
export interface WeightEntry {
    weight: number;
    loggedAt: string; //ISO date string
}


export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export interface FoodItem {
    id: string;
    name: string;
    servingQty: number;
    servingUnit: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    timeLogged: string;
}
  

export interface APIFoodItem{
    food_name: string;
}