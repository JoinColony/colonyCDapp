import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useEffect, type FC, useState, useCallback } from 'react';
import { type FieldError, useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';
import { useSelector } from 'react-redux';

import { TourTargets } from '~common/Tours/enums.ts';
import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useConfirmModal from '~hooks/useConfirmModal.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { getDraftDecisionFromStore } from '~utils/decisions.ts';
import { formatText } from '~utils/intl.ts';
import ActionTypeSelect from '~v5/common/ActionSidebar/ActionTypeSelect.tsx';
import {
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  NON_RESETTABLE_FIELDS,
  TITLE_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useHasActionPermissions from '~v5/common/ActionSidebar/hooks/permissions/useHasActionPermissions.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import ActionButtons from '~v5/common/ActionSidebar/partials/ActionButtons.tsx';
import ActionSidebarDescription from '~v5/common/ActionSidebar/partials/ActionSidebarDescription/ActionSidebarDescription.tsx';
import RemoveDraftModal from '~v5/common/ActionSidebar/partials/RemoveDraftModal/RemoveDraftModal.tsx';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';
import Modal from '~v5/shared/Modal/Modal.tsx';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

import { useGetFormActionErrors } from '../hooks.ts';

import MultiSigMembersError from './MultiSigMembersError.tsx';
import NoPermissionsError from './NoPermissionsError.tsx';
import NoReputationError from './NoReputationError.tsx';
import { SidebarBanner } from './SidebarBanner.tsx';

const displayName = 'v5.common.ActionSidebar.CreateAction.CreateActionForm';

const MSG = defineMessages({
  apolloNetworkError: {
    id: `${displayName}.apolloNetworkError`,
    defaultMessage:
      'There has been a database error. Your transaction may still have been processed.',
  },
  arbitraryTxError: {
    id: `${displayName}.arbitraryTxError`,
    defaultMessage:
      'Contract execution failed. Please verify your inputs match the contract requirements and try again.',
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
  formComponent: FC;
  customError?: null | Pick<FieldError, 'message'>;
}

const preventClose = () => Promise.resolve(false);

const CreateActionForm: FC<Props> = ({
  formComponent,
  // getFormOptions,
  // actionFormProps: { primaryButton },
  customError,
}) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { readonly } = useAdditionalFormOptionsContext();
  const { flatFormErrors } = useGetFormActionErrors();
  const {
    registerOnBeforeCloseCallback,
    unregisterOnBeforeCloseCallback,
    data,
  } = useActionSidebarContext();
  const { action } = data;
  const FormComponent = formComponent;

  const [modalText, setModalText] = useState(modalDefaultText);
  const { isModalOpen, openModal, handleConfirm, handleCancel } =
    useConfirmModal();
  const openCancelModal = useCallback(async () => {
    // The modal is outside of the sidebar so it would technically close
    // because it's registered as an outside click
    // Here we prevent the closing of the sidebar by just resolving to false
    registerOnBeforeCloseCallback(preventClose);
    setModalText(modalDefaultText);
    const confirmed = await openModal();
    unregisterOnBeforeCloseCallback(preventClose);
    return confirmed;
  }, [
    openModal,
    registerOnBeforeCloseCallback,
    unregisterOnBeforeCloseCallback,
  ]);
  const openChangeModal = useCallback(async () => {
    // See explanation above
    registerOnBeforeCloseCallback(preventClose);
    setModalText({
      title: formatText(MSG.changeActionModalTitle),
      subtitle: formatText(MSG.changeActionModalTitle),
      confirmMessage: formatText(MSG.changeActionButton),
      closeMessage: formatText(MSG.continueActionButton),
    });
    const confirmed = await openModal();
    unregisterOnBeforeCloseCallback(preventClose);
    return confirmed;
  }, [
    openModal,
    registerOnBeforeCloseCallback,
    unregisterOnBeforeCloseCallback,
  ]);

  const [areMemberPermissionsLoading, setAreMemberPermissionsLoading] =
    useState(false);
  // Until we choose Multi-Sig as the decision method we can safely assume this is true
  const [canCreateAction, setCanCreateAction] = useState(true);

  const updateMembersLoadingState = (isLoading: boolean) => {
    setAreMemberPermissionsLoading(isLoading);
  };

  const updateCanCreateAction = (canCreate: boolean) => {
    setCanCreateAction(canCreate);
  };

  const {
    formState: { isDirty, dirtyFields },
    reset,
    watch,
  } = useFormContext();

  // const {
  //   field: { onChange },
  // } = useController({ name: ACTION_TYPE_FIELD_NAME });
  //

  console.log(isDirty, dirtyFields);

  const decisionMethod = watch(DECISION_METHOD_FIELD_NAME);
  const title = watch(TITLE_FIELD_NAME);
  const description = watch(DESCRIPTION_FIELD_NAME);

  // if we switch decision method to something not multisig, we "stop" loading and assume we can create the action
  useEffect(() => {
    setAreMemberPermissionsLoading(false);
    setCanCreateAction(true);
  }, [decisionMethod]);

  const hasPermissions = useHasActionPermissions();
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const isSubmitDisabled =
    !action ||
    hasPermissions === false ||
    areMemberPermissionsLoading ||
    !canCreateAction ||
    hasNoDecisionMethods;

  const [
    isRemoveDraftModalVisible,
    { toggleOn: showRemoveDraftModal, toggleOff: hideRemoveDraftModal },
  ] = useToggle();

  const draftAgreement = useSelector(
    getDraftDecisionFromStore(user?.walletAddress || '', colony.colonyAddress),
  );

  useEffect(() => {
    if (
      action === Action.CreateDecision &&
      draftAgreement &&
      !description &&
      !title &&
      !isRemoveDraftModalVisible
    ) {
      showRemoveDraftModal();
    }
    // FIXME: Do we need this??
    // setFormDirty(isDirty);
  }, [
    action,
    draftAgreement,
    isRemoveDraftModalVisible,
    showRemoveDraftModal,
    isDirty,
    title,
    description,
  ]);

  useEffect(() => {
    // When the form is dirty, we register a before close callback that will open the confirmation modal
    // This prevents the sidebar from closing
    if (!isDirty) {
      return undefined;
    }
    registerOnBeforeCloseCallback(openCancelModal);
    return () => unregisterOnBeforeCloseCallback(openCancelModal);
  }, [
    isDirty,
    openCancelModal,
    registerOnBeforeCloseCallback,
    unregisterOnBeforeCloseCallback,
  ]);

  const handleActionSelect = useCallback(
    async (newAction: Action) => {
      if (newAction === action) {
        return;
      }
      const hasMadeChanges = Object.keys(dirtyFields).find(
        (fieldName) => NON_RESETTABLE_FIELDS.indexOf(fieldName) === -1,
      );
      console.log('changed action type');

      // if (hasMadeChanges) {
      //   const confirmed = await openChangeModal();
      //   if (!confirmed) {
      //     return;
      //   }
      // }
      // onChange(actionType);
    },
    [dirtyFields, openChangeModal, action],
  );

  // FIXME: Somewhere in the formProps (maybe transform or so), add ACTION_TYPE_FIELD_NAME so that it gets send to the database

  return (
    <>
      <div
        className="flex-grow overflow-y-auto overflow-x-hidden px-6"
        data-tour={TourTargets.ActionsPanel}
        data-testid="action-sidebar-content"
      >
        <FormTextareaBase
          name={TITLE_FIELD_NAME}
          placeholder={formatText({ id: 'placeholder.title' })}
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
            'mb-2': !!action,
          })}
        />
        {action && (
          <div
            className="text-md text-gray-900"
            data-testid="action-sidebar-description"
          >
            <ActionSidebarDescription action={action} />
          </div>
        )}
        <SidebarBanner action={action} />
        {decisionMethod === DecisionMethod.MultiSig && (
          <MultiSigMembersError
            action={action}
            updateCanCreateAction={updateCanCreateAction}
            updateMembersLoadingState={updateMembersLoadingState}
          />
        )}
        {!readonly && <NoPermissionsError action={action} />}
        <ActionTypeSelect
          className={clsx(
            'mt-7 flex min-h-[1.875rem] flex-col justify-center',
            {
              'mb-3': FormComponent,
            },
          )}
          onSelect={handleActionSelect}
          action={action}
        />
        {FormComponent && <FormComponent />}

        <NoReputationError />
        {customError && (
          <div className="mt-7">
            <NotificationBanner
              icon={WarningCircle}
              status="error"
              testId="action-sidebar-custom-error"
            >
              {customError.message?.toString()}
            </NotificationBanner>
          </div>
        )}
        {flatFormErrors.length ? (
          <div className="mt-7">
            <NotificationBanner
              testId="action-sidebar-error"
              status="error"
              icon={WarningCircle}
              description={
                <ul className="list-outside list-disc text-negative-400">
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
      </div>
      {!readonly && (
        <div className="mt-auto">
          <ActionButtons
            isActionDisabled={isSubmitDisabled}
            // FIXME: Re-add this
            // primaryButton={primaryButton}
          />
        </div>
      )}
      {draftAgreement && (
        <RemoveDraftModal
          isOpen={isRemoveDraftModalVisible}
          onCloseClick={() => {
            // FIXME: Remove the action
            // reset({
            //   [ACTION_TYPE_FIELD_NAME]: '',
            // });
            hideRemoveDraftModal();
          }}
          onCreateNewClick={hideRemoveDraftModal}
          onViewDraftClick={() => {
            // FIXME: select CreateDecision action Type
            reset({
              [DECISION_METHOD_FIELD_NAME]: DecisionMethod.Reputation,
              [CREATED_IN_FIELD_NAME]: draftAgreement.motionDomainId,
              [TITLE_FIELD_NAME]: draftAgreement.title,
              [DESCRIPTION_FIELD_NAME]: draftAgreement.description,
              walletAddress: user?.walletAddress,
            });
            hideRemoveDraftModal();
          }}
        />
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        icon={WarningCircle}
        buttonMode="primarySolid"
        {...modalText}
      />
    </>
  );
};

CreateActionForm.displayName = displayName;

export default CreateActionForm;
