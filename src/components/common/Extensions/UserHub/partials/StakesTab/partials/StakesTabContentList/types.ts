import { StakesTabItemProps } from '../StakesTabItem/types';

export interface StakesTabContentListItem extends StakesTabItemProps {
  key: string;
  motionDataId: string;
}

export interface StakesTabContentListProps {
  items: StakesTabContentListItem[];
}
