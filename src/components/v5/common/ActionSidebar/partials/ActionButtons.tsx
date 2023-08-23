import React, { FC } from 'react';

import { useMobile } from '~hooks';
import Button from '~v5/shared/Button';
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
  const { selectedAction } = useActionSidebarContext();

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
      <Button
        mode="primarySolid"
        disabled={
          !selectedAction || isActionDisabled
          // || !!Object.keys(methods.formState.errors).length
        }
        text={{ id: submitText }}
        isFullSize={isMobile}
        type="submit"
        // loading={methods?.formState?.isSubmitting}
      />
    </div>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
