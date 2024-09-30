import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useEffect, type FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { getDraftDecisionFromStore } from '~utils/decisions.ts';
import { formatText } from '~utils/intl.ts';
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
import useSidebarActionForm from '~v5/common/ActionSidebar/hooks/useSidebarActionForm.ts';
import ActionButtons from '~v5/common/ActionSidebar/partials/ActionButtons.tsx';
import { MultiSigMembersError } from '~v5/common/ActionSidebar/partials/ActionSidebarContent/partials/MultiSigMembersError/MultiSigMembersError.tsx';
import ActionSidebarDescription from '~v5/common/ActionSidebar/partials/ActionSidebarDescription/ActionSidebarDescription.tsx';
import RemoveDraftModal from '~v5/common/ActionSidebar/partials/RemoveDraftModal/RemoveDraftModal.tsx';
import { type CreateActionFormProps } from '~v5/common/ActionSidebar/types.ts';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

import { useGetFormActionErrors } from '../hooks.ts';

import NoPermissionsError from './NoPermissionsError.tsx';
import NoReputationError from './NoReputationError.tsx';
import { SidebarBanner } from './SidebarBanner.tsx';

const displayName = 'v5.common.ActionSidebar.CreateAction.CreateActionForm';

const CreateActionForm: FC<CreateActionFormProps> = ({ getFormOptions }) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { formComponent: FormComponent, selectedAction } =
    useSidebarActionForm();
  const { readonly } = useAdditionalFormOptionsContext();
  const { flatFormErrors } = useGetFormActionErrors();
  const { setFormDirty } = useActionSidebarContext();

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
      isDirty,
      errors: { this: customError },
    },
    getValues,
    reset,
  } = useFormContext();

  const formValues = getValues();

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

  const [isModalVisible, { toggleOn: showModal, toggleOff: hideModal }] =
    useToggle();

  const draftAgreement = useSelector(
    getDraftDecisionFromStore(user?.walletAddress || '', colony.colonyAddress),
  );

  useEffect(() => {
    if (
      formValues[ACTION_TYPE_FIELD_NAME] === Action.CreateDecision &&
      draftAgreement &&
      !formValues[TITLE_FIELD_NAME] &&
      !formValues[DESCRIPTION_FIELD_NAME] &&
      !isModalVisible
    ) {
      showModal();
    }
    setFormDirty(isDirty);
  }, [
    draftAgreement,
    formValues,
    isModalVisible,
    showModal,
    isDirty,
    setFormDirty,
  ]);

  return (
    <>
      <div className="flex-grow overflow-y-auto px-6">
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
      </div>
      {!readonly && (
        <div className="mt-auto">
          <ActionButtons isActionDisabled={isSubmitDisabled} />
        </div>
      )}
      {draftAgreement && (
        <RemoveDraftModal
          isOpen={isModalVisible}
          onCloseClick={() => {
            reset({
              [ACTION_TYPE_FIELD_NAME]: '',
            });
            hideModal();
          }}
          onCreateNewClick={hideModal}
          onViewDraftClick={() => {
            reset({
              [ACTION_TYPE_FIELD_NAME]: Action.CreateDecision,
              [DECISION_METHOD_FIELD_NAME]: DecisionMethod.Reputation,
              [CREATED_IN_FIELD_NAME]: draftAgreement.motionDomainId,
              [TITLE_FIELD_NAME]: draftAgreement.title,
              [DESCRIPTION_FIELD_NAME]: draftAgreement.description,
              walletAddress: user?.walletAddress,
            });
            hideModal();
          }}
        />
      )}
    </>
  );
};

CreateActionForm.displayName = displayName;

export default CreateActionForm;
