import { type MessageDescriptor } from 'react-intl';

export enum ExtensionPageTabId {
  Overview = 0,
  Settings = 1,
}

export interface TabItem {
  id: ExtensionPageTabId;
  type?: string;
  title: MessageDescriptor | string;
  content?: React.ReactNode;
  notificationNumber?: number;
}

export interface TabsProps {
  initialActiveTab?: ExtensionPageTabId;
  items: TabItem[];
  activeTab: number;
  onTabClick: (_: React.BaseSyntheticEvent, id: ExtensionPageTabId) => void;
  className?: string;
}
