import { MessageDescriptor } from 'react-intl';
import { ContributorWithReputation } from '~types';

export interface MembersListProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  list: ContributorWithReputation[];
  isLoading: boolean;
  emptyTitle: MessageDescriptor;
  emptyDescription: MessageDescriptor;
  viewMoreUrl?: string;
  isContributorsList?: boolean;
}
