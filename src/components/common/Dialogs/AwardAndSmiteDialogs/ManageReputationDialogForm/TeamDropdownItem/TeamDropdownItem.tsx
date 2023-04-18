import React from 'react';
import { useFormContext } from 'react-hook-form';

import ColorTag from '~shared/ColorTag';
import { Heading4 } from '~shared/Heading';
import MemberReputation from '~shared/MemberReputation';
import { Domain } from '~types';
import { DomainColor } from '~gql';
import { useUserReputation } from '~hooks';

import styles from './TeamDropdownItem.css';

interface Props {
  domain: Omit<Domain, 'createdAt' | 'updatedAt'> | null;
  colonyAddress: string;
}

const displayName = `common.SmiteDialog.TeamDropdownItem`;

const TeamDropdownItem = ({ domain, colonyAddress }: Props) => {
  const { watch } = useFormContext();
  const user = watch('user');
  const { userReputation, totalReputation } = useUserReputation(colonyAddress, user?.walletAddress, domain?.nativeId);

  return (
    <div className={styles.main}>
      <div className={styles.color}>
        <ColorTag color={domain?.metadata?.color || DomainColor.LightPink} />
      </div>
      <div className={styles.headingWrapper}>
        <Heading4 appearance={{ margin: 'none', theme: 'dark' }} text={domain?.metadata?.name || ''} />
      </div>
      {user && <MemberReputation userReputation={userReputation} totalReputation={totalReputation} />}
    </div>
  );
};

TeamDropdownItem.displayName = displayName;

export default TeamDropdownItem;
