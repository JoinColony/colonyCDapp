import { SpinnerGap } from '@phosphor-icons/react';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { isElementInsideModalOrPortal } from '~context/ActionSidebarContext/utils.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import { getDraftDecisionFromStore } from '~utils/decisions.ts';
import Button, { TxButton } from '~v5/shared/Button/index.ts';

import {
  ACTION_TYPE_FIELD_NAME,
  CREATED_IN_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TITLE_FIELD_NAME,
} from '../consts.ts';
import useCloseSidebarClick from '../hooks/useCloseSidebarClick.ts';
import { type ActionButtonsProps } from '../types.ts';

import {
  useIsFieldDisabled,
  useSubmitButtonDisabled,
  useSubmitButtonText,
} from './hooks.ts';
import SaveDraftButton from './SaveDraftButton/SaveDraftButton.tsx';

const displayName = 'v5.common.ActionSidebar.partials.ActionButtons';

const ActionButtons: FC<ActionButtonsProps> = ({ isActionDisabled }) => {
  const isMobile = useMobile();
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const submitText = useSubmitButtonText();
  const isButtonDisabled = useSubmitButtonDisabled();
  const {
    formState: { isSubmitting, dirtyFields },
    getValues,
  } = useFormContext();
  const {
    actionSidebarToggle: [, { useRegisterOnBeforeCloseCallback }],
    cancelModalToggle: [isCancelModalOpen, { toggleOn: toggleCancelModalOn }],
  } = useActionSidebarContext();
  const { closeSidebarClick } = useCloseSidebarClick();
  const isFieldDisabled = useIsFieldDisabled();

  const draftAgreement = useSelector(
    getDraftDecisionFromStore(user?.walletAddress || '', colony.colonyAddress),
  );

  const formValues = getValues();
  const selectedActionType = formValues[ACTION_TYPE_FIELD_NAME];
  const createDecisionActionSelected =
    selectedActionType === Action.CreateDecision;

  useRegisterOnBeforeCloseCallback((element) => {
    const isClickedInside = isElementInsideModalOrPortal(element);
    const isFilledWithDraftData =
      createDecisionActionSelected &&
      formValues[TITLE_FIELD_NAME] === draftAgreement?.title &&
      formValues[DESCRIPTION_FIELD_NAME] === draftAgreement?.description &&
      formValues[CREATED_IN_FIELD_NAME] === draftAgreement?.motionDomainId;

    if (!isClickedInside) {
      return false;
    }

    if (
      Object.keys(dirtyFields).length > 0 &&
      !isCancelModalOpen &&
      !isFilledWithDraftData
    ) {
      toggleCancelModalOn();
      return false;
    }

    return undefined;
  });

  return (
    <div
      className="flex items-center flex-col-reverse sm:flex-row
        justify-between gap-6 pt-6 mt-8 border-t border-gray-200 px-6"
    >
      {createDecisionActionSelected && <SaveDraftButton />}
      <div className="flex w-full flex-col-reverse items-center sm:flex-row justify-end gap-2">
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
                <SpinnerGap size={18} className="animate-spin" />
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
    </div>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
