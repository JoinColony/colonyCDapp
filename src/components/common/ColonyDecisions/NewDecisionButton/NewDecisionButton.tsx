import React from 'react';

import { useDialog } from '~shared/Dialog';
import { DialogButton } from '~shared/Button';
import {
  DecisionDialog,
  RemoveExistingDecisionDialog,
} from '~common/ColonyDecisions';
import { useAppContext } from '~hooks';
import { getDecisionFromLocalStorage } from '~utils/decisions';

const displayName = 'common.ColonyDecisions.NewDecisionButton';

interface Props {
  ethDomainId: number;
}

const NewDecisionButton = ({ ethDomainId }: Props) => {
  const { user } = useAppContext();
  const walletAddress = user?.walletAddress || '';
  const decision = getDecisionFromLocalStorage(walletAddress);

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
      openDeleteDraftDialog({ openDecisionDialog });
    } else {
      openDecisionDialog({ ethDomainId });
    }
  };

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
