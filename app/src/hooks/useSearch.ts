import { useSearchFilterStore } from "../store/search";

export const useSearch = () => {
  const search = useSearchFilterStore((state) => state.search);
  const filter = useSearchFilterStore((state) => state.filter);
  const updateSearch = useSearchFilterStore((state) => state.updateSearch);
  const updateFilter = useSearchFilterStore((state) => state.updateFilter);
  const clearSearchFilter = useSearchFilterStore(
    (state) => state.clearSearchFilter
  );

  return { search, filter, updateSearch, updateFilter, clearSearchFilter };
};
