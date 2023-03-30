import React from 'react';
import { defineMessages } from 'react-intl';
// import { Extension } from '@colony/colony-js';
// import { useSelector } from 'react-redux';

import {
  useAppContext,
  useNaiveBranchingDialogWizard,
  useColonyContext,
  useEnabledExtensions,
} from '~hooks';
import DialogButton from '~shared/Button/DialogButton';

// import {
//   colonyMustBeUpgraded,
//   oneTxMustBeUpgraded,
// } from '~modules/dashboard/checks';

import { getWizardFlowConfig } from './wizardConfig';

const displayName = 'common.ColonyHome.NewActionButton';

const MSG = defineMessages({
  newAction: {
    id: `${displayName}.newAction`,
    defaultMessage: 'New Action',
  },
  walletNotConnectedWarning: {
    id: `${displayName}.walletNotConnectedWarning`,
    defaultMessage: `To interact with a colony you must connect your wallet, be on the same network as the colony, and have joined the colony.`,
  },
});

interface Props {
  filteredDomainId: number;
}

// interface RootState {
//   users: {
//     wallet: {
//       isUserConnected: boolean;
//     };
//   };
// }

const NewActionButton = ({ filteredDomainId }: Props) => {
  const { colony, canInteractWithColony } = useColonyContext();
  const { user, walletConnecting } = useAppContext();

  // const { version: networkVersion } = useNetworkContracts();

  // const [isLoadingUser, setIsLoadingUser] = useState<boolean>(!ethereal);

  const enabledExtensionData = useEnabledExtensions();
  const { loading: loadingExtensions } = enabledExtensionData;

  // const { data } = useColonyExtensionsQuery({
  //   variables: { address: colony.colonyAddress },
  // });

  // useSelector((state: RootState) => {
  //   const { isUserConnected } = state.users.wallet;
  //   if (!ethereal && isUserConnected && isLoadingUser) {
  //     setIsLoadingUser(false);
  //   } else if (ethereal && isUserConnected && !isLoadingUser) {
  //     setIsLoadingUser(true);
  //   }
  // });

  const startWizardFlow = useNaiveBranchingDialogWizard(
    getWizardFlowConfig(colony, filteredDomainId, enabledExtensionData),
  );

  // const oneTxPaymentExtension = data?.processedColony?.installedExtensions.find(
  //   ({ details, extensionId: extensionName }) =>
  //     details?.initialized &&
  //     !details?.missingPermissions.length &&
  //     extensionName === Extension.OneTxPayment,
  // );
  // const mustUpgradeOneTx = oneTxMustBeUpgraded(oneTxPaymentExtension);
  const hasRegisteredProfile = !!user?.name && !!user.walletAddress;
  // const mustUpgrade = colonyMustBeUpgraded(colony, networkVersion as string);
  const isLoadingData = loadingExtensions || !!walletConnecting;

  if (!colony) {
    return null;
  }

  return (
    <DialogButton
      text={MSG.newAction}
      loading={isLoadingData}
      handleClick={() => startWizardFlow('common.ColonyActionsDialog')}
      disabled={!hasRegisteredProfile}
      data-test="newActionButton"
    />
  );
};

export default NewActionButton;

NewActionButton.displayName = displayName;
