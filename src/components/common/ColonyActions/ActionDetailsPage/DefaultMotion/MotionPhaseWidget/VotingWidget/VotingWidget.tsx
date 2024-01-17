import { BigNumber } from 'ethers';
import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { object, number, InferType } from 'yup';

import { useAppContext, useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { MotionVotePayload } from '~redux/sagas/motions/voteMotion';
import { ActionForm, OnSuccess } from '~shared/Fields';
import { MotionAction } from '~types/motions';
import { mapPayload } from '~utils/actions';
import { MotionState } from '~utils/colonyMotions';

import { PollingControls } from '../MotionPhaseWidget';

import {
  VoteDetails,
  VotingPanel,
  useVotingWidgetUpdate,
  VotingWidgetHeading,
} from '.';

import styles from './VotingWidget.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.VotingWidget';

const MSG = defineMessages({
  voteHidden: {
    id: `${displayName}.voteHidden`,
    defaultMessage: `Your vote is hidden from others.\nYou can change your vote.`,
  },
});

const validationSchema = object()
  .shape({
    vote: number().required(),
  })
  .defined();

type VotingFormValues = InferType<typeof validationSchema>;

interface VotingWidgetProps extends PollingControls {
  actionData: MotionAction;
  motionState: MotionState;
}

export const VOTE_FORM_KEY = 'vote';

const VotingWidget = ({
  actionData: {
    pendingColonyMetadata,
    motionData: { nativeMotionDomainId, motionId, voterRecord },
    motionData,
  },
  actionData,
  motionState,
  startPollingAction,
  stopPollingAction,
}: VotingWidgetProps) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const { user } = useAppContext();
  const { hasUserVoted, setHasUserVoted } = useVotingWidgetUpdate(
    voterRecord,
    stopPollingAction,
  );

  const transform = mapPayload(
    ({ vote }) =>
      ({
        colonyAddress,
        userAddress: user?.walletAddress,
        vote: Number(vote),
        motionId: BigNumber.from(motionId),
      } as MotionVotePayload),
  );

  const handleSuccess: OnSuccess<VotingFormValues> = (_, { reset }) => {
    setHasUserVoted(true);
    reset();
    startPollingAction(1000);
  };

  return (
    <div>
      {hasUserVoted && (
        <p className={styles.voteHiddenContainer}>
          <FormattedMessage {...MSG.voteHidden} />
        </p>
      )}
      <ActionForm<VotingFormValues>
        defaultValues={{
          [VOTE_FORM_KEY]: undefined,
        }}
        validationSchema={validationSchema}
        actionType={ActionTypes.MOTION_VOTE}
        transform={transform}
        onSuccess={handleSuccess}
      >
        <div className={styles.main}>
          <VotingWidgetHeading
            actionData={actionData}
            pendingColonyMetadata={pendingColonyMetadata}
          />
          <VotingPanel motionDomainId={Number(nativeMotionDomainId)} />
          <VoteDetails
            motionData={motionData}
            motionState={motionState}
            hasUserVoted={hasUserVoted}
          />
        </div>
      </ActionForm>
    </div>
  );
};

VotingWidget.displayName = displayName;

export default VotingWidget;
