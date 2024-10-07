import AsyncStorage from "@react-native-async-storage/async-storage";
import { create, StateCreator } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Auth } from "../helpers/type";

// Define the state interface
export type UserState = {
  auth: Auth | null;
  login: (auth: Auth) => void;
  logout: () => void;
};

// Create the state slice
const userSlice: StateCreator<UserState, [["zustand/persist", unknown]]> = (
  set
) => ({
  auth: null,
  login: (auth: Auth) => set(() => ({ auth })),
  logout: () => set(() => ({ auth: null })),
});

// Create the store with persistence
export const useUserStore = create<UserState>()(
  persist(userSlice, {
    name: "user-storage",
    storage: createJSONStorage(() => AsyncStorage),
  })
);
