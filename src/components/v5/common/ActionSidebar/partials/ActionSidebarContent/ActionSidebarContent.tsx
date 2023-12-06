import React, { FC, useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
import { defineMessages, useIntl } from 'react-intl';

import NotificationBanner from '~v5/shared/NotificationBanner';
import { SearchActionsDocument } from '~gql';
import { ActionForm } from '~shared/Fields';
import { formatText } from '~utils/intl';
import { FormTextareaBase } from '~v5/common/Fields/TextareaBase';
import { useColonyContext, useColonyHasReputation } from '~hooks';
import Link from '~v5/shared/Link';

import ActionTypeSelect from '../../ActionTypeSelect';
import { ACTION_TYPE_FIELD_NAME } from '../../consts';
import {
  useActionDescriptionMetadata,
  useActionFormProps,
  useSidebarActionForm,
  useUserHasPermissions,
} from '../../hooks';
import ActionButtons from '../ActionButtons';
import Motions from '../Motions';
import PopularActions from '../PopularActions';
import { SidebarBanner } from './partials/SidebarBanner';
import {
  ActionSidebarContentProps,
  ActionSidebarFormContentProps,
} from './types';

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

  const { colony } = useColonyContext();
  const { formComponent: FormComponent, selectedAction } =
    useSidebarActionForm();
  const descriptionMetadata = useActionDescriptionMetadata();

  const {
    setValue,
    formState: {
      errors: {
        title: titleError,
        domainHasReputation: noReputationError,
        userHasPermissions: noPermissionsError,
      },
    },
    watch,
  } = useFormContext();
  const { actionType, createdIn } = watch();
  const createdInDomainId = Number(createdIn);

  const userHasPermissions = useUserHasPermissions(
    actionType,
    createdInDomainId,
  );
  useEffect(() => {
    setValue('userHasPermissions', userHasPermissions, {
      shouldValidate: true,
    });
  }, [setValue, userHasPermissions]);

  const domainHasReputation = useColonyHasReputation(
    colony?.colonyAddress,
    createdInDomainId,
  );
  useEffect(() => {
    setValue('domainHasReputation', domainHasReputation, {
      shouldValidate: true,
    });
  }, [setValue, domainHasReputation]);

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
          `}
          message={false}
        />
        <div className="text-gray-900 text-md flex gap-1">
          {descriptionMetadata}
        </div>
        <SidebarBanner />
        <ActionTypeSelect className="mt-7 mb-3 min-h-[1.875rem] flex flex-col justify-center" />

        {FormComponent && <FormComponent getFormOptions={getFormOptions} />}

        {noPermissionsError && (
          <div className="mt-6">
            <NotificationBanner status="warning" icon="check-circle">
              {formatMessage(MSG.noPermissionsErrorTitle)}
            </NotificationBanner>
          </div>
        )}
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
        {titleError && (
          <div className="mt-6">
            <NotificationBanner icon="warning-circle" status="error">
              {titleError.message?.toString()}
            </NotificationBanner>
          </div>
        )}
      </div>
      {!isMotion && (
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
          isMotion,
        'overflow-hidden': !isMotion,
      })}
    >
      <div className="flex-grow pb-6 pt-8">
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
      {isMotion && (
        <div
          className={`
            w-full
            md:w-[35%]
            md:h-full
            md:overflow-y-auto
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
          <Motions transactionId={transactionId || ''} />
        </div>
      )}
    </div>
  );
};

ActionSidebarContent.displayName = displayName;

export default ActionSidebarContent;
