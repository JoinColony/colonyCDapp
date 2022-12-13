import React, { ReactNode } from 'react';

import ListGroup, { ListGroupAppearance } from '~shared/ListGroup';
import { Colony, Watcher, Contributor } from '~types';

import MembersListItem from './MembersListItem';
import { notNull } from '~utils/arrays';

interface Props {
  colony: Colony;
  users: (Watcher | Contributor)[];
  listGroupAppearance?: ListGroupAppearance;
  canAdministerComments?: boolean;
  extraItemContent?: (user: (Contributor | Watcher)['user']) => ReactNode;
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
      {users.filter(notNull).map((member: Watcher | Contributor) => (
        <MembersListItem
          colony={colony}
          extraItemContent={extraItemContent}
          key={member.user?.walletAddress}
          showUserInfo={showUserInfo}
          showUserReputation={showUserReputation}
          member={member}
          canAdministerComments={canAdministerComments}
        />
      ))}
    </ListGroup>
  );
};

MembersList.displayName = displayName;

export default MembersList;
