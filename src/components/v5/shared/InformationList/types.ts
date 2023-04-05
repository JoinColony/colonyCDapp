import { MessageDescriptor } from 'react-intl';

export interface InformationListItemProps {
  title: MessageDescriptor;
  id: string;
}

export interface InformationListProps {
  items: InformationListItemProps[];
  className?: string;
}
