import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import userProfileReducer from "./slices/userProfileSlice";
import { 
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { waterApi } from "./services/waterApi";
import { weightTrackerApi } from "./services/weightTrackerApi";
import { nutritionApi } from "./services/nutritionApi";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'userProfile'],
};

// Combine reducers first
const rootReducer = combineReducers({
  user: userReducer,
  userProfile: userProfileReducer,
  [waterApi.reducerPath]: waterApi.reducer,
  [weightTrackerApi.reducerPath]: weightTrackerApi.reducer,
  [nutritionApi.reducerPath]: nutritionApi.reducer
});

// ✅ Type-safe: Let TypeScript infer the type correctly
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const appStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(waterApi.middleware).concat(weightTrackerApi.middleware).concat(nutritionApi.middleware),
});

export const persistor = persistStore(appStore);

// Infer the root state from the store itself
export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
