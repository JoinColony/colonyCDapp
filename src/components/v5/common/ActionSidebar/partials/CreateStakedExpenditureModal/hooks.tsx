import React, { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { type Action } from '~constants/actions.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { actionsWithStakingDecisionMethod } from '~v5/common/ActionSidebar/hooks/permissions/consts.ts';

import CreateStakedExpenditureModal from './CreateStakedExpenditureModal.tsx';

export const useShowCreateStakedExpenditureModal = (actionType: Action) => {
  const [
    isStakedExpenditureModalVisible,
    { toggleOn: showStakedExpenditureModal, toggleOff },
  ] = useToggle();

  const {
    watch,
    formState: { isValid },
  } = useFormContext();

  const stringifiedWatchValues = JSON.stringify(watch());

  const shouldShowStakedExpenditureModal =
    actionsWithStakingDecisionMethod.includes(actionType) &&
    watch().decisionMethod === DecisionMethod.Staking &&
    isValid;

  const renderStakedExpenditureModal = useCallback(() => {
    const originalWatchValues = JSON.parse(stringifiedWatchValues);

    if (shouldShowStakedExpenditureModal && isStakedExpenditureModalVisible) {
      return (
        <CreateStakedExpenditureModal
          actionType={actionType}
          isOpen={isStakedExpenditureModalVisible}
          onClose={toggleOff}
          formValues={originalWatchValues}
        />
      );
    }

    return null;
  }, [
    actionType,
    isStakedExpenditureModalVisible,
    shouldShowStakedExpenditureModal,
    stringifiedWatchValues,
    toggleOff,
  ]);

  return {
    showStakedExpenditureModal,
    renderStakedExpenditureModal,
    shouldShowStakedExpenditureModal,
  };
};
