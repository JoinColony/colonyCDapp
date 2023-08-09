import React from 'react';
import { defineMessage, FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Button from '~shared/Button';
import Dialog, { DialogSection } from '~shared/Dialog';
import { Heading3 } from '~shared/Heading';
import { DECISIONS_PREVIEW_ROUTE_SUFFIX as DECISIONS_PREVIEW } from '~routes';
import { removeDecisionAction } from '~redux/actionCreators';
import { DecisionDraft } from '~utils/decisions';

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
  draftDecision: DecisionDraft;
}

const DeleteDecisionDialog = ({
  cancel,
  close,
  draftDecision: { walletAddress, colonyAddress },
}: DeleteDecisionDialogProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleDeleteDecision = () => {
    dispatch(removeDecisionAction(walletAddress, colonyAddress));
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
