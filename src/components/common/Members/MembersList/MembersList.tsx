import React, { ReactNode } from 'react';

import ListGroup, { ListGroupAppearance } from '~shared/ListGroup';
import { notNull } from '~utils/arrays';

import MembersListItem from './MembersListItem';

interface Props {
  members: any[];
  listGroupAppearance?: ListGroupAppearance;
  extraItemContent?: (user: any) => ReactNode;
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
          key={member.address}
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
