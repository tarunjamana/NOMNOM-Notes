import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./appStore";
import { PersistedState } from "./types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Optional: If you need to specifically type the persisted state
export const usePersistedSelector: TypedUseSelectorHook<PersistedState> = useSelector;