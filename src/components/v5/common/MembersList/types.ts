import { MessageDescriptor } from 'react-intl';
import { ColonyContributor } from '~types';

export interface MembersListProps {
  title: MessageDescriptor;
  description: MessageDescriptor;
  list: ColonyContributor[];
  isLoading: boolean;
  emptyTitle: MessageDescriptor;
  emptyDescription: MessageDescriptor;
  viewMoreUrl?: string;
  isContributorsList?: boolean;
}
