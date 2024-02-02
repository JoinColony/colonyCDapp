export interface SearchInputProps {
  onSearchButtonClick: () => void;
  setSearchValue: (value: string) => void;
  searchValue: string;
  searchInputPlaceholder: string;
}
