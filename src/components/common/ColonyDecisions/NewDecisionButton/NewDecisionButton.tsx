import React from 'react';
import { useSelector } from 'react-redux';

import { useDialog } from '~shared/Dialog';
import { DialogButton } from '~shared/Button';
import {
  DecisionDialog,
  RemoveExistingDecisionDialog,
} from '~common/ColonyDecisions';
import { ColonyHomeLayoutProps } from '~common/ColonyHome/ColonyHomeLayout';
import { getDraftDecisionFromStore } from '~utils/decisions';
import {
  useAppContext,
  useCanInteractWithNetwork,
  useColonyContext,
  useEnabledExtensions,
} from '~hooks';

const displayName = 'common.ColonyDecisions.NewDecisionButton';

type NewDecisionButtonProps = Pick<ColonyHomeLayoutProps, 'filteredDomainId'>;

const NewDecisionButton = ({
  filteredDomainId: domainId,
}: NewDecisionButtonProps) => {
  const { user, walletConnecting, userLoading } = useAppContext();
  const { colony } = useColonyContext();
  const { isVotingReputationEnabled, loading: isLoadingExtensions } =
    useEnabledExtensions();
  const canInteractWithNetwork = useCanInteractWithNetwork();
  const draftDecision = useSelector(
    getDraftDecisionFromStore(
      user?.walletAddress || '',
      colony?.colonyAddress ?? '',
    ),
  );

  const openDecisionDialog = useDialog(DecisionDialog);
  const openDeleteDraftDialog = useDialog(RemoveExistingDecisionDialog);

  const handleClick = () => {
    if (draftDecision) {
      openDeleteDraftDialog({
        onClick: () =>
          openDecisionDialog({
            nativeDomainId: domainId,
            colonyAddress: colony?.colonyAddress ?? '',
          }),
        colonyAddress: colony?.colonyAddress ?? '',
      });
    } else {
      openDecisionDialog({
        nativeDomainId: domainId,
        draftDecision,
        colonyAddress: colony?.colonyAddress ?? '',
      });
    }
  };

  return (
    <DialogButton
      loading={isLoadingExtensions || !!walletConnecting || !!userLoading}
      text={{ id: 'button.newDecision' }}
      handleClick={handleClick}
      disabled={!user || !isVotingReputationEnabled || !canInteractWithNetwork}
      //     mustUpgrade ||
      //     !colony?.isDeploymentFinished ||
      //   }
      dataTest="newDecisionButton"
    />
  );
};

export default NewDecisionButton;

NewDecisionButton.displayName = displayName;
