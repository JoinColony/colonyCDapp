import { BigNumber } from 'ethers';
import { Token } from '~types';
import { UserAvatarsItem } from '~v5/shared/UserAvatars/types';

export interface UseGetHomeWidgetReturnType {
  activeActions: number;
  allMembers: UserAvatarsItem[];
  teamColor: string;
  currentTokenBalance: BigNumber;
  nativeToken: Token | undefined;
  membersLoading: boolean;
}
