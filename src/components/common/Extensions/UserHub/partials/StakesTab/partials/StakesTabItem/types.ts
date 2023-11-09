import { UserStakeStatus } from '~types';

export interface StakesTabItemProps {
  title: string;
  date: string;
  stake: React.ReactNode;
  transfer: string;
  status: UserStakeStatus;
}
