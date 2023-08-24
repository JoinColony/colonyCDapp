import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { useMobile } from '~hooks';
import Button, { PendingButton } from '~v5/shared/Button';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { ActionButtonsProps } from '../types';
import { useGetSubmitButton } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.ActionButtons';

const ActionButtons: FC<ActionButtonsProps> = ({
  isActionDisabled,
  toggleCancelModal,
}) => {
  const isMobile = useMobile();
  const submitText = useGetSubmitButton();
  const methods = useFormContext();
  const { selectedAction } = useActionSidebarContext();

  const isLoading = methods?.formState?.isSubmitting;

  return (
    <div
      className="flex items-center flex-col-reverse sm:flex-row 
        justify-end gap-2 p-6 border-t border-gray-200"
    >
      <Button
        mode="primaryOutline"
        text={{ id: 'button.cancel' }}
        onClick={toggleCancelModal}
        isFullSize={isMobile}
      />
      {isLoading ? (
        <PendingButton
          isPending={isLoading}
          text={{ id: 'button.pending' }}
          rounded="s"
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
