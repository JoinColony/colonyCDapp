import { useApolloClient } from '@apollo/client';
import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useEffect, type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { Action } from '~constants/actions.ts';
import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { SearchActionsDocument } from '~gql';
import useToggle from '~hooks/useToggle/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { DecisionMethod } from '~types/actions.ts';
import { getDraftDecisionFromStore } from '~utils/decisions.ts';
import { formatText } from '~utils/intl.ts';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

import ActionTypeSelect from '../../ActionTypeSelect.tsx';
import {
  ACTION_TYPE_FIELD_NAME,
  CREATED_IN_FIELD_NAME,
  DECISION_METHOD_FIELD_NAME,
  DESCRIPTION_FIELD_NAME,
  TITLE_FIELD_NAME,
} from '../../consts.ts';
import useHasActionPermissions from '../../hooks/permissions/useHasActionPermissions.ts';
import useHasNoDecisionMethods from '../../hooks/permissions/useHasNoDecisionMethods.ts';
import useActionFormProps from '../../hooks/useActionFormProps.ts';
import useSidebarActionForm from '../../hooks/useSidebarActionForm.ts';
import ActionButtons from '../ActionButtons.tsx';
import ActionSidebarDescription from '../ActionSidebarDescription/ActionSidebarDescription.tsx';
import Motions from '../Motions/index.ts';
import RemoveDraftModal from '../RemoveDraftModal/RemoveDraftModal.tsx';

import { useGetFormActionErrors } from './hooks.ts';
import NoPermissionsError from './partials/NoPermissionsError.tsx';
import NoReputationError from './partials/NoReputationError.tsx';
import PermissionSidebar from './partials/PermissionSidebar.tsx';
import { SidebarBanner } from './partials/SidebarBanner.tsx';
import {
  type ActionSidebarContentProps,
  type ActionSidebarFormContentProps,
} from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.ActionSidebarContent';

const ActionSidebarFormContent: FC<ActionSidebarFormContentProps> = ({
  getFormOptions,
  isMotion,
}) => {
  const { colony } = useColonyContext();
  const { user } = useAppContext();
  const { formComponent: FormComponent, selectedAction } =
    useSidebarActionForm();
  const { readonly } = useAdditionalFormOptionsContext();
  const { flatFormErrors } = useGetFormActionErrors();

  const {
    formState: {
      errors: { this: customError },
    },
    getValues,
    reset,
  } = useFormContext();

  const hasPermissions = useHasActionPermissions();
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const isSubmitDisabled =
    !selectedAction ||
    hasPermissions === false ||
    hasNoDecisionMethods ||
    flatFormErrors.length > 0;

  const [isModalVisible, { toggleOn: showModal, toggleOff: hideModal }] =
    useToggle();

  const draftAgreement = useSelector(
    getDraftDecisionFromStore(user?.walletAddress || '', colony.colonyAddress),
  );

  const formValues = getValues();

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
  }, [draftAgreement, formValues, isModalVisible, showModal]);

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
      {!isMotion && !readonly && (
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

const ActionSidebarContent: FC<ActionSidebarContentProps> = ({
  transactionId,
  formRef,
  defaultValues,
  isMotion,
}) => {
  const { getFormOptions, actionFormProps } = useActionFormProps(
    defaultValues,
    !!transactionId,
  );
  const client = useApolloClient();

  return (
    <div
      className={clsx('flex w-full flex-grow', {
        'flex-col-reverse overflow-auto sm:overflow-hidden md:flex-row':
          !!transactionId,
        'overflow-hidden': !transactionId,
      })}
    >
      <div
        className={clsx('flex-grow pb-6 pt-8', {
          'w-full': !isMotion,
          'w-full sm:w-[calc(100%-23.75rem)]': isMotion,
        })}
      >
        <ActionForm
          {...actionFormProps}
          key={actionFormProps.mode}
          className="flex h-full flex-col"
          innerRef={formRef}
          onSuccess={() => {
            client.refetchQueries({
              include: [SearchActionsDocument],
            });
          }}
        >
          <ActionSidebarFormContent
            getFormOptions={getFormOptions}
            isMotion={isMotion}
            transactionId={transactionId}
          />
        </ActionForm>
      </div>
      {transactionId && (
        <div
          className="
            w-full
            border-b
            border-b-gray-200
            bg-gray-25
            px-6
            py-8
            sm:h-full
            sm:w-[23.75rem]
            sm:flex-shrink-0
            sm:overflow-y-auto
            sm:border-b-0
            sm:border-l
            sm:border-l-gray-200
          "
        >
          {isMotion ? (
            <Motions transactionId={transactionId} />
          ) : (
            <PermissionSidebar transactionId={transactionId} />
          )}
        </div>
      )}
    </div>
  );
};

ActionSidebarContent.displayName = displayName;

export default ActionSidebarContent;
