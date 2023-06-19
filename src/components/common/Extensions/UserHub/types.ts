import { TransactionOrMessageGroups } from '~frame/GasStation/transactionGroup';
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
  transactionAndMessageGroups: TransactionOrMessageGroups;
  autoOpenTransaction: boolean;
  setAutoOpenTransaction: React.Dispatch<React.SetStateAction<boolean>>;
  isTranactionTabVisible: boolean;
}

export interface EmptyContentProps {
  contentName: string;
}
