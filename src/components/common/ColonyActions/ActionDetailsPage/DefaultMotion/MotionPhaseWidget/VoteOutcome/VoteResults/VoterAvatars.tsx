import React from 'react';

import { User } from '~types';
import { useUserAvatars } from '~hooks/useUserAvatars';
import UserAvatar from '~shared/UserAvatar';
import { UserAvatarsItem } from '~v5/shared/UserAvatars/types';
import styles from './VoterAvatars.css';

interface VoterAvatarsProps {
  voters: UserAvatarsItem[];
  maxAvatars: number;
}

const displayName =
  'common.ColonyActions.DefaultMotion.FinalizeMotion.VoteResults.VoterAvatars';

const VoterAvatars = ({ voters, maxAvatars }: VoterAvatarsProps) => {
  const { registeredUsers, remainingAvatarsCount } = useUserAvatars(
    maxAvatars,
    voters,
  );

  return (
    <div className={styles.main}>
      <ul className={styles.voterAvatars}>
        {registeredUsers.map((registeredVoter: User) => {
          return (
            <li
              className={styles.voterAvatar}
              key={registeredVoter.walletAddress}
            >
              <UserAvatar size="xs" user={registeredVoter} />
            </li>
          );
        })}
      </ul>
      {!!remainingAvatarsCount && (
        <span className={styles.remaningAvatars}>
          {remainingAvatarsCount < 99 ? `+${remainingAvatarsCount}` : `+99`}
        </span>
      )}
    </div>
  );
};

VoterAvatars.displayName = displayName;

export default VoterAvatars;
