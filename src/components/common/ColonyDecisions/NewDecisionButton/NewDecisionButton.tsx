import React from 'react';
import { useSelector } from 'react-redux';

import { useDialog } from '~shared/Dialog';
import { DialogButton } from '~shared/Button';
import {
  DecisionDialog,
  RemoveExistingDecisionDialog,
} from '~common/ColonyDecisions';
import { ColonyHomeLayoutProps } from '~common/ColonyHome/ColonyHomeLayout';
import { getDecisionFromStore } from '~utils/decisions';
import {
  useAppContext,
  useCanInteractWithNetwork,
  useColonyContext,
  useEnabledExtensions,
} from '~hooks';

const displayName = 'common.ColonyDecisions.NewDecisionButton';

type NewDecisionButtonProps = Pick<ColonyHomeLayoutProps, 'filteredDomainId'>;

const NewDecisionButton = ({
  filteredDomainId: ethDomainId,
}: NewDecisionButtonProps) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const canInteractWithNetwork = useCanInteractWithNetwork();
  const decision = useSelector(getDecisionFromStore(user?.walletAddress || ''));

  //   const { isVotingExtensionEnabled, isLoadingExtensions } =
  //     useEnabledExtensions({
  //       colonyAddress: colony.colonyAddress,
  //     });

  // @TODO: This is copied from NewActionButton, extract instead.
  // const { version: networkVersion } = useNetworkContracts();
  //  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
  //   useSelector((state: RootState) => {
  //     const { isUserConnected } = state.users.wallet;
  //     if (!ethereal && isUserConnected && isLoadingUser) {
  //       setIsLoadingUser(false);
  //     } else if (ethereal && isUserConnected && !isLoadingUser) {
  //       setIsLoadingUser(true);
  //     }
  //   });

  const openDecisionDialog = useDialog(DecisionDialog);
  const openDeleteDraftDialog = useDialog(RemoveExistingDecisionDialog);

  // @TODO: This is copied from NewActionButton, extract instead.
  // const hasRegisteredProfile = !!username && !ethereal;
  // const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  // const mustUpgrade = colonyMustBeUpgraded(colony, networkVersion as string);
  // const isLoadingData = isLoadingExtensions || isLoadingUser;

  const handleClick = () => {
    if (decision) {
      openDeleteDraftDialog({
        openDecisionDialog,
      });
    } else {
      openDecisionDialog({
        nativeDomainId: ethDomainId,
        decision,
        colonyAddress: colony?.colonyAddress ?? '',
      });
    }
  };

  return (
    <DialogButton
      loading={false /* isLoadingData */}
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
