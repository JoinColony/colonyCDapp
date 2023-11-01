import { tabList } from './consts';
import { Appearance } from './partials/TransactionsTab/types';

export interface UserHubMobileProps {
  selectedTab: number;
  handleChange: (id: number) => void;
  tabList: TabListProps;
}

export type TabListProps = typeof tabList;

export interface UserHubProps {
  appearance?: Appearance;
  isTransactionTabVisible: boolean;
}
