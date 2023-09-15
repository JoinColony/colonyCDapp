import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { useMobile } from '~hooks';
import Button, { PendingButton } from '~v5/shared/Button';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { ActionButtonsProps } from '../types';
import { useSubmitButtonText } from './hooks';

const displayName = 'v5.common.ActionSidebar.partials.ActionButtons';

const ActionButtons: FC<ActionButtonsProps> = ({ isActionDisabled }) => {
  const isMobile = useMobile();
  const submitText = useSubmitButtonText();
  const {
    formState: { isDirty, isSubmitting },
  } = useFormContext();
  const {
    actionSidebarToggle: [, { toggleOff: toggleActionSidebarOff }],
    cancelModalToggle: [, { toggle: toggleCancelModal }],
  } = useActionSidebarContext();

  const onCancelClick = () => {
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
      {isSubmitting ? (
        <PendingButton rounded="s" isFullSize={isMobile} />
      ) : (
        <Button
          mode="primarySolid"
          disabled={isActionDisabled}
          text={submitText}
          isFullSize={isMobile}
          type="submit"
        />
      )}
    </div>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
