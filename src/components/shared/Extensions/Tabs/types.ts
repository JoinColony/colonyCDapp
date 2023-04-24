import { MessageDescriptor } from 'react-intl';
import { TabsProps as ReactTabsProps } from 'react-tabs';

export interface TabItem {
  id: string;
  title: MessageDescriptor | string;
  content: React.ReactNode;
}

export interface TabsProps extends ReactTabsProps {
  items: TabItem[];
}
