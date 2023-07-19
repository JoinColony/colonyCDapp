import { EnabledExtensionData } from '~hooks/useEnabledExtensions';
import { Colony } from '~types';
import {
  ColonyActionsDialog,
  ManageExpenditureDialog,
  CreateDomainDialog,
  EditDomainDialog,
  CreatePaymentDialog,
  ManageDomainsDialog,
  ManageFundsDialog,
  UnlockTokenDialog,
  TransferFundsDialog,
  AdvancedDialog,
  PermissionManagementDialog,
  RecoveryModeDialog,
  ManageWhitelistDialog,
  MintTokenDialog,
  NetworkContractUpgradeDialog,
  EditColonyDetailsDialog,
  ManageReputationDialog,
  TokenManagementDialog,
  SmiteDialog,
  AwardDialog,
  ManageSafeDialog,
  AddExistingSafeDialog,
  ControlSafeDialog,
  RemoveSafeDialog,
} from '../Dialogs';

export const getWizardFlowConfig = (
  colony: Colony | undefined,
  filteredDomainId: number,
  enabledExtensionData: EnabledExtensionData,
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
      enabledExtensionData,
    },
  },
  {
    component: CreatePaymentDialog,
    props: {
      prevStep: 'common.ManageExpenditureDialog',
      filteredDomainId,
      colony,
      enabledExtensionData,
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
      enabledExtensionData,
    },
  },
  {
    component: TransferFundsDialog,
    props: {
      prevStep: 'common.ManageFundsDialog',
      colony,
      enabledExtensionData,
      filteredDomainId,
    },
  },
  {
    component: UnlockTokenDialog,
    props: {
      prevStep: 'common.ManageFundsDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: ManageDomainsDialog,
    props: {
      prevStep: 'common.ColonyActionsDialog',
      nextStep: 'common.CreateDomainDialog',
      nextStepEdit: 'common.EditDomainDialog',
      nextStepManageWhitelist: 'common.ManageWhitelistDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: CreateDomainDialog,
    props: {
      prevStep: 'common.ManageDomainsDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: EditDomainDialog,
    props: {
      prevStep: 'common.ManageDomainsDialog',
      filteredDomainId,
      colony,
      enabledExtensionData,
    },
  },
  {
    component: ManageReputationDialog,
    props: {
      nextStepAwardReputation: 'common.AwardDialog',
      nextStepSmiteReputation: 'common.SmiteDialog',
      prevStep: 'common.ColonyActionsDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: AwardDialog,
    props: {
      prevStep: 'common.ManageReputationDialog',
      filteredDomainId,
      colony,
      enabledExtensionData,
    },
  },
  {
    component: SmiteDialog,
    props: {
      prevStep: 'common.ManageReputationDialog',
      filteredDomainId,
      colony,
      enabledExtensionData,
    },
  },
  {
    component: AdvancedDialog,
    props: {
      prevStep: 'common.ColonyActionsDialog',
      nextStepPermissionManagement: 'common.PermissionManagementDialog',
      nextStepRecovery: 'common.RecoveryModeDialog',
      nextStepEditDetails: 'common.EditColonyDetailsDialog',
      nextStepVersionUpgrade: 'common.NetworkContractUpgradeDialog',
      nextStepManageSafe: 'common.ManageSafeDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: PermissionManagementDialog,
    props: {
      prevStep: 'common.AdvancedDialog',
      filteredDomainId,
      colony,
      enabledExtensionData,
    },
  },
  {
    component: RecoveryModeDialog,
    props: {
      prevStep: 'common.AdvancedDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: ManageWhitelistDialog,
    props: {
      prevStep: 'common.ManageDomainsDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: NetworkContractUpgradeDialog,
    props: {
      prevStep: 'common.AdvancedDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: EditColonyDetailsDialog,
    props: {
      prevStep: 'common.AdvancedDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: MintTokenDialog,
    props: {
      prevStep: 'common.ManageFundsDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: TokenManagementDialog,
    props: {
      prevStep: 'common.ManageFundsDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: ManageSafeDialog,
    props: {
      nextStepAddExistingSafe: 'common.AddExistingSafeDialog',
      nextStepRemoveSafe: 'common.RemoveSafeDialog',
      nextStepControlSafe: 'common.ControlSafeDialog',
      prevStep: 'common.AdvancedDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: AddExistingSafeDialog,
    props: {
      prevStep: 'common.ManageSafeDialog',
      colony,
    },
  },
  {
    component: ControlSafeDialog,
    props: {
      prevStep: 'common.ManageSafeDialog',
      colony,
      enabledExtensionData,
    },
  },
  {
    component: RemoveSafeDialog,
    props: {
      prevStep: 'common.ManageSafeDialog',
      colony,
    },
  },
];
