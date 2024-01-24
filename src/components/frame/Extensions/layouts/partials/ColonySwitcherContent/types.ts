import { Colony } from '~types/graphql';

import { ColonySwitcherListItem } from '../ColonySwitcherList/types';

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
