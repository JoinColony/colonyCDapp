import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { object, number, InferType } from 'yup';

import { ActionHookForm as ActionForm } from '~shared/Fields';
import { ActionTypes } from '~redux';

import { ColonyActionType } from '~gql';
import { MotionData } from '~types';
import { MotionState } from '~utils/colonyMotions';
import { VoteDetails, VotingPanel, VotingWidgetHeading } from '.';

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

interface VotingWidgetProps {
  actionType: ColonyActionType;
  motionData: MotionData;
  motionState: MotionState;
}

export const VOTE_FORM_KEY = 'vote';

const VotingWidget = ({
  actionType,
  motionData: { motionId, motionDomainId },
  motionState,
}: VotingWidgetProps) => {
  const hasUserVoted = false;
  return (
    <>
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
        // transform={transform}
        // onSuccess={handleSuccess}
      >
        <div className={styles.main}>
          <VotingWidgetHeading actionType={actionType} />
          <VotingPanel />
          <VoteDetails
            motionId={motionId}
            motionState={motionState}
            motionDomainId={motionDomainId}
            hasUserVoted={false}
          />
        </div>
      </ActionForm>
    </>
  );
};

VotingWidget.displayName = displayName;

export default VotingWidget;
