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

// Define your root state type
export type RootState = {
  user: ReturnType<typeof userReducer>;
  userProfile: ReturnType<typeof userProfileReducer>;
};

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'userProfile'],
};

// Combine reducers first
const rootReducer = combineReducers({
  user: userReducer,
  userProfile: userProfileReducer,
});

// Then persist the combined reducer
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const appStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(appStore);

// Export the types

export type AppDispatch = typeof appStore.dispatch;