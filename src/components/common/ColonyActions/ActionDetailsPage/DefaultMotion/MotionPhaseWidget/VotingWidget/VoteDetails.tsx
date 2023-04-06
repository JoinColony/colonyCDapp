import React from 'react';

import DetailItem from '~shared/DetailsWidget/DetailItem';
import { MotionState } from '~utils/colonyMotions';

import { useVoteDetailsConfig } from './useVoteDetailsConfig';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingWidget.VoteDetails';

export interface VoteDetailsProps {
  motionState: MotionState;
  button: JSX.Element;
}

const VoteDetails = ({ motionState, button }: VoteDetailsProps) => {
  const voteDetailsConfig = useVoteDetailsConfig(motionState, button);
  return voteDetailsConfig.map((config) => (
    <DetailItem {...config} key={config.label.id} />
  ));
};

VoteDetails.displayName = displayName;

export default VoteDetails;
