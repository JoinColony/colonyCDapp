import { SpinnerGap } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { useActionSidebarContext } from '~context/ActionSidebarContext/index.tsx';
import { isElementInsideModalOrPortal } from '~context/ActionSidebarContext/utils.ts';
import { useMobile } from '~hooks/index.ts';
import Button, { TxButton } from '~v5/shared/Button/index.ts';

import { useCloseSidebarClick } from '../hooks/index.ts';
import { type ActionButtonsProps } from '../types.ts';

import {
  useIsFieldDisabled,
  useSubmitButtonDisabled,
  useSubmitButtonText,
} from './hooks.ts';

const displayName = 'v5.common.ActionSidebar.partials.ActionButtons';

const ActionButtons: FC<ActionButtonsProps> = ({ isActionDisabled }) => {
  const isMobile = useMobile();
  const submitText = useSubmitButtonText();
  const isButtonDisabled = useSubmitButtonDisabled();
  const {
    formState: { isSubmitting, dirtyFields },
  } = useFormContext();
  const {
    actionSidebarToggle: [, { useRegisterOnBeforeCloseCallback }],
    cancelModalToggle: [isCancelModalOpen, { toggleOn: toggleCancelModalOn }],
  } = useActionSidebarContext();
  const { closeSidebarClick } = useCloseSidebarClick();
  const isFieldDisabled = useIsFieldDisabled();

  useRegisterOnBeforeCloseCallback((element) => {
    const isClickedInside = isElementInsideModalOrPortal(element);

    if (!isClickedInside) {
      return false;
    }

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
            <span className="flex shrink-0 ml-2">
              <SpinnerGap size={14} className="animate-spin" />
            </span>
          }
          className="!px-4 !text-md"
        />
      ) : (
        <Button
          mode="primarySolid"
          disabled={isActionDisabled || isButtonDisabled || isFieldDisabled}
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
