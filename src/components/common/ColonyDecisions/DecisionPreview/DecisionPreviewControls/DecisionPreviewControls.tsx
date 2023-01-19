import React from 'react';
// import { defineMessages } from 'react-intl';

import { DecisionDialog, DeleteDecisionDialog } from '~common/ColonyDecisions';
import { useDialog } from '~shared/Dialog';
import Button, { ActionButton } from '~shared/Button';
import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';

import { DecisionDataProps } from '../DecisionData/DecisionData';

import styles from './DecisionPreviewControls.css';

type DecisionPreviewControlsProps = Omit<DecisionDataProps, 'user'>;

const displayName =
  'common.ColonyDecisions.DecisionPreview.DecisionPreviewControls';

const DecisionPreviewControls = ({
  decision,
  setDecision,
}: DecisionPreviewControlsProps) => {
  const { colony } = useColonyContext();
  const colonyAddress = colony?.colonyAddress;

  const openConfirmDeleteDialog = useDialog(DeleteDecisionDialog);
  const openDecisionDialog = useDialog(DecisionDialog);

  return (
    <div className={styles.buttonContainer}>
      {decision && (
        <>
          <Button
            appearance={{ theme: 'blue', size: 'large' }}
            onClick={() =>
              openConfirmDeleteDialog({
                decision,
              })
            }
            text={{ id: 'button.delete' }}
          />
          <Button
            appearance={{ theme: 'blue', size: 'large' }}
            onClick={() =>
              openDecisionDialog({
                ethDomainId: decision.motionDomainId,
                handleSubmit: setDecision,
              })
            }
            text={{ id: 'button.edit' }}
          />
        </>
      )}
      <ActionButton
        submit={ActionTypes.MOTION_CREATE_DECISION}
        error={ActionTypes.MOTION_CREATE_DECISION_ERROR}
        success={ActionTypes.MOTION_CREATE_DECISION_SUCCESS}
        values={{
          colonyAddress,
          colonyName: colony?.name,
          decisionTitle: decision?.title,
          decisionDescription: decision?.description,
          motionDomainId: decision?.motionDomainId,
        }}
        appearance={{ theme: 'primary', size: 'large' }}
        text={{ id: 'button.publish' }}
        disabled={!decision}
      />
    </div>
  );
};

DecisionPreviewControls.displayName = displayName;

export default DecisionPreviewControls;
