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
  Stakes = 1,
  Transactions = 2,
  CryptoToFiat = 3,
}
