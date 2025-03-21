import { ApolloError, useApolloClient } from '@apollo/client';
import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useEffect, type FC, useState } from 'react';
import { type FieldError, useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { TourTargets } from '~common/Tours/enums.ts';
import { Action } from '~constants/actions.ts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { GetTotalColonyActionsDocument, SearchActionsDocument } from '~gql';
import { useDraftAgreement } from '~hooks/useDraftAgreement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { formatText } from '~utils/intl.ts';
import { isQueryActive } from '~utils/isQueryActive.ts';
import ActionTypeSelect from '~v5/common/ActionSidebar/ActionTypeSelect.tsx';
import {
  ACTION_TITLE_MAX_LENGTH,
  ACTION_TYPE_FIELD_NAME,
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TITLE_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import useHasActionPermissions from '~v5/common/ActionSidebar/hooks/permissions/useHasActionPermissions.ts';
import useHasNoDecisionMethods from '~v5/common/ActionSidebar/hooks/permissions/useHasNoDecisionMethods.ts';
import useActionFormProps from '~v5/common/ActionSidebar/hooks/useActionFormProps.ts';
import useSidebarActionForm from '~v5/common/ActionSidebar/hooks/useSidebarActionForm.ts';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';
import NotificationBanner from '~v5/shared/NotificationBanner/NotificationBanner.tsx';

import ActionButtons from '../ActionButtons.tsx';
import ActionSidebarDescription from '../ActionSidebarDescription/ActionSidebarDescription.tsx';
import RemoveDraftModal from '../RemoveDraftModal/RemoveDraftModal.tsx';

import { useGetFormActionErrors } from './hooks.ts';
import InputsOrderContextProvider from './InputsOrderContext/InputsOrderContextProvider.tsx';
import { MultiSigMembersError } from './partials/MultiSigMembersError.tsx';
import NoPermissionsError from './partials/NoPermissionsError.tsx';
import NoReputationError from './partials/NoReputationError.tsx';
import { SidebarBanner } from './partials/SidebarBanner.tsx';
import {
  type ActionSidebarContentProps,
  type ActionSidebarFormContentProps,
} from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.ActionSidebarContent';

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
});

