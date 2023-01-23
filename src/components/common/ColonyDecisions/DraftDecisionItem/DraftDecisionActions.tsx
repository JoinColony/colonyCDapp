import React from 'react';

import Button from '~shared/Button';
import { useDialog } from '~shared/Dialog';
import { DecisionDialog, DeleteDecisionDialog } from '~common/ColonyDecisions';

import { DraftDecisionItemProps } from './DraftDecisionItem';

import styles from './DraftDecisionActions.css';

const displayName = 'common.ColonyDecisions.DraftDecisionActions';

type DraftDecisionActionsProps = DraftDecisionItemProps;

const DraftDecisionActions = ({ decision }: DraftDecisionActionsProps) => {
  const openDeleteDecisionDialog = useDialog(DeleteDecisionDialog);
  const openDecisionDialog = useDialog(DecisionDialog);

  return (
    <div className={styles.buttonContainer}>
      <Button
        appearance={{ theme: 'blue' }}
        text={{ id: 'button.delete' }}
        onClick={(e) => {
          e.stopPropagation();
          openDeleteDecisionDialog({ decision });
        }}
      />
      <Button
        appearance={{ theme: 'blue' }}
        text={{ id: 'button.edit' }}
        onClick={(e) => {
          e.stopPropagation();
          openDecisionDialog({ decision });
        }}
      />
    </div>
  );
};

DraftDecisionActions.displayName = displayName;

export default DraftDecisionActions;
