import { Dispatch, SetStateAction } from 'react';
import { BigNumber } from 'ethers';
import { Token, User, Domain } from '~types';

export interface ChartData {
  id: string;
  label: string;
  value: number;
  color: string;
  stroke: string;
}

export interface UseGetHomeWidgetReturnType {
  activeActions: number;
  allMembers: User[];
  teamColor: string;
  currentTokenBalance: BigNumber;
  nativeToken: Token | undefined;
  membersLoading: boolean;
  chartColors?: string[];
  chartData?: ChartData[];
  allTeams?: Domain[];
  otherTeamsReputation?: number;
  hoveredSegment?: ChartData | null;
  setHoveredSegment: Dispatch<SetStateAction<ChartData | null | undefined>>;
}
