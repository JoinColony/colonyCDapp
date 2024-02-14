import { useApolloClient } from '@apollo/client';
import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useLayoutEffect, useState, type FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';
import { SearchActionsDocument } from '~gql';
import { ActionForm } from '~shared/Fields/index.ts';
import { uiEvents, UIEvent } from '~uiEvents/index.ts';
import { formatText } from '~utils/intl.ts';
import FormTextareaBase from '~v5/common/Fields/TextareaBase/FormTextareaBase.tsx';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

import ActionTypeSelect from '../../ActionTypeSelect.tsx';
import {
  useActionFormProps,
  useHasActionPermissions,
  useHasNoDecisionMethods,
  useSidebarActionForm,
} from '../../hooks/index.ts';
import ActionButtons from '../ActionButtons.tsx';
import ActionSidebarDescription from '../ActionSidebarDescription/ActionSidebarDescription.tsx';
import Motions from '../Motions/index.ts';

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
  const { formComponent: FormComponent, selectedAction } =
    useSidebarActionForm();
  const { readonly } = useAdditionalFormOptionsContext();
  const { flatFormErrors } = useGetFormActionErrors();

  const {
    formState: {
      errors: { this: customError },
    },
    getValues,
  } = useFormContext();

  const { isSubmitting } = useFormState();

  useLayoutEffect(() => {
    if (isSubmitting && !formSubmitted) {
      uiEvents.emit(UIEvent.actionCreated, getValues());
      setFormSubmitted(true);
    }
  }, [isSubmitting, formSubmitted, getValues]);

  const hasPermissions = useHasActionPermissions();
  const hasNoDecisionMethods = useHasNoDecisionMethods();

  const isSubmitDisabled =
    !selectedAction || hasPermissions === false || hasNoDecisionMethods;

  return (
    <>
      <div className="flex-grow overflow-y-auto px-6">
        <FormTextareaBase
          name="title"
          placeholder={formatText({ id: 'placeholder.title' })}
          className={`
            heading-3 mb-2
            text-gray-900
            transition-colors
            leading-tight
          `}
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
        />
        <div className="text-gray-900 text-md flex gap-1 break-all">
          <ActionSidebarDescription />
        </div>
        <SidebarBanner />
        {!readonly && <NoPermissionsError />}
        <ActionTypeSelect className="mt-7 mb-3 min-h-[1.875rem] flex flex-col justify-center" />
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
                <ul className="list-disc list-inside text-negative-400">
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
          'w-full sm:w-[65%]': isMotion,
        })}
      >
        <ActionForm
          {...actionFormProps}
          className="flex flex-col h-full"
          innerRef={formRef}
          onSuccess={(values) => {
            client.refetchQueries({
              include: [SearchActionsDocument],
            });
            uiEvents.emit(UIEvent.actionCreationSucceeded, values);
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
          className={`
            w-full
            md:w-[35%]
            md:h-full
            md:overflow-y-auto
            md:flex-shrink-0
            px-6
            py-8
            border-b
            border-b-gray-200
            md:border-b-0
            md:border-l
            md:border-l-gray-200
            bg-gray-25
          `}
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
