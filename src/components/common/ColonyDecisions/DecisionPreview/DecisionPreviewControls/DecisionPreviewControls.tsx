import React from 'react';
// import { defineMessages } from 'react-intl';

import { DeleteDecisionDialog } from '~common/ColonyDecisions';
import { useDialog } from '~shared/Dialog';
import Button, { ActionButton } from '~shared/Button';
import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { Decision } from '~types';

import styles from './DecisionPreviewControls.css';

interface DecisionPreviewControlsProps {
  decision?: Decision;
}

const displayName =
  'common.ColonyDecisions.DecisionPreview.DecisionPreviewControls';

// const MSG = defineMessages({
//   decision: {
//     id: `${displayName}.decision`,
//     defaultMessage: 'Decision',
//   },
// });

const DecisionPreviewControls = ({
  decision,
}: DecisionPreviewControlsProps) => {
  // const navigate = useNavigate();
  const { colony } = useColonyContext();
  const colonyAddress = colony?.colonyAddress;

  const openConfirmDeleteDialog = useDialog(DeleteDecisionDialog);
  // const openDecisionDialog = useDialog(DecisionDialog);

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
            onClick={
              () => console.log('Implement edit button')
              // openDecisionDialog({
              //   colony,
              //   ethDomainId: decisionData.motionDomainId,
              // })
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
