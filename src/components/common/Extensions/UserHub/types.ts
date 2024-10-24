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
  Notifications = 1,
  Transactions = 2,
  Stakes = 3,
  CryptoToFiat = 4,
}
