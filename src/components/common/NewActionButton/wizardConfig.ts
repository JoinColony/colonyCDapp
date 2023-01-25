// import { Colony } from '~types';

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

export const getWizardFlowConfig =
  (/** colony: Colony, domainId: number */) => [
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
  ];
