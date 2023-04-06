import React from 'react';

import DetailItem from '~shared/DetailsWidget/DetailItem';
import { MotionState } from '~utils/colonyMotions';

import { useVoteDetailsConfig } from './useVoteDetailsConfig';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingWidget.VoteDetails';

export interface VoteDetailsProps {
  motionState: MotionState;
  motionId: string;
  motionDomainId: string;
  hasUserVoted: boolean;
}

const VoteDetails = (props: VoteDetailsProps) => {
  const voteDetailsConfig = useVoteDetailsConfig(props);
  return (
    <>
      {voteDetailsConfig.map((config) => (
        <DetailItem {...config} key={config.label} />
      ))}
    </>
  );
};

VoteDetails.displayName = displayName;

export default VoteDetails;
