import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID;
const API_KEY = import.meta.env.VITE_NUTRITIONIX_API_KEY;

interface CommonFood {
    food_name: string;
    photo: {
      thumb: string;
    };
  }
  
  interface BrandedFood {
    food_name: string;
    brand_name: string;
    nix_item_id: string;
    photo: {
      thumb: string;
    };
  }
  
  export interface AutoSuggestionResponse {
    common: CommonFood[];
    branded: BrandedFood[];
  }
export const nutritionApi = createApi({
  reducerPath: "nutritionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://trackapi.nutritionix.com/v2",
    prepareHeaders: (headers) => {
      headers.set("x-app-id", APP_ID);
      headers.set("x-app-key", API_KEY);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAutoSuggestions: builder.query<AutoSuggestionResponse, string>({
      query: (searchTerm: string) => ({
        url: `search/instant?query=${encodeURIComponent(searchTerm)}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetAutoSuggestionsQuery } = nutritionApi;
