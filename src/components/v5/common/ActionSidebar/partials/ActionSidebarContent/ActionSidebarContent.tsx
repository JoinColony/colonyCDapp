import { useApolloClient } from '@apollo/client';
import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useEffect, type FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Action } from '~constants/actions.ts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { GetTotalColonyActionsDocument, SearchActionsDocument } from '~gql';
import useToggle from '~hooks/useToggle/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { getDraftDecisionFromStore } from '~utils/decisions.ts';
import { formatText } from '~utils/intl.ts';
import { isQueryActive } from '~utils/isQueryActive.ts';
import ActionTypeSelect from '~v5/common/ActionSidebar/ActionTypeSelect.tsx';
import {
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
import { MultiSigMembersError } from './partials/MultiSigMembersError/MultiSigMembersError.tsx';
import NoPermissionsError from './partials/NoPermissionsError.tsx';
import NoReputationError from './partials/NoReputationError.tsx';
import { SidebarBanner } from './partials/SidebarBanner.tsx';
import {
  type ActionSidebarContentProps,
  type ActionSidebarFormContentProps,
} from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.ActionSidebarContent';

const ActionSidebarFormContent: FC<ActionSidebarFormContentProps> = ({
  getFormOptions,
  actionFormProps: { primaryButton },
}) => {
  const { colony } = useColonyContext();
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

  const {
    formState: {
      errors: { this: customError },
    },
    getValues,
    reset,
  } = useFormContext();

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

  const draftAgreement = useSelector(
    getDraftDecisionFromStore(user?.walletAddress || '', colony.colonyAddress),
  );

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
            <NotificationBanner icon={WarningCircle} status="error">
              {customError.message?.toString()}
            </NotificationBanner>
          </div>
        )}
        {flatFormErrors.length ? (
          <div className="mt-7">
            <NotificationBanner
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

  return (
    <div className="flex w-full flex-grow overflow-hidden">
      <div className="w-full flex-grow pb-6 pt-8">
        <ActionForm
          {...actionFormProps}
          key={actionFormProps.mode}
          className="flex h-full flex-col"
          innerRef={formRef}
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
        >
          <ActionSidebarFormContent
            getFormOptions={getFormOptions}
            actionFormProps={actionFormProps}
          />
        </ActionForm>
      </div>
    </div>
  );
};

ActionSidebarContent.displayName = displayName;

export default ActionSidebarContent;
