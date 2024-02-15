import { useMemo } from 'react';

import { Action } from '~constants/actions.ts';
import { type SearchSelectOptionProps } from '~v5/shared/SearchSelect/types.ts';

export const useActionsList = () => {
  return useMemo(
    (): SearchSelectOptionProps[] => [
      {
        key: '1',
        title: { id: 'actions.payments' },
        isAccordion: true,
        options: [
          {
            label: { id: 'actions.simplePayment' },
            value: Action.SIMPLE_PAYMENT,
          },
          // @BETA: Disabled for now
          // {
          //   label: { id: 'actions.advancedPayment' },
          //   value: Action.ADVANCED_PAYMENT,
          // },
          // {
          //   label: { id: 'actions.batchPayment' },
          //   value: Action.BATCH_PAYMENT,
          // },
          // {
          //   label: { id: 'actions.splitPayment' },
          //   value: Action.SPLIT_PAYMENT,
          // },
          // {
          //   label: { id: 'actions.stagedPayment' },
          //   value: Action.STAGED_PAYMENT,
          // },
          // {
          //   label: { id: 'actions.streamingPayment' },
          //   value: Action.STREAMING_PAYMENT,
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
            value: Action.CREATE_DECISION,
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
            value: Action.TRANSFER_FUNDS,
          },
          {
            label: { id: 'actions.mintTokens' },
            value: Action.MINT_TOKENS,
          },
          {
            label: { id: 'actions.unlockToken' },
            value: Action.UNLOCK_TOKEN,
          },
          {
            label: { id: 'actions.manageTokens' },
            value: Action.MANAGE_TOKENS,
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
            value: Action.CREATE_NEW_TEAM,
          },
          {
            label: { id: 'actions.editExistingTeam' },
            value: Action.EDIT_EXISTING_TEAM,
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
          //   value: Action.MANAGE_REPUTATION,
          // },
          {
            label: { id: 'actions.managePermissions' },
            value: Action.MANAGE_PERMISSIONS,
          },
          {
            label: { id: 'actions.editColonyDetails' },
            value: Action.EDIT_COLONY_DETAILS,
          },
          {
            label: { id: 'actions.upgradeColonyVersion' },
            value: Action.UPGRADE_COLONY_VERSION,
          },
          // @BETA: Disabled for now
          // {
          //   label: { id: 'actions.enterRecoveryMode' },
          //   value: Action.ENTER_RECOVERY_MODE,
          // },
          {
            label: { id: 'actions.manageColonyObjectives' },
            value: Action.MANAGE_COLONY_OBJECTIVES,
          },
          // {
          //   label: { id: 'actions.createNewIntegration' },
          //   value: Action.CREATE_NEW_INTEGRATION,
          //   isDisabled: true,
          // },
        ],
      },
    ],
    [],
  );
};
