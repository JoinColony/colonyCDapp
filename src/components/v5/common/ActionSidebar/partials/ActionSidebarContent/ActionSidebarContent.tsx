import { useApolloClient } from '@apollo/client';
import clsx from 'clsx';
import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, useIntl } from 'react-intl';

import { useAdditionalFormOptionsContext } from '~context/AdditionalFormOptionsContext/AdditionalFormOptionsContext.tsx';
import { SearchActionsDocument } from '~gql';
import { ActionForm } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import FormInputBase from '~v5/common/Fields/InputBase/FormInputBase.tsx';
import Link from '~v5/shared/Link/index.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

import ActionTypeSelect from '../../ActionTypeSelect.tsx';
import { ACTION_TYPE_FIELD_NAME } from '../../consts.tsx';
import {
  useActionFormProps,
  useSidebarActionForm,
  useReputationValidation,
} from '../../hooks/index.ts';
import ActionButtons from '../ActionButtons.tsx';
import ActionSidebarDescription from '../ActionSidebarDescription/ActionSidebarDescription.tsx';
import Motions from '../Motions/index.ts';
import PopularActions from '../PopularActions.tsx';

import { useGetActionErrors } from './hooks.ts';
import PermissionSidebar from './partials/PermissionSidebar.tsx';
import { SidebarBanner } from './partials/SidebarBanner.tsx';
import {
  type ActionSidebarContentProps,
  type ActionSidebarFormContentProps,
} from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.ActionSidebarContent';

const MSG = defineMessages({
  noReputationErrorTitle: {
    id: `${displayName}.noReputationErrorTitle`,
    defaultMessage: 'There is no reputation in this team yet',
  },
  noReputationError: {
    id: `${displayName}.noReputationError`,
    defaultMessage:
      'If you have the necessary permissions you can bypass the governance process.',
  },
  noPermissionsErrorTitle: {
    id: `${displayName}.noPermissionsErrorTitle`,
    defaultMessage: `You don't have the right permissions to create this action type. Choose another action.`,
  },
});

const ActionSidebarFormContent: FC<ActionSidebarFormContentProps> = ({
  getFormOptions,
  isMotion,
}) => {
  const { formatMessage } = useIntl();

  const { formComponent: FormComponent, selectedAction } =
    useSidebarActionForm();
  const { readonly } = useAdditionalFormOptionsContext();
  const { flatFormErrors, hasErrors } = useGetActionErrors();

  const { setValue } = useFormContext();

  const { noReputationError } = useReputationValidation();

  return (
    <>
      <div className="flex-grow overflow-y-auto px-6">
        <FormInputBase
          name="title"
          placeholder={formatText({ id: 'placeholder.title' })}
          className={`
            heading-3 mb-2
            text-gray-900
            transition-colors
          `}
          message={false}
          shouldFocus
          mode="secondary"
        />
        <div className="text-gray-900 text-md flex gap-1 break-all">
          <ActionSidebarDescription />
        </div>
        <SidebarBanner />
        <ActionTypeSelect className="mt-7 mb-3 min-h-[1.875rem] flex flex-col justify-center" />

        {FormComponent && <FormComponent getFormOptions={getFormOptions} />}

        {noReputationError && (
          <div className="mt-6">
            <NotificationBanner
              status="warning"
              icon="warning-circle"
              description={formatMessage(MSG.noReputationError)}
              callToAction={
                <Link to="https://docs.colony.io/use/reputation">
                  {formatMessage({ id: 'text.learnMore' })}
                </Link>
              }
            >
              {formatMessage(MSG.noReputationErrorTitle)}
            </NotificationBanner>
          </div>
        )}
        {hasErrors || flatFormErrors.length ? (
          <div className="mt-7">
            <NotificationBanner
              status="error"
              icon="warning-circle"
              description={
                flatFormErrors.length ? (
                  <ul className="list-disc list-inside text-negative-400 capitalize">
                    {flatFormErrors.map(({ key, message }) => (
                      <li key={key}>{message}</li>
                    ))}
                  </ul>
                ) : null
              }
            >
              {formatText({ id: 'actionSidebar.fields.error' })}
            </NotificationBanner>
          </div>
        ) : null}
      </div>
      {!isMotion && !readonly && (
        <div className="mt-auto">
          {!selectedAction && (
            <PopularActions
              setSelectedAction={(action) =>
                setValue(ACTION_TYPE_FIELD_NAME, action)
              }
            />
          )}
          <ActionButtons isActionDisabled={!selectedAction} />
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
          ref={formRef}
          onSuccess={() => {
            client.refetchQueries({
              include: [SearchActionsDocument],
            });
          }}
        >
          <ActionSidebarFormContent
            getFormOptions={getFormOptions}
            isMotion={isMotion}
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
