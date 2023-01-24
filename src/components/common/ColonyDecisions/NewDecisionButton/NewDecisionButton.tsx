import React from 'react';

import { useDialog } from '~shared/Dialog';
import { DecisionDialog } from '~common/ColonyDecisions';
// import RemoveDraftCreateNewDecision from '~dashboard/Dialogs/RemoveDraftDecisionDialog';

import { DialogButton } from '~shared/Button';
import { useAppContext } from '~hooks';

const displayName = 'common.ColonyDecisions.NewDecisionButton';

interface Props {
  ethDomainId: number;
}

const NewDecisionButton = ({ ethDomainId }: Props) => {
  const { user } = useAppContext();

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
  // const openDeleteDraftDialog = useDialog(RemoveDraftCreateNewDecision);

  const openNewDecisionDialog = () => {
    openDecisionDialog({ ethDomainId });
    // removeDraftDecision();
  };

  // @TODO: This is copied from NewActionButton, extract instead.
  // const hasRegisteredProfile = !!username && !ethereal;
  // const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  // const mustUpgrade = colonyMustBeUpgraded(colony, networkVersion as string);
  // const isLoadingData = isLoadingExtensions || isLoadingUser;

  const handleClick = () => openNewDecisionDialog();
  // draftDecision?.userAddress === user?.walletAddress
  //   ? openDeleteDraftDialog({ colony, openNewDecisionDialog })
  //   : openNewDecisionDialog();

  return (
    <DialogButton
      loading={false /* isLoadingData */}
      text={{ id: 'button.newDecision' }}
      handleClick={handleClick}
      disabled={!user}
      //     mustUpgrade ||
      //     !isNetworkAllowed ||
      //     !hasRegisteredProfile ||
      //     !colony?.isDeploymentFinished ||
      //     !isVotingExtensionEnabled
      //   }
      dataTest="newDecisionButton"
    />
  );
};

export default NewDecisionButton;

NewDecisionButton.displayName = displayName;
