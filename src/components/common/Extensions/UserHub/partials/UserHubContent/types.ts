export enum UserHubTabs {
  Overview = 0,
  Stakes = 1,
  Transactions = 2,
}

export interface UserHubNavigationItem {
  id: number;
  value: string;
  label: string;
  icon: string;
}

export interface UserHubContentProps {
  isTransactionTabVisible?: boolean;
}
