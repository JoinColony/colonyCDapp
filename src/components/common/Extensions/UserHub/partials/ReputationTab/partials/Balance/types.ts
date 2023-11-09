import { Token, ColonyWallet } from '~types';
import { UserHubTabs } from '../../../UserHubContent/types';

export interface BalanceProps {
  nativeToken: Token;
  wallet: ColonyWallet;
  className?: string;
  onTabChange: (newTab: UserHubTabs) => void;
}
