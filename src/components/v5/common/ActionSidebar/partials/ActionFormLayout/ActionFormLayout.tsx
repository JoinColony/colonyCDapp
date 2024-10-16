import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, {
  type PropsWithChildren,
  type FC,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { type CoreAction } from '~actions';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import useConfirmModal from '~hooks/useConfirmModal.ts';
import { formatText } from '~utils/intl.ts';
import noop from '~utils/noop.ts';
import ActionTypeSelect from '~v5/common/ActionSidebar/ActionTypeSelect.tsx';
import {
  ACTION_TYPE_FIELD_NAME,
  NON_RESETTABLE_FIELDS,
  TITLE_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useHasActionPermissions from '~v5/common/ActionSidebar/hooks/permissions/useHasActionPermissions.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import { FormTextareaBase } from '~v5/common/Fields/TextareaBase/index.ts';
import Modal from '~v5/shared/Modal/Modal.tsx';
import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';

import ActionButtons from '../ActionButtons.tsx';
import ActionSidebarDescription from '../ActionSidebarDescription/ActionSidebarDescription.tsx';
import { useGetFormActionErrors } from '../CreateActionSidebar/hooks.ts';
import NoPermissionsError from '../CreateActionSidebar/partials/NoPermissionsError.tsx';
import NoReputationError from '../CreateActionSidebar/partials/NoReputationError.tsx';
import { SidebarBanner } from '../CreateActionSidebar/partials/SidebarBanner.tsx';

const displayName = 'v5.ActionSidebar.ActionFormLayout';

const MSG = defineMessages({
  placeholderTitle: {
    id: `${displayName}.placeholderTitle`,
    defaultMessage: 'Enter title',
  },
  cancelModalTitle: {
    id: `${displayName}.cancelModalTitle`,
    defaultMessage: 'Do you wish to cancel the action creation?',
  },
  cancelModalSubtitle: {
    id: `${displayName}.cancelModalSubtitle`,
    defaultMessage: 'All content and settings will be lost.',
  },
  changeActionModalTitle: {
    id: `${displayName}.changeActionModalTitle`,
    defaultMessage: 'Do you wish to change the action?',
  },
  changeActionButton: {
    id: `${displayName}.changeActionButton`,
    defaultMessage: 'Yes, change the action',
  },
  cancelActionButton: {
    id: `${displayName}.cancelActionButton`,
    defaultMessage: 'Yes, cancel the action',
  },
  continueActionButton: {
    id: `${displayName}.cancelActionButton`,
    defaultMessage: 'No, go back to editing',
  },
});

const modalDefaultText = {
  title: formatText(MSG.cancelModalTitle),
  subtitle: formatText(MSG.cancelModalSubtitle),
  confirmMessage: formatText(MSG.cancelActionButton),
  closeMessage: formatText(MSG.continueActionButton),
};

interface Props {
  extraActionButtons?: ReactNode;
}

// FIXME: The first form field will also always be in here,
// basically everything that is part of every form

const ActionFormLayout: FC<PropsWithChildren<Props>> = ({
  children,
  extraActionButtons,
}) => {
  const {
    formState: {
      isDirty,
      dirtyFields,
      errors: { this: formError },
    },
    getValues,
    reset,
    watch,
  } = useFormContext();

  const [modalText, setModalText] = useState(modalDefaultText);
  const { isModalOpen, openModal, handleConfirm, handleCancel } =
    useConfirmModal();
  const openCancelModal = useCallback(() => {
    setModalText(modalDefaultText);
    return openModal();
  }, [openModal]);
  const openChangeModal = useCallback(() => {
    setModalText({
      title: formatText(MSG.changeActionModalTitle),
      subtitle: formatText(MSG.changeActionModalTitle),
      confirmMessage: formatText(MSG.changeActionButton),
      closeMessage: formatText(MSG.continueActionButton),
    });
    return openModal();
  }, [openModal]);

  const { registerOnBeforeCloseCallback, unregisterOnBeforeCloseCallback } =
    useActionSidebarContext();

  const {
    field: { onChange },
  } = useController({ name: ACTION_TYPE_FIELD_NAME });

  const selectedAction: CoreAction | undefined = watch(ACTION_TYPE_FIELD_NAME);

  // FIXME: consolidate the errors here
  const { flatFormErrors } = useGetFormActionErrors();
  const hasPermissions = useHasActionPermissions();
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  // FIXME: The form layout does not need to know about decision methods or permissions
  // // OR Reputation (see below)
  const isSubmitDisabled =
    !selectedAction || hasPermissions === false || hasNoDecisionMethods;

  useEffect(() => {
    // When the form is dirty, we register a before close callback that will open the confirmation modal
    if (!isDirty) {
      return noop;
    }
    registerOnBeforeCloseCallback(openCancelModal);
    return () => unregisterOnBeforeCloseCallback(openCancelModal);
  }, [
    isDirty,
    openCancelModal,
    registerOnBeforeCloseCallback,
    unregisterOnBeforeCloseCallback,
  ]);

  const onActionSelect = useCallback(
    async (actionType: CoreAction) => {
      if (actionType === selectedAction) {
        return;
      }
      const hasMadeChanges = Object.keys(dirtyFields).find(
        (fieldName) => NON_RESETTABLE_FIELDS.indexOf(fieldName) === -1,
      );

      if (hasMadeChanges) {
        const confirmed = await openChangeModal();
        if (confirmed) {
          return;
        }
      }
      onChange(actionType);
    },
    [dirtyFields, onChange, openChangeModal, selectedAction],
  );

  return (
    <div className="flex-grow overflow-y-auto px-6">
      <FormTextareaBase
        name={TITLE_FIELD_NAME}
        placeholder={formatText(MSG.placeholderTitle)}
        className="leading-tight text-gray-900 transition-colors heading-3"
        message={false}
        shouldFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        onChange={(e) => {
          e.target.value = e.target.value.replace(/[\r\n\v]+/g, '');
        }}
        wrapperClassName={clsx('flex flex-col', {
          'mb-2': selectedAction,
        })}
      />
      {selectedAction && (
        <div className="text-md text-gray-900">
          <ActionSidebarDescription />
        </div>
      )}
      <SidebarBanner />
      <NoPermissionsError />
      <ActionTypeSelect
        className="mb-3 mt-7 flex min-h-[1.875rem] flex-col justify-center"
        onSelect={onActionSelect}
        selectedAction={selectedAction}
      />
      {children}
      <NoReputationError />
      {formError && (
        <div className="mt-7">
          <NotificationBanner icon={WarningCircle} status="error">
            {formError.message?.toString()}
          </NotificationBanner>
        </div>
      )}
      {flatFormErrors.length ? (
        <div className="mt-7">
          <NotificationBanner
            status="error"
            icon={WarningCircle}
            description={
              <ul className="list-inside list-disc text-negative-400">
                {flatFormErrors.map(({ key, message }) => (
                  <li key={key}>{message}</li>
                ))}
              </ul>
            }
          >
            {formatText({ id: 'actionSidebar.fields.error' })}
          </NotificationBanner>
        </div>
      ) : null}
      <div className="mt-auto">
        <ActionButtons
          extraButtons={extraActionButtons}
          isActionDisabled={isSubmitDisabled}
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        icon={WarningCircle}
        buttonMode="primarySolid"
        {...modalText}
      />
    </div>
  );
};

// FIXME: Check if we need this, still
// const defaultValues = NON_RESETTABLE_FIELDS.reduce(
//   (acc, fieldName) => ({
//     ...acc,
//     [fieldName]:
//       fieldName === ACTION_TYPE_FIELD_NAME
//         ? nextActionType
//         : watch(fieldName),
//   }),
//   {},
// );

// FIXME: we still have to handle draft agreements!!
// copy all necessary shit from CreateActionForm
// See '../CreateActionSidebar/partials/CreateActionForm';

ActionFormLayout.displayName = displayName;

export default ActionFormLayout;
