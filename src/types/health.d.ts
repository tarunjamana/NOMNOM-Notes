export interface WaterLog {
    date: string; // YYYY-MM-DD
    totalIntake: number;
    goal: number;
}
  
export interface WeightEntry {
    weight: number;
    loggedAt: string; //ISO date string
}

