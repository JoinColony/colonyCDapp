import { useMemo } from 'react';

import { ACTION } from '~constants/actions.ts';
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
            value: ACTION.SIMPLE_PAYMENT,
          },
          // @BETA: Disabled for now
          // {
          //   label: { id: 'actions.advancedPayment' },
          //   value: ACTION.ADVANCED_PAYMENT,
          // },
          // {
          //   label: { id: 'actions.batchPayment' },
          //   value: ACTION.BATCH_PAYMENT,
          // },
          // {
          //   label: { id: 'actions.splitPayment' },
          //   value: ACTION.SPLIT_PAYMENT,
          // },
          // {
          //   label: { id: 'actions.stagedPayment' },
          //   value: ACTION.STAGED_PAYMENT,
          // },
          // {
          //   label: { id: 'actions.streamingPayment' },
          //   value: ACTION.STREAMING_PAYMENT,
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
            value: ACTION.CREATE_DECISION,
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
            value: ACTION.TRANSFER_FUNDS,
          },
          {
            label: { id: 'actions.mintTokens' },
            value: ACTION.MINT_TOKENS,
          },
          {
            label: { id: 'actions.unlockToken' },
            value: ACTION.UNLOCK_TOKEN,
          },
          {
            label: { id: 'actions.manageTokens' },
            value: ACTION.MANAGE_TOKENS,
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
            value: ACTION.CREATE_NEW_TEAM,
          },
          {
            label: { id: 'actions.editExistingTeam' },
            value: ACTION.EDIT_EXISTING_TEAM,
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
          //   value: ACTION.MANAGE_REPUTATION,
          // },
          {
            label: { id: 'actions.managePermissions' },
            value: ACTION.MANAGE_PERMISSIONS,
          },
          {
            label: { id: 'actions.editColonyDetails' },
            value: ACTION.EDIT_COLONY_DETAILS,
          },
          {
            label: { id: 'actions.upgradeColonyVersion' },
            value: ACTION.UPGRADE_COLONY_VERSION,
          },
          // @BETA: Disabled for now
          // {
          //   label: { id: 'actions.enterRecoveryMode' },
          //   value: ACTION.ENTER_RECOVERY_MODE,
          // },
          {
            label: { id: 'actions.manageColonyObjectives' },
            value: ACTION.MANAGE_COLONY_OBJECTIVES,
          },
          // {
          //   label: { id: 'actions.createNewIntegration' },
          //   value: ACTION.CREATE_NEW_INTEGRATION,
          //   isDisabled: true,
          // },
        ],
      },
    ],
    [],
  );
};
