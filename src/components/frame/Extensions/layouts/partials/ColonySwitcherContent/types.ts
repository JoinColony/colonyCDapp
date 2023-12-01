import { ColonyFragment } from '~gql';
import { ColonySwitcherListItem } from '../ColonySwitcherList/types';

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
  colony?: ColonyFragment;
  searchValue: string;
  currentColonyProps: CurrentColonyProps;
}
