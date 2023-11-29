import React, { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { useMobile } from '~hooks';
import Button, { TxButton } from '~v5/shared/Button';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { ActionButtonsProps } from '../types';
import { useSubmitButtonText } from './hooks';
import { useCloseSidebarClick } from '../hooks';
import Icon from '~shared/Icon';

const displayName = 'v5.common.ActionSidebar.partials.ActionButtons';

const ActionButtons: FC<ActionButtonsProps> = ({ isActionDisabled }) => {
  const isMobile = useMobile();
  const submitText = useSubmitButtonText();
  const {
    formState: { isSubmitting, dirtyFields },
  } = useFormContext();
  const {
    actionSidebarToggle: [, { useRegisterOnBeforeCloseCallback }],
    cancelModalToggle: [isCancelModalOpen, { toggleOn: toggleCancelModalOn }],
  } = useActionSidebarContext();
  const { closeSidebarClick } = useCloseSidebarClick();

  useRegisterOnBeforeCloseCallback(() => {
    if (Object.keys(dirtyFields).length > 0 && !isCancelModalOpen) {
      toggleCancelModalOn();

      return false;
    }

    return undefined;
  });

  return (
    <div
      className="flex items-center flex-col-reverse sm:flex-row
        justify-end gap-2 pt-6 mt-8 border-t border-gray-200 px-6"
    >
      <Button
        mode="primaryOutline"
        text={{ id: 'button.cancel' }}
        onClick={closeSidebarClick}
        isFullSize={isMobile}
      />
      {isSubmitting ? (
        <TxButton
          rounded="s"
          isFullSize={isMobile}
          text={{ id: 'button.pending' }}
          icon={
            <span className="flex shrink-0 ml-1.5">
              <Icon
                name="spinner-gap"
                className="animate-spin"
                appearance={{ size: 'tiny' }}
              />
            </span>
          }
        />
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
