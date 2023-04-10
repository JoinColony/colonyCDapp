import React, { useState } from 'react';
import { BigNumber } from 'ethers';

import { MotionState, MotionVote } from '~utils/colonyMotions';
import { MotionData } from '~types';
import { useAppContext, useColonyContext } from '~hooks';
import { ActionHookForm as ActionForm, OnSuccess } from '~shared/Fields';
import { ActionTypes } from '~redux';
import { mapPayload } from '~utils/actions';
import { RevealMotionPayload } from '~redux/sagas/motions/revealVoteMotion';

import { VoteDetails } from '../VotingWidget';
import RevealWidgetHeading from './RevealWidgetHeading';
import { PollingControls } from '../MotionPhaseWidget';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.RevealWidget';

interface RevealWidgetProps extends PollingControls {
  motionData: MotionData;
  motionState: MotionState;
}

const RevealWidget = ({
  motionData: { voterRecord, motionId },
  motionData,
  motionState,
  startPollingAction,
  stopPollingAction,
}: RevealWidgetProps) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const currentVotingRecord = voterRecord.find(
    ({ address }) => address === user?.walletAddress,
  );
  const hasUserVoted = !!currentVotingRecord;
  const vote = currentVotingRecord?.vote ?? null;
  const [prevVote, setPrevVote] = useState(vote);

  if (vote !== prevVote) {
    stopPollingAction();
    setPrevVote(vote);
  }

  const transform = mapPayload(
    () =>
      ({
        colonyAddress: colony?.colonyAddress,
        userAddress: user?.walletAddress ?? '',
        motionId: BigNumber.from(motionId),
      } as RevealMotionPayload),
  );

  const handleSuccess: OnSuccess<Record<string, any>> = (_, { reset }) => {
    reset();
    startPollingAction(1000);
  };

  return (
    <ActionForm
      actionType={ActionTypes.MOTION_REVEAL_VOTE}
      onSuccess={handleSuccess}
      transform={transform}
    >
      <RevealWidgetHeading hasUserVoted={hasUserVoted} vote={vote} />
      <VoteDetails
        motionData={motionData}
        motionState={motionState}
        hasUserVoted={hasUserVoted}
        userVoteRevealed={!!vote}
      />
    </ActionForm>
  );
};

RevealWidget.displayName = displayName;

export default RevealWidget;
