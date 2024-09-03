import { type Icon } from '@phosphor-icons/react';

import { type FeatureFlag } from '~context/FeatureFlagsContext/types.ts';

export type UserHubTabList = {
  id: UserHubTab;
  label: string;
  value: UserHubTab;
  icon: Icon;
  featureFlag?: FeatureFlag;
}[];

export enum UserHubTab {
  Balance = 0,
  Reputation = 1,
  Stakes = 2,
  CryptoToFiat = 3,
  Transactions = 4,
}

export interface UserHubProps {
  defaultOpenedTab?: UserHubTab;
}
