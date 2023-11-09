import { StakesTabItemProps } from '../StakesTabItem/types';

export interface StakesTabContentListItem extends StakesTabItemProps {
  key: string;
}

export interface StakesTabContentListProps {
  items: StakesTabContentListItem[];
}
