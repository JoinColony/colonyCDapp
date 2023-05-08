import React from 'react';
import { defineMessages } from 'react-intl';

import { ColonyMotion } from '~gql';
import { MotionVote } from '~utils/colonyMotions';

import VoteResultsItem from './VoteResultsItem';

import styles from './VoteResults.css';

const displayName =
  'common.ColonyActions.DefaultMotion.FinalizeMotion.VoteResults';

const MSG = defineMessages({
  voteYAY: {
    id: `${displayName}.voteYAY`,
    defaultMessage: `Yes`,
  },
  voteNAY: {
    id: `${displayName}.voteNAY`,
    defaultMessage: `No!`,
  },
  loadingText: {
    id: `${displayName}.loadingText`,
    defaultMessage: 'Loading votes results',
  },
});

interface VoteResultsProps {
  revealedVotes: ColonyMotion['revealedVotes'];
  voterRecord: ColonyMotion['voterRecord'];
}

const VoteResults = ({
  revealedVotes: {
    percentage: { yay: yayVotePercent, nay: nayVotePercent },
  },
  voterRecord,
}: VoteResultsProps) => {
  const yayVoters = voterRecord.filter(({ vote }) => vote === MotionVote.Yay);
  const nayVoters = voterRecord.filter(({ vote }) => vote === MotionVote.Nay);

  return (
    <div className={styles.main}>
      <VoteResultsItem
        value={Number(yayVotePercent)}
        maxValue={100}
        title={MSG.voteYAY}
        voters={yayVoters}
      />
      <VoteResultsItem
        value={Number(nayVotePercent)}
        maxValue={100}
        title={MSG.voteNAY}
        appearance={{ theme: 'disapprove' }}
        voters={nayVoters}
      />
    </div>
  );
};

VoteResults.displayName = displayName;

export default VoteResults;
