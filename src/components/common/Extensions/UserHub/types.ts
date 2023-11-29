export type UserHubTabList = {
  id: UserHubTabs;
  label: string;
  value: string;
  icon: string;
}[];

export enum UserHubTabs {
  Overview = 0,
  Stakes = 1,
  Transactions = 2,
}
