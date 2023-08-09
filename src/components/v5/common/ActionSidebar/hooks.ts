import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { Actions } from '~constants/actions';
import { SearchSelectOptionProps } from '~v5/shared/SearchSelect/types';
import useToggle from '~hooks/useToggle';

export const useActionSidebar = () => {
  const [
    isSelectVisible,
    { toggle: toggleSelect, toggleOff: toggleSelectOff },
  ] = useToggle();

  const methods = useForm({
    mode: 'all',
  });

  return {
    isSelectVisible,
    toggleSelect,
    toggleSelectOff,
    methods,
  };
};

export const useActionsList = () =>
  useMemo(
    (): SearchSelectOptionProps[] => [
      {
        key: '1',
        title: { id: 'actions.payments' },
        isAccordion: true,
        options: [
          {
            label: { id: 'actions.simplePayment' },
            value: Actions.SIMPLE_PAYMENT,
          },
          {
            label: { id: 'actions.advancedPayment' },
            value: Actions.ADVANCED_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.batchPayment' },
            value: Actions.BATCH_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.splitPayment' },
            value: Actions.SPLIT_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.stagedPayment' },
            value: Actions.STAGED_PAYMENT,
            isDisabled: true,
          },
          {
            label: { id: 'actions.streamingPayment' },
            value: Actions.STREAMING_PAYMENT,
            isDisabled: true,
          },
        ],
      },
      {
        key: '2',
        isAccordion: true,
        title: { id: 'actions.decisions' },
        options: [
          {
            label: { id: 'actions.createDecision' },
            value: Actions.CREATE_DECISION,
            isDisabled: true,
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
            value: Actions.TRANSFER_FUNDS,
          },
          {
            label: { id: 'actions.mintTokens' },
            value: Actions.MINT_TOKENS,
          },
          {
            label: { id: 'actions.unlockToken' },
            value: Actions.UNLOCK_TOKEN,
          },
          {
            label: { id: 'actions.manageTokens' },
            value: Actions.MANAGE_TOKENS,
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
            value: Actions.CREATE_NEW_TEAM,
          },
          {
            label: { id: 'actions.editExistingTeam' },
            value: Actions.EDIT_EXISTING_TEAM,
          },
        ],
      },
      {
        key: '5',
        isAccordion: true,
        title: { id: 'actions.admin' },
        options: [
          {
            label: { id: 'actions.awardReputation' },
            value: Actions.AWARD_REPUTATION,
          },
          {
            label: { id: 'actions.removeReputation' },
            value: Actions.REMOVE_REPUTATION,
          },
          {
            label: { id: 'actions.managePermissions' },
            value: Actions.MANAGE_PERMISSIONS,
          },
          {
            label: { id: 'actions.editColonyDetails' },
            value: Actions.EDIT_COLONY_DETAILS,
          },
          {
            label: { id: 'actions.upgradeColonyVersion' },
            value: Actions.UPGRADE_COLONY_VERSION,
          },
          {
            label: { id: 'actions.enterRecoveryMode' },
            value: Actions.ENTER_RECOVERY_MODE,
          },
          {
            label: { id: 'actions.createNewIntegration' },
            value: Actions.CREATE_NEW_INTEGRATION,
            isDisabled: true,
          },
          {
            label: { id: 'actions.manageColonyObjective' },
            value: Actions.MANAGE_COLONY_OBJECTIVES,
            isDisabled: true,
          },
        ],
      },
    ],
    [],
  );
