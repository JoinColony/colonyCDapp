import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import {
  useAppContext,
  useColonyContext,
  useNaiveBranchingDialogWizard,
} from '~hooks';
// import { Extension } from '@colony/colony-js';
// import { useSelector } from 'react-redux';

// import { Colony } from '~types';

import Button from '~shared/Button';
import { Tooltip } from '~shared/Popover';
import { SpinnerLoader } from '~shared/Preloaders';

import {
  ColonyActionsDialog,
  // ManageExpenditureDialog,
  // CreateDomainDialog,
  // EditDomainDialog,
  // CreatePaymentDialog,
  // ManageDomainsDialog,
  // ManageFundsDialog,
  // UnlockTokenDialog,
  // TransferFundsDialog,
  // AdvancedDialog,
  // PermissionManagementDialog,
  // RecoveryModeDialog,
  // ManageWhitelistDialog,
  // MintTokenDialog,
  // NetworkContractUpgradeDialog,
  // EditColonyDetailsDialog,
  // ManageReputationDialog,
  // TokenManagementDialog,
  // SmiteDialog,
  // AwardDialog,
} from '../Dialogs';
// import { useEnabledExtensions } from '~utils/hooks/useEnabledExtensions';

// import {
//   colonyMustBeUpgraded,
//   oneTxMustBeUpgraded,
// } from '~modules/dashboard/checks';

import styles from './NewActionButton.css';

const displayName = 'common.ColonyHome.NewActionButton';

const MSG = defineMessages({
  newAction: {
    id: `${displayName}.newAction`,
    defaultMessage: 'New Action',
  },
  walletNotConnectedWarning: {
    id: `${displayName}.walletNotConnectedWarning`,
    defaultMessage: `To interact with a Colony you must have your wallet connected, have a user profile registered, and be on the same network as the specific colony.`,
  },
});

// interface Props {
//   colony: Colony;
//   filteredDomainId: number;
// }

// interface RootState {
//   users: {
//     wallet: {
//       isUserConnected: boolean;
//     };
//   };
// }

