import React, { ReactNode } from 'react';

import ListGroup, { ListGroupAppearance } from '~shared/ListGroup';
import { Member, MemberUser } from '~types';
import { notNull } from '~utils/arrays';

import MembersListItem from './MembersListItem';

interface Props {
  members: Member[];
  listGroupAppearance?: ListGroupAppearance;
  extraItemContent?: (user: MemberUser) => ReactNode;
  showUserInfo?: boolean;
  showUserReputation?: boolean;
}

const displayName = 'MembersList';

const MembersList = ({
  extraItemContent,
  showUserInfo = true,
  showUserReputation = true,
  members,
  listGroupAppearance,
}: Props) => {
  return (
    <ListGroup appearance={listGroupAppearance}>
      {members.filter(notNull).map((member) => (
        <MembersListItem
          extraItemContent={extraItemContent}
          key={member.user?.walletAddress}
          showUserInfo={showUserInfo}
          showUserReputation={showUserReputation}
          member={member}
        />
      ))}
    </ListGroup>
  );
};

MembersList.displayName = displayName;

export default MembersList;
