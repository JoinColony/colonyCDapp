import { MessageDescriptor } from 'react-intl';

export interface TabItem {
  id: number;
  title: MessageDescriptor | string;
  content?: React.ReactNode;
  notificationNumber?: number;
}

export interface TabsProps {
  initialActiveTab?: number;
  items: TabItem[];
  activeTab: number;
  onTabClick: (_: any, id: number) => void;
  className?: string;
}
