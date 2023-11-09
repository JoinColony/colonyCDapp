import { StakesTabContentListItem } from '../StakesTabContentList/types';

export interface ClaimAllButtonProps {
  colonyAddress: string;
  claimableStakes: StakesTabContentListItem[];
  updateClaimedStakesCache: (stakesIds: string[]) => void;
}
