import React from 'react';

import ColorTag from '~shared/ColorTag';
import { Heading4 } from '~shared/Heading';
import MemberReputation from '~shared/MemberReputation';
import { User, Domain } from '~types';
import { DomainColor } from '~gql';

import styles from './TeamDropdownItem.css';

interface Props {
  domain: Omit<Domain, 'createdAt' | 'updatedAt'> | null;
  user: User | null;
  userReputation: string | undefined;
  totalReputation: string | undefined;
}

const displayName = `common.SmiteDialog.TeamDropdownItem`;

const TeamDropdownItem = ({
  domain,
  user,
  userReputation,
  totalReputation,
}: Props) => (
  <div className={styles.main}>
    <div className={styles.color}>
      <ColorTag color={domain?.metadata?.color || DomainColor.LightPink} />
    </div>
    <div className={styles.headingWrapper}>
      <Heading4
        appearance={{ margin: 'none', theme: 'dark' }}
        text={domain?.metadata?.name || ''}
      />
    </div>
    {user && (
      <MemberReputation
        userReputation={userReputation}
        totalReputation={totalReputation}
      />
    )}
  </div>
);

TeamDropdownItem.displayName = displayName;

export default TeamDropdownItem;
