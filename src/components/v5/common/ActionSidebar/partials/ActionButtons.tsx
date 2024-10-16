import { SpinnerGap } from '@phosphor-icons/react';
import React, { type ReactNode, type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { isElementInsideModalOrPortal } from '~context/ActionSidebarContext/utils.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import { getDraftDecisionFromStore } from '~utils/decisions.ts';
import IconButton from '~v5/shared/Button/IconButton.tsx';
import Button from '~v5/shared/Button/index.ts';

import {
  ACTION_TYPE_FIELD_NAME,
  CREATED_IN_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TITLE_FIELD_NAME,
} from '../consts.ts';

import {
  useIsFieldDisabled,
  useSubmitButtonDisabled,
  useSubmitButtonText,
} from './hooks.ts';

interface Props {
  extraButtons?: ReactNode;
  isActionDisabled?: boolean;
}

const displayName = 'v5.common.ActionSidebar.partials.ActionButtons';

const ActionButtons: FC<Props> = ({ extraButtons, isActionDisabled }) => {
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const submitText = useSubmitButtonText();
  const isButtonDisabled = useSubmitButtonDisabled();
  const {
    formState: { isSubmitting, dirtyFields },
    // getValues,
  } = useFormContext();
  const { hide } = useActionSidebarContext();
  const isFieldDisabled = useIsFieldDisabled();

  // FIXME: YUP
  // const draftAgreement = useSelector(
  //   getDraftDecisionFromStore(user?.walletAddress || '', colony.colonyAddress),
  // );

  // const formValues = getValues();
  // const selectedActionType = formValues[ACTION_TYPE_FIELD_NAME];
  // FIXME: AAAAH IT'S ABSOLUTELY EVERYWHERE
  // const createDecisionActionSelected =
  //   selectedActionType === Action.CreateDecision;

  // FIXME: AAAAH IT'S ABSOLUTELY EVERYWHERE (consider removing this terrible thing)
  // We should See if we can consolidate with the ActionFormLayout
  // Put this into the draft agreement buttons
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
  //   if (Object.keys(dirtyFields).length > 0 && !isFilledWithDraftData) {
  //     // toggleCancelModalOn();
  //     return false;
  //   }
  //
  //   return undefined;
  // });

  return (
    <div
      className="mt-8 flex flex-col-reverse items-center
        justify-between gap-6 border-t border-gray-200 px-6 pt-6 sm:flex-row"
    >
      {/* {createDecisionActionSelected && <SaveDraftButton />} */}
      {extraButtons}
      <div
        className="ml-auto flex w-full flex-col-reverse items-center gap-2
        sm:w-auto sm:flex-row"
      >
        <Button
          mode="primaryOutline"
          text={{ id: 'button.cancel' }}
          onClick={hide}
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
            type="submit"
          />
        )}
      </div>
    </div>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
