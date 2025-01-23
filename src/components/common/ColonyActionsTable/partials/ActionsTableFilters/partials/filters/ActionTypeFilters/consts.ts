import { Action } from '~constants/actions.ts';
import { formatText } from '~utils/intl.ts';

export const ACTION_TYPES_FILTERS = [
  {
    label: formatText({ id: 'actions.simplePayment' }),
    name: Action.SimplePayment,
  },
  {
    label: formatText({ id: 'actions.paymentBuilder' }),
    name: Action.PaymentBuilder,
  },
  {
    label: formatText({ id: 'actions.stagedPayment' }),
    name: Action.StagedPayment,
  },
  // @BETA: Disabled for now
  // {
  //   label:formatText({ id: 'actions.batchPayment' }),
  //   name: Action.BatchPayment,
  // },
  {
    label: formatText({ id: 'actions.splitPayment' }),
    name: Action.SplitPayment,
  },
  // {
  //   label:formatText({ id: 'actions.streamingPayment' }),
  //   name: Action.StreamingPayment,
  // },
  {
    label: formatText({ id: 'actions.createDecision' }),
    name: Action.CreateDecision,
  },
  {
    label: formatText({ id: 'actions.transferFunds' }),
    name: Action.TransferFunds,
  },
  {
    label: formatText({ id: 'actions.mintTokens' }),
    name: Action.MintTokens,
  },
  {
    label: formatText({ id: 'actions.unlockToken' }),
    name: Action.UnlockToken,
  },
  {
    label: formatText({ id: 'actions.manageTokens' }),
    name: Action.ManageTokens,
  },
  {
    label: formatText({ id: 'actions.createNewTeam' }),
    name: Action.CreateNewTeam,
  },
  {
    label: formatText({ id: 'actions.editExistingTeam' }),
    name: Action.EditExistingTeam,
  },
  // @BETA: Disabled for now
  // {
  //   label:formatText({ id: 'actions.manageReputation' }),
  //   name: Action.ManageReputation,
  // },
  {
    label: formatText({ id: 'actions.managePermissions' }),
    name: Action.ManagePermissions,
  },
  {
    label: formatText({ id: 'actions.arbitraryTxs' }),
    name: Action.ArbitraryTxs,
  },
  {
    label: formatText({ id: 'actions.editColonyDetails' }),
    name: Action.EditColonyDetails,
  },
  {
    label: formatText({ id: 'actions.upgradeColonyVersion' }),
    name: Action.UpgradeColonyVersion,
  },
  // @BETA: Disabled for now
  // {
  //   label:formatText({ id: 'actions.enterRecoveryMode' }),
  //   name: Action.EnterRecoveryMode,
  // },
  {
    /**
     * @deprecated
     * This is still needed to allow users to filter the Activity Table by the Colony Objective Action type
     */
    label: formatText({ id: 'actions.manageColonyObjectives' }),
    name: Action.ManageColonyObjectives,
  },
  // {
  //   label:formatText({ id: 'actions.createNewIntegration' }),
  //   name: Action.CreateNewIntegration,
  // },
];