const NewActionButton = (/** { colony, filteredDomainId }: Props */) => {
  const canInteractWithColony = useColonyContext();
  const { user } = useAppContext();

  // const { version: networkVersion } = useNetworkContracts();

  // const [isLoadingUser, setIsLoadingUser] = useState<boolean>(!ethereal);

  // const { isLoadingExtensions } = useEnabledExtensions({
  //   colonyAddress: colony.colonyAddress,
  // });

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

  const startWizardFlow = useNaiveBranchingDialogWizard([
    {
      component: ColonyActionsDialog,
      props: {
        nextStepManageExpenditure: 'common.ColonyHome.ManageExpenditureDialog',
        nextStepManageFunds: 'common.ColonyHome.ManageFundsDialog',
        nextStepManageDomains: 'common.ColonyHome.ManageDomainsDialog',
        nextStepAdvanced: 'common.ColonyHome.AdvancedDialog',
        nextStepManageReputation: 'common.ColonyHome.ManageReputationDialog',
      },
    },
    // {
    //   component: ManageExpenditureDialog,
    //   props: {
    //     nextStep: 'common.ColonyHome.CreatePaymentDialog',
    //     prevStep: 'common.ColonyHome.ColonyActionsDialog',
    //     colony,
    //   },
    // },
    // {
    //   component: CreatePaymentDialog,
    //   props: {
    //     colony,
    //     prevStep: 'common.ColonyHome.ManageExpenditureDialog',
    //     filteredDomainId,
    //   },
    // },
    // {
    //   component: ManageFundsDialog,
    //   props: {
    //     nextStepTransferFunds: 'common.ColonyHome.TransferFundsDialog',
    //     nextStepMintTokens: 'common.ColonyHome.MintTokenDialog',
    //     nextStepManageTokens: 'common.ColonyHome.TokenManagementDialog',
    //     nextStepUnlockToken: 'common.ColonyHome.UnlockTokenDialog',
    //     prevStep: 'common.ColonyHome.ColonyActionsDialog',
    //     colony,
    //   },
    // },
    // {
    //   component: TransferFundsDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.ManageFundsDialog',
    //     colony,
    //     filteredDomainId,
    //   },
    // },
    // {
    //   component: UnlockTokenDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.ManageFundsDialog',
    //     colony,
    //   },
    // },
    // {
    //   component: ManageDomainsDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.ColonyActionsDialog',
    //     nextStep: 'common.ColonyHome.CreateDomainDialog',
    //     nextStepEdit: 'common.ColonyHome.EditDomainDialog',
    //     nextStepManageWhitelist: 'common.ColonyHome.ManageWhitelistDialog',
    //     colony,
    //   },
    // },
    // {
    //   component: CreateDomainDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.ManageDomainsDialog',
    //     colony,
    //   },
    // },
    // {
    //   component: EditDomainDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.ManageDomainsDialog',
    //     colony,
    //     filteredDomainId,
    //   },
    // },
    // {
    //   component: ManageReputationDialog,
    //   props: {
    //     nextStepAwardReputation: 'common.ColonyHome.AwardDialog',
    //     nextStepSmiteReputation: 'common.ColonyHome.SmiteDialog',
    //     prevStep: 'common.ColonyHome.ColonyActionsDialog',
    //     colony,
    //   },
    // },
    // {
    //   component: AwardDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.ManageReputationDialog',
    //     colony,
    //     filteredDomainId,
    //   },
    // },
    // {
    //   component: SmiteDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.ManageReputationDialog',
    //     colony,
    //     filteredDomainId,
    //   },
    // },
    // {
    //   component: AdvancedDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.ColonyActionsDialog',
    //     nextStepPermissionManagement:
    //       'common.ColonyHome.PermissionManagementDialog',
    //     nextStepRecovery: 'common.ColonyHome.RecoveryModeDialog',
    //     nextStepEditDetails: 'common.ColonyHome.EditColonyDetailsDialog',
    //     nextStepVersionUpgrade:
    //       'common.ColonyHome.NetworkContractUpgradeDialog',
    //     colony,
    //   },
    // },
    // {
    //   component: PermissionManagementDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.AdvancedDialog',
    //     colony,
    //     filteredDomainId,
    //   },
    // },
    // {
    //   component: RecoveryModeDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.AdvancedDialog',
    //     colony,
    //   },
    // },
    // {
    //   component: ManageWhitelistDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.ManageDomainsDialog',
    //     colony,
    //   },
    // },
    // {
    //   component: NetworkContractUpgradeDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.AdvancedDialog',
    //     colony,
    //   },
    // },
    // {
    //   component: EditColonyDetailsDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.AdvancedDialog',
    //     colony,
    //   },
    // },
    // {
    //   component: MintTokenDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.ManageFundsDialog',
    //     colony,
    //   },
    // },
    // {
    //   component: TokenManagementDialog,
    //   props: {
    //     prevStep: 'common.ColonyHome.ManageFundsDialog',
    //     colony,
    //   },
    // },
  ]);

  // const oneTxPaymentExtension = data?.processedColony?.installedExtensions.find(
  //   ({ details, extensionId: extensionName }) =>
  //     details?.initialized &&
  //     !details?.missingPermissions.length &&
  //     extensionName === Extension.OneTxPayment,
  // );
  // const mustUpgradeOneTx = oneTxMustBeUpgraded(oneTxPaymentExtension);
  const hasRegisteredProfile = !!user?.name && !!user.walletAddress;
  // const mustUpgrade = colonyMustBeUpgraded(colony, networkVersion as string);
  // const isLoadingData = isLoadingExtensions || isLoadingUser;
  const isLoadingData = false;

  return (
    <>
      {isLoadingData && <SpinnerLoader appearance={{ size: 'medium' }} />}
      {!isLoadingData && (
        <Tooltip
          trigger={!canInteractWithColony ? 'hover' : null}
          content={
            <span className={styles.tooltipWrapper}>
              <FormattedMessage {...MSG.walletNotConnectedWarning} />
            </span>
          }
        >
          <Button
            appearance={{ theme: 'primary', size: 'large' }}
            text={MSG.newAction}
            onClick={() =>
              startWizardFlow('common.ColonyHome.ColonyActionsDialog')
            }
            // disabled={
            //   mustUpgrade ||
            //   mustUpgradeOneTx
            // }
            disabled={!canInteractWithColony || !hasRegisteredProfile}
            data-test="newActionButton"
          />
        </Tooltip>
      )}
    </>
  );
};

export default NewActionButton;

NewActionButton.displayName = displayName;
