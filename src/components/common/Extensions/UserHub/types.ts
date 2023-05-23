import { tabList } from './consts';

export interface UserHubMobileProps {
  selectedTab: number;
  handleChange: (id: number) => void;
  tabList: TabListProps;
}

export type TabListProps = typeof tabList;
