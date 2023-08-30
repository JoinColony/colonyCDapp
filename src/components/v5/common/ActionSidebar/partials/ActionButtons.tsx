import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { useMobile } from '~hooks';
import Button, { PendingButton } from '~v5/shared/Button';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { ActionButtonsProps } from '../types';
import { useGetSubmitButton } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.ActionButtons';

const ActionButtons: FC<ActionButtonsProps> = ({ isActionDisabled }) => {
  const isMobile = useMobile();
  const submitText = useGetSubmitButton();
  const methods = useFormContext();
  const { selectedAction, toggleCancelModal, toggleActionSidebarOff } =
    useActionSidebarContext();

  const isLoading = methods?.formState?.isSubmitting;
  const isDirty = methods?.formState?.isDirty;

  const onCancelClick = () => {
    if (!methods) {
      toggleActionSidebarOff();
    }

    if (isDirty) {
      toggleCancelModal();
    } else {
      toggleActionSidebarOff();
    }
  };

  return (
    <div
      className="flex items-center flex-col-reverse sm:flex-row 
        justify-end gap-2 p-6 border-t border-gray-200"
    >
      <Button
        mode="primaryOutline"
        text={{ id: 'button.cancel' }}
        onClick={onCancelClick}
        isFullSize={isMobile}
      />
      {isLoading ? (
        <PendingButton
          isPending={isLoading}
          text={{ id: 'button.pending' }}
          rounded="s"
          isFullSize={isMobile}
        />
      ) : (
        <Button
          mode="primarySolid"
          disabled={!selectedAction || isActionDisabled}
          text={{ id: submitText }}
          isFullSize={isMobile}
          type="submit"
        />
      )}
    </div>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
