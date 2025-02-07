import { SpinnerGap } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Action } from '~constants/actions.ts';
import { useMobile } from '~hooks/index.ts';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import Button from '~v5/shared/Button/index.ts';

import { ACTION_TYPE_FIELD_NAME } from '../consts.ts';
import useCloseSidebarClick from '../hooks/useCloseSidebarClick.ts';
import { type ActionButtonsProps } from '../types.ts';

import {
  useIsFieldDisabled,
  useSubmitButtonDisabled,
  useSubmitButtonText,
} from './hooks.ts';
import SaveDraftButton from './SaveDraftButton/SaveDraftButton.tsx';

const displayName = 'v5.common.ActionSidebar.partials.ActionButtons';

const ActionButtons: FC<ActionButtonsProps> = ({
  isActionDisabled,
  primaryButton,
  onFormClose,
}) => {
  const isMobile = useMobile();
  const submitText = useSubmitButtonText();
  const isButtonDisabled = useSubmitButtonDisabled();
  const {
    formState: { isSubmitting },
    getValues,
  } = useFormContext();
  const { closeSidebarClick } = useCloseSidebarClick();
  const isFieldDisabled = useIsFieldDisabled();

  const formValues = getValues();
  const selectedActionType = formValues[ACTION_TYPE_FIELD_NAME];
  const createDecisionActionSelected =
    selectedActionType === Action.CreateDecision;

  const primaryButtonType = primaryButton?.type ?? 'submit';

  return (
    <div
      className="mt-8 flex flex-col-reverse items-center
        justify-between gap-6 border-t border-gray-200 px-6 pt-6 sm:flex-row"
    >
      {createDecisionActionSelected && <SaveDraftButton />}
      <div
        className="ml-auto flex w-full flex-col-reverse items-center gap-2
        sm:w-auto sm:flex-row"
      >
        <Button
          mode="primaryOutline"
          text={{ id: 'button.cancel' }}
          onClick={() =>
            closeSidebarClick({
              shouldShowCancelModal: onFormClose?.shouldShowCancelModal,
            })
          }
          isFullSize={isMobile}
        />
        {isSubmitting ? (
          <IconButton
            rounded="s"
            isFullSize={isMobile}
            text={{ id: 'button.pending' }}
            icon={
              <span className="ml-2 flex shrink-0">
                <SpinnerGap size={18} className="animate-spin" />
              </span>
            }
            className="!px-4 !text-md"
            title={{ id: 'button.pending' }}
            ariaLabel={{ id: 'button.pending' }}
          />
        ) : (
          <Button
            mode="primarySolid"
            disabled={isActionDisabled || isButtonDisabled || isFieldDisabled}
            text={submitText}
            isFullSize={isMobile}
            type={primaryButtonType}
            onClick={
              primaryButtonType === 'button'
                ? primaryButton?.onClick
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
