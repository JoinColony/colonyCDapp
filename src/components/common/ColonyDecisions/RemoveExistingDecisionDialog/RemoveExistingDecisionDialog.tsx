import React from 'react';
import { defineMessages } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppContext } from '~hooks';
import { removeDecisionAction } from '~redux/actionCreators';
import { DECISIONS_PREVIEW_ROUTE_SUFFIX as DECISIONS_PREVIEW } from '~routes';
import Button from '~shared/Button';
import Dialog, { DialogProps, DialogSection } from '~shared/Dialog';

import RemoveDecisionMessage from './RemoveDecisionMessage';

const displayName = 'common.ColonyDecisions.RemoveExistingDecisionDialog';

const MSG = defineMessages({
  newDecision: {
    id: `${displayName}.newDecision`,
    defaultMessage: 'New Decision',
  },
});

interface RemoveExistingDecisionDialogProps extends DialogProps {
  onClick: () => void;
  colonyAddress: string;
}

const RemoveExistingDecisionDialog = ({
  close,
  cancel,
  onClick,
  colonyAddress,
}: RemoveExistingDecisionDialogProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAppContext();
  const { pathname } = useLocation();
  const walletAddress = user?.walletAddress || '';

  const handleRedirect = () => {
    navigate(`${pathname}${DECISIONS_PREVIEW}`);
    close();
  };

  const handleRemoveDecision = () => {
    dispatch(removeDecisionAction(walletAddress, colonyAddress));
    onClick();
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
