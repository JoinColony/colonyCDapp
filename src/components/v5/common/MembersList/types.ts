import { MessageDescriptor } from 'react-intl';
import { Member } from '~types';

export interface MembersListProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  list: Member[];
  isLoading: boolean;
  emptyTitle: MessageDescriptor;
  emptyDescription: MessageDescriptor;
  viewMoreUrl: string;
  isHomePage: boolean;
}
