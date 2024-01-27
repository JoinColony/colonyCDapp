import { ColonySwitcherItemProps } from '../ColonySwitcherItem/index.ts';

export interface ColonySwitcherListItem extends ColonySwitcherItemProps {
  key: string;
}

export interface ColonySwitcherListProps {
  items: ColonySwitcherListItem[];
}
