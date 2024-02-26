import { type JoinedColony, type Colony } from '~types/graphql.ts';

export interface ColonySwitcherContentProps {
  colony?: Colony;
}

export interface UseColonySwitcherContentReturnType {
  loading: boolean;
  filteredColonies: JoinedColony[];
  searchValue: string;
  onSearchValueChange: (value: string) => void;
}
