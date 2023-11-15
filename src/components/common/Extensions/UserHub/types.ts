import { Appearance } from './partials/TransactionsTab/types';

export interface UserHubMobileProps {
  selectedTab: UserHubTabs;
  onTabChange: (newTab: UserHubTabs) => void;
  tabList: UserHubTabList;
}

export type UserHubTabList = {
  id: UserHubTabs;
  label: string;
  value: string;
  icon: string;
}[];

export interface UserHubProps {
  appearance?: Appearance;
  isTransactionTabVisible: boolean;
}

export enum UserHubTabs {
  Overview = 0,
  Stakes = 1,
  Transactions = 2,
}
