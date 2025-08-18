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
  thumbnailUrl?: string; // Optional thumbnail URL
}
  

export interface APIFoodItem{
    food_name: string;
    serving_qty?: number;
    serving_unit?: string;
    nix_item_id?: string; 
    brand_name?: string; 
}

 interface BaseFoodItem {
    food_name: string;
    brand_name: string | null;
    serving_qty: number;
    serving_unit: string;
    serving_weight_grams: number;
    nf_calories: number;
    nf_total_fat: number;
    nf_saturated_fat: number | null;
    nf_cholesterol: number | null;
    nf_sodium: number;
    nf_total_carbohydrate: number;
    nf_dietary_fiber: number;
    nf_sugars: number;
    nf_protein: number;
    nf_potassium: number;
    nf_p: number | null;
    full_nutrients: {
      attr_id: number;
      value: number;
    }[];
    photo: {
      thumb: string;
      highres?: string | null;
      is_user_uploaded: boolean;
    };
    lat: number | null;
    lng: number | null;
    source: number;
    ndb_no: string | number | null;
    metadata: Record<string, unknown>;
    alt_measures: {
      serving_weight: number;
      measure: string;
      seq: number | null;
      qty: number;
    }[] | null;
  }
  

   interface NaturalSearchItem extends BaseFoodItem {
    consumed_at: string;
    tags: {
      item: string;
      measure: string;
      quantity: string;
      food_group: number;
      tag_id: number;
    };
    meal_type: number;
    sub_recipe: unknown;
    class_code: string | null;
    brick_code: string | null;
    tag_id: string | null;
  }
  

   interface BrandedSearchItem extends BaseFoodItem {
    nix_brand_name: string;
    nix_brand_id: string;
    nix_item_name: string;
    nix_item_id: string;
    updated_at: string;
    nf_metric_qty: number;
    nf_metric_uom: string;
    nf_ingredient_statement: string;
    class_code: string | null;
    brick_code: string | null;
    tag_id: string | null;
    note: string | null;
  }
  
  export interface NaturalFoodSearchResponse {
    foods: NaturalSearchItem[];
  }
  
  export interface BrandedFoodSearchResponse {
    foods: BrandedSearchItem[];
  }
  