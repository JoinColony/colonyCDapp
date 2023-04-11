import React, { useState } from 'react';

import { MotionState, MotionVote } from '~utils/colonyMotions';
import { MotionData } from '~types';
import { useAppContext } from '~hooks';
import { ActionHookForm as ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';

import { VoteDetails } from '../VotingWidget';
import RevealWidgetHeading from './RevealWidgetHeading';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.RevealWidget';

interface RevealWidgetProps {
  motionData: MotionData;
  motionState: MotionState;
}

const RevealWidget = ({
  motionData: { voterRecord },
  motionData,
  motionState,
}: RevealWidgetProps) => {
  const { user } = useAppContext();
  const [userVoteRevealed, setUserVoteRevealed] = useState(false);
  const currentVotingRecord = voterRecord.find(
    ({ address }) => address === user?.walletAddress,
  );
  const hasUserVoted = !!currentVotingRecord;
  const handleSuccess = () => {
    setUserVoteRevealed(true);
  };

  return (
    <ActionForm
      actionType={ActionTypes.MOTION_REVEAL_VOTE}
      onSuccess={handleSuccess}
    >
      <>
        <RevealWidgetHeading
          hasUserVoted={hasUserVoted}
          userVoteRevealed={userVoteRevealed}
          vote={MotionVote.Nay} // todo
        />
        <VoteDetails
          motionData={motionData}
          motionState={motionState}
          hasUserVoted={hasUserVoted}
          userVoteRevealed={userVoteRevealed}
        />
      </>
    </ActionForm>
  );
};

RevealWidget.displayName = displayName;

export default RevealWidget;
