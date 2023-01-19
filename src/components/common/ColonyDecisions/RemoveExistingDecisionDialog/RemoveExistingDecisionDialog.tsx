import React from 'react';
import { defineMessages } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '~shared/Button';
import Dialog, { DialogProps, DialogSection } from '~shared/Dialog';
import { useAppContext } from '~hooks';
import { removeDecisionFromLocalStorage } from '~utils/decisions';
import { DECISIONS_PREVIEW_ROUTE_SUFFIX as DECISIONS_PREVIEW } from '~routes';

import RemoveDecisionMessage from './RemoveDecisionMessage';

const displayName = 'common.ColonyDecisions.RemoveExistingDecisionDialog';

const MSG = defineMessages({
  newDecision: {
    id: `${displayName}.newDecision`,
    defaultMessage: 'New Decision',
  },
});

interface RemoveExistingDecisionDialogProps extends DialogProps {
  openDecisionDialog: () => void;
}

const RemoveExistingDecisionDialog = ({
  close,
  cancel,
  openDecisionDialog,
}: RemoveExistingDecisionDialogProps) => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const walletAddress = user?.walletAddress || '';

  const handleRedirect = () => {
    navigate(`${pathname}${DECISIONS_PREVIEW}`);
    close();
  };

  const handleRemoveDecision = () => {
    removeDecisionFromLocalStorage(walletAddress);
    openDecisionDialog();
    close();
  };

  return (
    <Dialog cancel={cancel}>
      <RemoveDecisionMessage handleRedirect={handleRedirect} />
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          text={MSG.newDecision}
          onClick={handleRemoveDecision}
        />
      </DialogSection>
    </Dialog>
  );
};

RemoveExistingDecisionDialog.displayName = displayName;

export default RemoveExistingDecisionDialog;