const ActionSidebarFormContent: FC<ActionSidebarFormContentProps> = ({
  getFormOptions,
  actionFormProps: { primaryButton, onFormClose },
  customError,
}) => {
  const { user } = useAppContext();
  const { formComponent: FormComponent, selectedAction } =
    useSidebarActionForm();
  const { readonly } = useAdditionalFormOptionsContext();
  const { flatFormErrors } = useGetFormActionErrors();

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

  const { getValues, reset } = useFormContext();

  const formValues = getValues();

  const actionType = formValues[ACTION_TYPE_FIELD_NAME];
  const decisionMethod = formValues[DECISION_METHOD_FIELD_NAME];

  // if we switch decision method to something not multisig, we "stop" loading and assume we can create the action
  useEffect(() => {
    setAreMemberPermissionsLoading(false);
    setCanCreateAction(true);
  }, [decisionMethod]);

  const hasPermissions = useHasActionPermissions();
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const isSubmitDisabled =
    !selectedAction ||
    hasPermissions === false ||
    areMemberPermissionsLoading ||
    !canCreateAction ||
    hasNoDecisionMethods;

  const [
    isRemoveDraftModalVisible,
    { toggleOn: showRemoveDraftModal, toggleOff: hideRemoveDraftModal },
  ] = useToggle();

  const { draftAgreement } = useDraftAgreement();

  useEffect(() => {
    if (
      actionType === Action.CreateDecision &&
      draftAgreement &&
      !formValues[TITLE_FIELD_NAME] &&
      !formValues[DESCRIPTION_FIELD_NAME] &&
      !isRemoveDraftModalVisible
    ) {
      showRemoveDraftModal();
    }
  }, [
    actionType,
    draftAgreement,
    formValues,
    isRemoveDraftModalVisible,
    showRemoveDraftModal,
  ]);

  return (
    <>
      <div className="flex-grow overflow-y-auto overflow-x-hidden px-6">
        <FormTextareaBase
          name={TITLE_FIELD_NAME}
          placeholder={formatText({ id: 'placeholder.title' })}
          className="leading-tight text-gray-900 transition-colors heading-3"
          message={false}
          maxLength={ACTION_TITLE_MAX_LENGTH}
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
          wrapperClassName="w-full"
        />
        {selectedAction && (
          <div
            className="text-md text-gray-900"
            data-testid="action-sidebar-description"
          >
            <ActionSidebarDescription />
          </div>
        )}
        <SidebarBanner />
        {decisionMethod === DecisionMethod.MultiSig && (
          <MultiSigMembersError
            updateCanCreateAction={updateCanCreateAction}
            updateMembersLoadingState={updateMembersLoadingState}
          />
        )}
        {!readonly && <NoPermissionsError />}
        <ActionTypeSelect
          className={clsx(
            'mt-7 flex min-h-[1.875rem] flex-col justify-center',
            {
              'mb-3': FormComponent,
            },
          )}
        />
        {FormComponent && <FormComponent getFormOptions={getFormOptions} />}

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
            primaryButton={primaryButton}
            onFormClose={onFormClose}
          />
        </div>
      )}
      {draftAgreement && (
        <RemoveDraftModal
          isOpen={isRemoveDraftModalVisible}
          onCloseClick={() => {
            reset({
              [ACTION_TYPE_FIELD_NAME]: '',
            });
            hideRemoveDraftModal();
          }}
          onCreateNewClick={hideRemoveDraftModal}
          onViewDraftClick={() => {
            reset({
              [ACTION_TYPE_FIELD_NAME]: Action.CreateDecision,
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
    </>
  );
};

const ActionSidebarContent: FC<ActionSidebarContentProps> = ({
  formRef,
  defaultValues,
}) => {
  const { getFormOptions, actionFormProps } = useActionFormProps(defaultValues);
  const client = useApolloClient();

  const [customError, setCustomError] = useState<null | Pick<
    FieldError,
    'message'
  >>(null);

  return (
    <div
      className="flex w-full flex-grow overflow-hidden"
      data-tour={TourTargets.ActionsPanel}
      data-testid="action-sidebar-content"
    >
      <div className="w-full flex-grow pb-6 pt-8">
        <ActionForm
          {...actionFormProps}
          key={actionFormProps.mode}
          className="flex h-full flex-col"
          innerRef={formRef}
          onError={(error) => {
            console.error(error);

            // Auth failed before transaction was sent
            if (
              (error.message as unknown) === 'Auth failed' ||
              (error.code as unknown) === 4001
            ) {
              setCustomError({ message: formatText(MSG.apolloNetworkError) });
              return;
            }
            // Mutation failed in saga
            if (error instanceof ApolloError) {
              const { networkError } = error;

              const statusCode = (networkError as { statusCode?: number })
                ?.statusCode;

              if (statusCode === 403) {
                setCustomError({ message: formatText(MSG.apolloNetworkError) });
              }
              return;
            }
            if (error.arbitraryTxActionFailed) {
              setCustomError({ message: formatText(MSG.arbitraryTxError) });
            }
          }}
          onSuccess={() => {
            if (isQueryActive('SearchActions')) {
              client.refetchQueries({
                include: [SearchActionsDocument],
              });
            }

            if (isQueryActive('GetTotalColonyActions')) {
              client.refetchQueries({
                include: [GetTotalColonyActionsDocument],
              });
            }

            actionFormProps?.onSuccess?.();
          }}
          testId="action-form"
        >
          <InputsOrderContextProvider>
            <ActionSidebarFormContent
              getFormOptions={getFormOptions}
              actionFormProps={actionFormProps}
              customError={customError}
            />
          </InputsOrderContextProvider>
        </ActionForm>
      </div>
    </div>
  );
};

ActionSidebarContent.displayName = displayName;

export default ActionSidebarContent;
