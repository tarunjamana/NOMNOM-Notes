// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_NUTRITIONIX_APP_ID: string;
    readonly VITE_NUTRITIONIX_API_KEY: string;
    // add more variables here if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }