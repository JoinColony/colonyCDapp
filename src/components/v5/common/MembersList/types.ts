import { type MessageDescriptor } from 'react-intl';

import { type ColonyContributor } from '~types/graphql.ts';

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
