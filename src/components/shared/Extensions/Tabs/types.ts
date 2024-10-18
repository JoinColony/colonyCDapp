import { type MessageDescriptor } from 'react-intl';

export interface TabItem {
  id: number;
  type?: string;
  title: MessageDescriptor | string;
  content?: React.ReactNode;
  notificationNumber?: number;
}

export interface TabsProps {
  initialActiveTab?: number;
  items: TabItem[];
  activeTab: number;
  onTabClick: (_: React.BaseSyntheticEvent, id: number) => void;
  className?: string;
  upperContainerClassName?: string;
  showTabs?: boolean;
}
