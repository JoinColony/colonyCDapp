import { ColonyFragment } from '~gql';
import { ColonySwitcherListItem } from '../ColonySwitcherList/types';

export interface ColonySwitcherContentProps {
  colony?: ColonyFragment;
}

export interface UseColonySwitcherContentReturnType {
  userLoading?: boolean;
  filteredColony: ColonySwitcherListItem[];
  name?: string;
  chainIcon?: string;
  onInput: React.ChangeEventHandler<HTMLInputElement>;
  joinedColonies: ColonySwitcherListItem[];
  colony?: ColonyFragment;
  searchValue: string;
}
