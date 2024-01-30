import { useMemo } from 'react';

import { Action } from '~constants/actions.ts';
import { type SearchSelectOptionProps } from '~v5/shared/SearchSelect/types.ts';

const useActionsList = () => {
  return useMemo(
    (): SearchSelectOptionProps[] => [
      {
        key: '1',
        title: { id: 'actions.payments' },
        isAccordion: true,
        options: [
          {
            label: { id: 'actions.simplePayment' },
            value: Action.SimplePayment,
          },
          // @BETA: Disabled for now
          // {
          //   label: { id: 'actions.advancedPayment' },
          //   value: Action.AdvancedPayment,
          // },
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
        title: { id: 'actions.decisions' },
        options: [
          {
            label: { id: 'actions.createDecision' },
            value: Action.CreateDecision,
            isDisabled: false,
          },
        ],
      },
      {
        key: '3',
        isAccordion: true,
        title: { id: 'actions.funds' },
        options: [
          {
            label: { id: 'actions.transferFunds' },
            value: Action.TransferFunds,
          },
          {
            label: { id: 'actions.mintTokens' },
            value: Action.MintTokens,
          },
          {
            label: { id: 'actions.unlockToken' },
            value: Action.UnlockToken,
          },
          {
            label: { id: 'actions.manageTokens' },
            value: Action.ManageTokens,
          },
        ],
      },
      {
        key: '4',
        isAccordion: true,
        title: { id: 'actions.teams' },
        options: [
          {
            label: { id: 'actions.createNewTeam' },
            value: Action.CreateNewTeam,
          },
          {
            label: { id: 'actions.editExistingTeam' },
            value: Action.EditExistingTeam,
          },
        ],
      },
      {
        key: '5',
        isAccordion: true,
        title: { id: 'actions.admin' },
        options: [
          // @BETA: Disabled for now
          // {
          //   label: { id: 'actions.manageReputation' },
          //   value: Action.ManageReputation,
          // },
          {
            label: { id: 'actions.managePermissions' },
            value: Action.ManagePermissions,
          },
          {
            label: { id: 'actions.editColonyDetails' },
            value: Action.EditColonyDetails,
          },
          {
            label: { id: 'actions.upgradeColonyVersion' },
            value: Action.UpgradeColonyVersion,
          },
          {
            label: { id: 'actions.manageVerifiedMembers' },
            value: Action.ManageVerifiedMembers,
          },
          // @BETA: Disabled for now
          // {
          //   label: { id: 'actions.enterRecoveryMode' },
          //   value: Action.EnterRecoveryMode,
          // },
          {
            label: { id: 'actions.manageColonyObjectives' },
            value: Action.ManageColonyObjectives,
          },
          // {
          //   label: { id: 'actions.createNewIntegration' },
          //   value: Action.CreateNewIntegration,
          //   isDisabled: true,
          // },
        ],
      },
    ],
    [],
  );
};

export default useActionsList;
