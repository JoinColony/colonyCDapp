import { SpinnerGap } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks/index.ts';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import Button from '~v5/shared/Button/index.ts';

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
}) => {
  const isMobile = useMobile();
  const {
    formState: { isSubmitting },
  } = useFormContext();
  const {
    hideActionSidebar,
    data,
    // registerOnBeforeCloseCallback, hideActionSidebar,
    // actionSidebarToggle: [, { useRegisterOnBeforeCloseCallback, toggleOff }],
    // cancelModalToggle: [isCancelModalOpen, { toggleOn: toggleCancelModalOn }],
  } = useActionSidebarContext();
  const { action } = data;

  const submitText = useSubmitButtonText(action);
  const isButtonDisabled = useSubmitButtonDisabled(action);
  const isFieldDisabled = useIsFieldDisabled(action);

  // const draftAgreement = useSelector(
  //   getDraftDecisionFromStore(user?.walletAddress || '', colony.colonyAddress),
  // );
  // FIXME: Check if this still works: https://github.com/JoinColony/colonyCDapp/commit/68de5ad4602e67995003942fafc0e4b5015f3bba
  // FIXME: Also check this: https://github.com/JoinColony/colonyCDapp/commit/68de5ad4602e67995003942fafc0e4b5015f3bba#diff-2355471874cbf42712015f39278407d6fafb1ffaf70efbdbe6873fb65f8807c1

  const createDecisionActionSelected = action === Action.CreateDecision;

  // FIXME: Check if this is still necessary
  // useRegisterOnBeforeCloseCallback((element) => {
  //   const isClickedInside = isElementInsideModalOrPortal(element);
  //   const isFilledWithDraftData =
  //     createDecisionActionSelected &&
  //     formValues[TITLE_FIELD_NAME] === draftAgreement?.title &&
  //     formValues[DESCRIPTION_FIELD_NAME] === draftAgreement?.description &&
  //     formValues[CREATED_IN_FIELD_NAME] === draftAgreement?.motionDomainId;
  //
  //   if (!isClickedInside) {
  //     return false;
  //   }
  //
  //   if (
  //     Object.keys(dirtyFields).length > 0 &&
  //     !isCancelModalOpen &&
  //     !isFilledWithDraftData
  //   ) {
  //     toggleCancelModalOn();
  //     return false;
  //   }
  //
  //   return undefined;
  // });

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
          onClick={hideActionSidebar}
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
