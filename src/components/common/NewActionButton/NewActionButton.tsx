import React from 'react';
import {
  useAppContext,
  useColonyContext,
  useEnabledExtensions,
  useNaiveBranchingDialogWizard,
} from '~hooks';
// import { Extension } from '@colony/colony-js';
// import { useSelector } from 'react-redux';

import { getWizardFlowConfig } from './wizardConfig';
import { DialogButton } from '~shared/Button';

// import {
//   colonyMustBeUpgraded,
//   oneTxMustBeUpgraded,
// } from '~modules/dashboard/checks';

const displayName = 'common.ColonyHome.NewActionButton';

interface Props {
  filteredDomainId: number;
}

const NewActionButton = ({ filteredDomainId }: Props) => {
  const { colony } = useColonyContext();
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
      loading={isLoadingData}
      text={{ id: 'button.newAction' }}
      handleClick={() => startWizardFlow('common.ColonyActionsDialog')}
      disabled={
        !hasRegisteredProfile
        //   mustUpgrade ||
        //   mustUpgradeOneTx ||
      }
      dataTest="newActionButton"
    />
  );
};

export default NewActionButton;

NewActionButton.displayName = displayName;
