import { type UserHubTab } from '~common/Extensions/UserHub/types.ts';

export interface BalanceTabProps {
  onTabChange: (newTab: UserHubTab) => void;
}
