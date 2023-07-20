import { MessageDescriptor } from 'react-intl';

export interface InformationListItem {
  title: MessageDescriptor;
  id: string;
}

export interface InformationListProps {
  items: InformationListItem[];
  className?: string;
}
