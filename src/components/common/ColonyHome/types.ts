import { BigNumber } from 'ethers';
import { Token, User } from '~types';

export interface UseGetHomeWidgetReturnType {
  activeActions: number;
  allMembers: User[];
  teamColor: string;
  currentTokenBalance: BigNumber;
  nativeToken: Token | undefined;
  membersLoading: boolean;
}
