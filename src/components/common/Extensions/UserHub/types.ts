import { type Icon } from '@phosphor-icons/react';

export type UserHubTabList = {
  id: UserHubTabs;
  label: string;
  value: UserHubTabs;
  icon: Icon;
}[];

export enum UserHubTabs {
  Balance = 0,
  Stakes = 1,
  Transactions = 2,
  CryptoToFiat = 3,
}

export interface UserHubProps {
  defaultOpenedTab?: UserHubTabs;
}
