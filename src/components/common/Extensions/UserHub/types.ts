import { MessageDescriptor } from "react-intl";

export type UserHubTabList = {
  id: UserHubTabs;
  label: MessageDescriptor;
  value: UserHubTabs;
  icon: string;
}[];

export enum UserHubTabs {
  Balance = 0,
  Stakes = 1,
  Transactions = 2,
}
