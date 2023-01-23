import React, { useState } from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '~shared/Button';
import Dialog, { DialogSection } from '~shared/Dialog';
import { Heading3 } from '~shared/Heading';
import { Decision } from '~types';
import { DECISIONS_PREVIEW_ROUTE_SUFFIX as DECISIONS_PREVIEW } from '~routes';
import { removeDecisionFromLocalStorage } from '~utils/decisions';

import styles from './DeleteDecisionDialog.css';

const displayName = 'common.ColonyDecisions.DeleteDecisionDialog';

const MSG = defineMessage({
  title: {
    id: `${displayName}.title`,
    defaultMessage: 'Delete draft Decision',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: 'Are you sure you want to delete this draft Decision?',
  },
});

interface DeleteDecisionDialogProps {
  cancel: () => void;
  close: () => void;
  decision: Decision;
  setDecision?: ReturnType<typeof useState<Decision>>[1];
}

const DeleteDecisionDialog = ({
  cancel,
  close,
  decision,
  setDecision,
}: DeleteDecisionDialogProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleDeleteDecision = () => {
    removeDecisionFromLocalStorage(decision.walletAddress);
    setDecision?.(undefined);
    close();
    if (pathname.includes(DECISIONS_PREVIEW)) {
      // navigate to /decisions
      navigate(pathname.slice(0, -DECISIONS_PREVIEW.length));
    }
  };

  return (
    <Dialog cancel={cancel}>
      <div className={styles.main}>
        <DialogSection>
          <Heading3 text={MSG.title} />
          <div>
            <FormattedMessage {...MSG.description} />
          </div>
        </DialogSection>
        <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
          <Button
            text={{ id: 'button.delete' }}
            appearance={{ theme: 'pink', size: 'large' }}
            onClick={handleDeleteDecision}
          />
        </DialogSection>
      </div>
    </Dialog>
  );
};

DeleteDecisionDialog.displayName = displayName;

export default DeleteDecisionDialog;
