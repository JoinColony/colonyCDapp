import React, { useMemo } from 'react';

import { User } from '~types';
import { VoterRecord } from '~gql';
import {
  calculateLastSliceIndex,
  calculateRemainingItems,
} from '~utils/avatars';
import { useAppContext } from '~hooks';
import UserAvatar from '~shared/UserAvatar';

import { useGetUsers } from './helpers';

import styles from './VoterAvatars.css';

interface VoterAvatarsProps {
  voters: VoterRecord[];
  maxAvatars: number;
}

const displayName =
  'common.ColonyActions.DefaultMotion.FinalizeMotion.VoteResults.VoterAvatars';

const VoterAvatars = ({ voters, maxAvatars }: VoterAvatarsProps) => {
  const remainingAvatarsCount = calculateRemainingItems(maxAvatars, voters);
  const voterAddresses = useMemo(
    // We need a stable reference to this array to avoid an infinite loop in `useGetUsers`
    () =>
      voters
        .map(({ address }) => address)
        .slice(0, calculateLastSliceIndex(maxAvatars, voters)),
    [maxAvatars, voters],
  );

  const { user } = useAppContext();
  const registeredVoters = useGetUsers(voterAddresses);

  const sortedUsers =
    registeredVoters.length > 0 && user
      ? [
          user,
          ...registeredVoters.filter(
            (voter) => voter.walletAddress !== user.walletAddress,
          ),
        ]
      : registeredVoters;

  return (
    <div className={styles.main}>
      <ul className={styles.voterAvatars}>
        {sortedUsers.map((registeredVoter: User) => {
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
