import { MessageDescriptor } from 'react-intl';

export interface TabItem {
  id: number;
  title: MessageDescriptor | string;
  content: React.ReactNode;
}

export interface TabsProps {
  initialActiveTab?: number;
  items: TabItem[];
}
