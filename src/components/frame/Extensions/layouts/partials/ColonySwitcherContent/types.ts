import { Colony } from '~types';

import { ColonySwitcherListItem } from '../ColonySwitcherList/types';

export interface ColonySwitcherContentProps {
  colony?: Colony;
}

interface CurrentColonyProps {
  name?: string;
  colonyDisplayName?: string;
  chainIconName?: string;
}

export interface UseColonySwitcherContentReturnType {
  userLoading?: boolean;
  filteredColony: ColonySwitcherListItem[];
  onChange: (value: string) => void;
  joinedColonies: ColonySwitcherListItem[];
  colony?: Colony;
  searchValue: string;
  currentColonyProps: CurrentColonyProps;
}
