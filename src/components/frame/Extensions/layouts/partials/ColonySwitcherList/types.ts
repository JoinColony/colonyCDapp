import { ColonySwitcherItemProps } from '../ColonySwitcherItem';

export interface ColonySwitcherListItem extends ColonySwitcherItemProps {
  key: string;
}

export interface ColonySwitcherListProps {
  items: ColonySwitcherListItem[];
}
