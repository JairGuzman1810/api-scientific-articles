import { create } from "zustand";

type SearchFilterState = {
  search: string;
  filter: string | undefined;
  updateSearch: (search: string) => void;
  updateFilter: (filter: string | undefined) => void;
  clearSearchFilter: () => void;
};

export const useSearchFilterStore = create<SearchFilterState>((set) => ({
  search: "",
  filter: undefined,
  updateSearch: (search) => set({ search }),
  updateFilter: (filter) => set({ filter }),
  clearSearchFilter: () => set({ search: "", filter: undefined }),
}));
