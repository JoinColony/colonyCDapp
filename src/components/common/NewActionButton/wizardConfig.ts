import { Colony } from '~types';
import {
  ColonyActionsDialog,
  ManageExpenditureDialog,
  // CreateDomainDialog,
  // EditDomainDialog,
  CreatePaymentDialog,
  // ManageDomainsDialog,
  ManageFundsDialog,
  UnlockTokenDialog,
  TransferFundsDialog,
  // AdvancedDialog,
  // PermissionManagementDialog,
  // ManageWhitelistDialog,
  MintTokenDialog,
  // NetworkContractUpgradeDialog,
  // EditColonyDetailsDialog,
  // ManageReputationDialog,
  TokenManagementDialog,
  // SmiteDialog,
  // AwardDialog,
} from '../Dialogs';

export const getWizardFlowConfig = (
  colony: Colony | undefined,
  filteredDomainId: number,
) => [
  {
    component: ColonyActionsDialog,
    props: {
      nextStepManageExpenditure: 'common.ManageExpenditureDialog',
      nextStepManageFunds: 'common.ManageFundsDialog',
      nextStepManageDomains: 'common.ManageDomainsDialog',
      nextStepAdvanced: 'common.AdvancedDialog',
      nextStepManageReputation: 'common.ManageReputationDialog',
    },
  },
  {
    component: ManageExpenditureDialog,
    props: {
      nextStep: 'common.CreatePaymentDialog',
      prevStep: 'common.ColonyActionsDialog',
      colony,
    },
  },
  {
    component: CreatePaymentDialog,
    props: {
      prevStep: 'common.ManageExpenditureDialog',
      filteredDomainId,
      colony,
    },
  },
  {
    component: ManageFundsDialog,
    props: {
      nextStepTransferFunds: 'common.TransferFundsDialog',
      nextStepMintTokens: 'common.MintTokenDialog',
      nextStepManageTokens: 'common.TokenManagementDialog',
      nextStepUnlockToken: 'common.UnlockTokenDialog',
      prevStep: 'common.ColonyActionsDialog',
      colony,
    },
  },
  {
    component: TransferFundsDialog,
    props: {
      prevStep: 'common.ManageFundsDialog',
      colony,
      filteredDomainId,
    },
  },
  {
    component: UnlockTokenDialog,
    props: {
      prevStep: 'common.ManageFundsDialog',
      colony,
    },
  },
  // {
  //   component: ManageDomainsDialog,
  //   props: {
  //     prevStep: 'common.ColonyActionsDialog',
  //     nextStep: 'common.CreateDomainDialog',
  //     nextStepEdit: 'common.EditDomainDialog',
  //     nextStepManageWhitelist: 'common.ManageWhitelistDialog',
  //   },
  // },
  // {
  //   component: CreateDomainDialog,
  //   props: {
  //     prevStep: 'common.ManageDomainsDialog',
  //   },
  // },
  // {
  //   component: EditDomainDialog,
  //   props: {
  //     prevStep: 'common.ManageDomainsDialog',
  //     filteredDomainId,
  //   },
  // },
  // {
  //   component: ManageReputationDialog,
  //   props: {
  //     nextStepAwardReputation: 'common.AwardDialog',
  //     nextStepSmiteReputation: 'common.SmiteDialog',
  //     prevStep: 'common.ColonyActionsDialog',
  //   },
  // },
  // {
  //   component: AwardDialog,
  //   props: {
  //     prevStep: 'common.ManageReputationDialog',
  //     filteredDomainId,
  //   },
  // },
  // {
  //   component: SmiteDialog,
  //   props: {
  //     prevStep: 'common.ManageReputationDialog',
  //     filteredDomainId,
  //   },
  // },
  // {
  //   component: AdvancedDialog,
  //   props: {
  //     prevStep: 'common.ColonyActionsDialog',
  //     nextStepPermissionManagement:
  //       'common.PermissionManagementDialog',
  //     nextStepRecovery: 'common.RecoveryModeDialog',
  //     nextStepEditDetails: 'common.EditColonyDetailsDialog',
  //     nextStepVersionUpgrade:
  //       'common.NetworkContractUpgradeDialog',
  //   },
  // },
  // {
  //   component: PermissionManagementDialog,
  //   props: {
  //     prevStep: 'common.AdvancedDialog',
  //     filteredDomainId,
  //   },
  // },
  // {
  //   component: RecoveryModeDialog,
  //   props: {
  //     prevStep: 'common.AdvancedDialog',
  //   },
  // },
  // {
  //   component: ManageWhitelistDialog,
  //   props: {
  //     prevStep: 'common.ManageDomainsDialog',
  //   },
  // },
  // {
  //   component: NetworkContractUpgradeDialog,
  //   props: {
  //     prevStep: 'common.AdvancedDialog',
  //   },
  // },
  // {
  //   component: EditColonyDetailsDialog,
  //   props: {
  //     prevStep: 'common.AdvancedDialog',
  //   },
  // },
  {
    component: MintTokenDialog,
    props: {
      prevStep: 'common.ManageFundsDialog',
      colony,
    },
  },
  {
    component: TokenManagementDialog,
    props: {
      prevStep: 'common.ManageFundsDialog',
      colony,
    },
  },
];
