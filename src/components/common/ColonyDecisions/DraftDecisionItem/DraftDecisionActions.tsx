import React from 'react';

import { DecisionDialog, DeleteDecisionDialog } from '~common/ColonyDecisions';
import { useColonyContext } from '~hooks';
import Button from '~shared/Button';
import { useDialog } from '~shared/Dialog';

import { DraftDecisionItemProps } from './DraftDecisionItem';

import styles from './DraftDecisionActions.css';

const displayName = 'common.ColonyDecisions.DraftDecisionActions';

type DraftDecisionActionsProps = DraftDecisionItemProps;

const DraftDecisionActions = ({ draftDecision }: DraftDecisionActionsProps) => {
  const {
    colony: { colonyAddress },
  } = useColonyContext();
  const openDeleteDecisionDialog = useDialog(DeleteDecisionDialog);
  const openDecisionDialog = useDialog(DecisionDialog);

  return (
    <div className={styles.buttonContainer}>
      <Button
        appearance={{ theme: 'blue' }}
        text={{ id: 'button.delete' }}
        onClick={(e) => {
          e.stopPropagation();
          openDeleteDecisionDialog({ draftDecision });
        }}
      />
      <Button
        appearance={{ theme: 'blue' }}
        text={{ id: 'button.edit' }}
        onClick={(e) => {
          e.stopPropagation();
          openDecisionDialog({
            draftDecision,
            colonyAddress,
          });
        }}
      />
    </div>
  );
};

DraftDecisionActions.displayName = displayName;

export default DraftDecisionActions;
