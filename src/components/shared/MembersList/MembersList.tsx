import React, { ReactNode } from 'react';

import ListGroup, { ListGroupAppearance } from '~shared/ListGroup';
import { User, Colony, WatcherFragment, ContributorFragment } from '~gql';

import MembersListItem from './MembersListItem';

interface Props {
  colony: Colony;
  users: (WatcherFragment | ContributorFragment)[];
  listGroupAppearance?: ListGroupAppearance;
  canAdministerComments?: boolean;
  extraItemContent?: (user: User) => ReactNode;
  showUserInfo?: boolean;
  showUserReputation?: boolean;
}

const displayName = 'MembersList';

const MembersList = ({
  colony,
  extraItemContent,
  showUserInfo = true,
  showUserReputation = true,
  users,
  listGroupAppearance,
  canAdministerComments,
}: Props) => {
  return (
    <ListGroup appearance={listGroupAppearance}>
      {users.map((member: WatcherFragment | ContributorFragment) => (
        <MembersListItem
          colony={colony}
          extraItemContent={extraItemContent}
          key={member.user?.walletAddress}
          showUserInfo={showUserInfo}
          showUserReputation={showUserReputation}
          user={member}
          canAdministerComments={canAdministerComments}
        />
      ))}
    </ListGroup>
  );
};

MembersList.displayName = displayName;

export default MembersList;
