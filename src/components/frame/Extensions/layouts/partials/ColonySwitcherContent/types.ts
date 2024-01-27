import { Colony } from '~types/graphql.ts';

import { ColonySwitcherListItem } from '../ColonySwitcherList/types.ts';

export interface ColonySwitcherContentProps {
  colony?: Colony;
}

export interface UseColonySwitcherContentReturnType {
  loading: boolean;
  filteredListItems: ColonySwitcherListItem[];
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  currentColonyItem?: ColonySwitcherListItem;
}
