import React from 'react';

import { useNavigate } from 'react-router-dom';
import { DecisionDialog, DeleteDecisionDialog } from '~common/ColonyDecisions';
import { useDialog } from '~shared/Dialog';
import Button, { ActionButton } from '~shared/Button';
import { useColonyContext, useColonyHasReputation } from '~hooks';
import { ActionTypes } from '~redux';

import { DecisionDataProps } from '../DecisionData';

import { withMeta } from '~utils/actions';

import styles from './DecisionPreviewControls.css';
import { DecisionDraft } from '~utils/decisions';

type DecisionPreviewControlsProps = Omit<DecisionDataProps, 'user'>;

const displayName =
  'common.ColonyDecisions.DecisionPreview.DecisionPreviewControls';

const DecisionPreviewControls = ({
  draftDecision,
}: DecisionPreviewControlsProps) => {
  const { colony } = useColonyContext();
  const colonyAddress = colony?.colonyAddress ?? '';
  const colonyHasReputation = useColonyHasReputation(colonyAddress);
  const openConfirmDeleteDialog = useDialog(DeleteDecisionDialog);
  const openDecisionDialog = useDialog(DecisionDialog);
  const navigate = useNavigate();
  return (
    <div className={styles.buttonContainer}>
      {draftDecision && (
        <>
          <Button
            appearance={{ theme: 'blue', size: 'large' }}
            onClick={() => openConfirmDeleteDialog({ draftDecision })}
            text={{ id: 'button.delete' }}
          />
          <Button
            appearance={{ theme: 'blue', size: 'large' }}
            onClick={() =>
              openDecisionDialog({
                nativeDomainId: draftDecision.motionDomainId,
                draftDecision,
                colonyAddress,
              })
            }
            text={{ id: 'button.edit' }}
          />
        </>
      )}
      <ActionButton
        actionType={ActionTypes.MOTION_CREATE_DECISION}
        values={{
          colonyAddress,
          colonyName: colony?.name,
          // btn disabled if decision is undefined
          draftDecision: draftDecision as DecisionDraft,
        }}
        transform={withMeta({ navigate })}
        appearance={{ theme: 'primary', size: 'large' }}
        text={{ id: 'button.publish' }}
        disabled={!draftDecision || !colonyHasReputation}
      />
    </div>
  );
};

DecisionPreviewControls.displayName = displayName;

export default DecisionPreviewControls;
