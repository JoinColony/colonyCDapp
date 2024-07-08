import { ApolloError, useApolloClient } from '@apollo/client';
import React, { type ReactNode, type FC, useState } from 'react';
import { type FieldError } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { type Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { GetTotalColonyActionsDocument, SearchActionsDocument } from '~gql';
// import { type ActionFormProps } from '~shared/Fields/Form/index.ts';
import { Form } from '~shared/Fields/index.ts';
import { formatText } from '~utils/intl.ts';
import { isQueryActive } from '~utils/isQueryActive.ts';
// import useActionFormProps from '~v5/common/ActionSidebar/hooks/useActionFormProps.ts';
import { useActionForm } from '~v5/common/ActionSidebar/hooks/useActionForm.ts';

import ActionSidebarLayout from '../ActionSidebarLayout/ActionSidebarLayout.tsx';

import CreateActionForm from './partials/CreateActionForm.tsx';

const displayName = 'v5.common.ActionSidebar.CreateActionSidebar';

export interface Props {
  isMotion?: boolean;
  userNavigation?: ReactNode;
}

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

const CreateActionSidebar: FC<Props> = ({ userNavigation }) => {
  // const { getFormOptions, actionFormProps } = useActionFormProps(defaultValues);
  const client = useApolloClient();
  const [customError, setCustomError] = useState<null | Pick<
    FieldError,
    'message'
  >>(null);

  const { data } = useActionSidebarContext();
  const { action } = data;

  // FIXME: Cater for the case where there is no action
  const { FormComponent, formProps } = useActionForm(action as Action);

  return (
    <ActionSidebarLayout userNavigation={userNavigation}>
      <div className="flex w-full flex-grow overflow-hidden">
        <div className="w-full flex-grow pb-6 pt-8">
          <Form
            {...formProps}
            className="flex h-full flex-col"
            // FIXME: Needs to be reenabled
            // onSuccess={(values, formHelpers, result) => {
            //   client.refetchQueries({
            //     include: [SearchActionsDocument],
            //   });
            //   if (isQueryActive('GetTotalColonyActions')) {
            //     client.refetchQueries({
            //       include: [GetTotalColonyActionsDocument],
            //     });
            //   }
            //
            //   formProps.onSuccess?.(values, formHelpers, result);
            // }}
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
                  setCustomError({
                    message: formatText(MSG.apolloNetworkError),
                  });
                }
                return;
              }
              // Arbitrary tx error
              if (error.arbitraryTxActionFailed) {
                setCustomError({ message: formatText(MSG.arbitraryTxError) });
              }
            }}
          >
            <CreateActionForm
              formComponent={FormComponent}
              customError={customError}
            />
          </Form>
        </div>
      </div>
    </ActionSidebarLayout>
  );
};

CreateActionSidebar.displayName = displayName;

export default CreateActionSidebar;
