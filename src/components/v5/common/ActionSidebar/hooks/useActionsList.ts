import { useMemo } from 'react';
import { defineMessages } from 'react-intl';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type SearchSelectOptionProps } from '~v5/shared/SearchSelect/types.ts';

import { CoreForm, getFormName } from '../partials/forms/index.ts';

const MSG = defineMessages({
  titlePayments: {
    id: 'actions.group.payments',
    defaultMessage: 'Payments',
  },
  titleDecisions: {
    id: 'actions.group.decisions',
    defaultMessage: 'Agreements',
  },
  titleFunds: {
    id: 'actions.group.funds',
    defaultMessage: 'Funds',
  },
  titleTeams: {
    id: 'actions.group.teams',
    defaultMessage: 'Teams',
  },
  titleAdmin: {
    id: 'actions.group.admin',
    defaultMessage: 'Admin',
  },
});

// FIXME: No idea where this is used, but this also needs to read the registered components, somewhat automatically
const useActionsList = () => {
  const { colony } = useColonyContext();
  return useMemo((): SearchSelectOptionProps[] => {
    const actionsListOptions: SearchSelectOptionProps[] = [
      {
        key: '1',
        title: MSG.titlePayments,
        isAccordion: true,
        options: [
          {
            label: getFormName(CoreForm.SimplePayment),
            value: CoreForm.SimplePayment,
          },
          {
            label: getFormName(CoreForm.EditTeam),
            value: CoreForm.EditTeam,
          },
          // {
          //   label: { id: 'actions.paymentBuilder' },
          //   value: Action.PaymentBuilder,
          // },
          // @BETA: Disabled for now (all of the following in this key)
          // {
          //   label: { id: 'actions.batchPayment' },
          //   value: Action.BatchPayment,
          // },
          // {
          //   label: { id: 'actions.splitPayment' },
          //   value: Action.SplitPayment,
          // },
          // {
          //   label: { id: 'actions.stagedPayment' },
          //   value: Action.StagedPayment,
          // },
          // {
          //   label: { id: 'actions.streamingPayment' },
          //   value: Action.StreamingPayment,
          // },
        ],
      },
      {
        key: '2',
        isAccordion: true,
        title: MSG.titleDecisions,
        options: [
          // {
          //   label: { id: 'actions.createDecision' },
          //   value: Action.CreateDecision,
          //   isDisabled: false,
          // },
        ],
      },
      {
        key: '3',
        isAccordion: true,
        title: MSG.titleFunds,
        options: [
          // {
          //   label: { id: 'actions.transferFunds' },
          //   value: Action.TransferFunds,
          // },
          // {
          //   label: { id: 'actions.mintTokens' },
          //   value: Action.MintTokens,
          //   isDisabled: !colony?.status?.nativeToken?.mintable,
          // },
          // {
          //   label: { id: 'actions.unlockToken' },
          //   value: Action.UnlockToken,
          //   isDisabled: !colony?.status?.nativeToken?.unlockable,
          // },
          // {
          //   label: { id: 'actions.manageTokens' },
          //   value: Action.ManageTokens,
          // },
        ],
      },
      {
        key: '4',
        isAccordion: true,
        title: MSG.titleTeams,
        options: [
          // {
          //   label: { id: 'actions.createNewTeam' },
          //   value: Action.CreateNewTeam,
          // },
          // {
          //   label: { id: 'actions.editExistingTeam' },
          //   value: Action.EditExistingTeam,
          // },
        ],
      },
      {
        key: '5',
        isAccordion: true,
        title: MSG.titleAdmin,
        options: [
          // {
          //   label: { id: 'actions.manageReputation' },
          //   value: Action.ManageReputation,
          // },
          // {
          //   label: { id: 'actions.managePermissions' },
          //   value: Action.ManagePermissions,
          // },
          // {
          //   label: { id: 'actions.editColonyDetails' },
          //   value: Action.EditColonyDetails,
          // },
          // {
          //   label: { id: 'actions.upgradeColonyVersion' },
          //   value: Action.UpgradeColonyVersion,
          // },
          // {
          //   label: { id: 'actions.manageVerifiedMembers' },
          //   value: Action.ManageVerifiedMembers,
          // },
          // @BETA: Disabled for now
          // {
          //   label: { id: 'actions.enterRecoveryMode' },
          //   value: Action.EnterRecoveryMode,
          // },
        ],
      },
    ];
    return actionsListOptions;
  }, [colony]);
};

export default useActionsList;
