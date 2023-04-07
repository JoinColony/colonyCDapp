import React from 'react';

import DetailItem from '~shared/DetailsWidget/DetailItem';
import { MotionState } from '~utils/colonyMotions';
import { MotionData } from '~types';

import { useVoteDetailsConfig } from './useVoteDetailsConfig';
import styles from './VoteDetails.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingWidget.VoteDetails';

export interface VoteDetailsProps {
  motionState: MotionState;
  motionData: MotionData;
  hasUserVoted: boolean;
}

const VoteDetails = (props: VoteDetailsProps) => {
  const voteDetailsConfig = useVoteDetailsConfig(props);
  return (
    <div className={styles.main}>
      {voteDetailsConfig.map((config) => (
        <DetailItem {...config} key={config.label} />
      ))}
    </div>
  );
};

VoteDetails.displayName = displayName;

export default VoteDetails;
