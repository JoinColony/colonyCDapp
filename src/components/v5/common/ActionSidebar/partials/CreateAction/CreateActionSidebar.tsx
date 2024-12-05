import { ApolloError, useApolloClient } from '@apollo/client';
import React, { type ReactNode, type FC, useState } from 'react';

import { GetTotalColonyActionsDocument, SearchActionsDocument } from '~gql';
import { type ActionFormProps } from '~shared/Fields/Form/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { isQueryActive } from '~utils/isQueryActive.ts';
import useActionFormProps from '~v5/common/ActionSidebar/hooks/useActionFormProps.ts';

import ActionSidebarLayout from '../ActionSidebarLayout/ActionSidebarLayout.tsx';

import CreateActionForm from './partials/CreateActionForm.tsx';

const displayName = 'v5.common.ActionSidebar.CreateActionSidebar';

export interface Props {
  defaultValues: ActionFormProps<any>['defaultValues'];
  isMotion?: boolean;
  userNavigation?: ReactNode;
}

const CreateActionSidebar: FC<Props> = ({ defaultValues, userNavigation }) => {
  const { getFormOptions, actionFormProps } = useActionFormProps(defaultValues);
  const client = useApolloClient();
  const [showApolloNetworkError, setShowApolloNetworkError] = useState(false);

  return (
    <ActionSidebarLayout userNavigation={userNavigation}>
      <div className="flex w-full flex-grow overflow-hidden">
        <div className="w-full flex-grow pb-6 pt-8">
          <ActionForm
            {...actionFormProps}
            key={actionFormProps.mode}
            className="flex h-full flex-col"
            onSuccess={() => {
              client.refetchQueries({
                include: [SearchActionsDocument],
              });
              if (isQueryActive('GetTotalColonyActions')) {
                client.refetchQueries({
                  include: [GetTotalColonyActionsDocument],
                });
              }

              actionFormProps?.onSuccess?.();
            }}
            onError={(error) => {
              console.error(error);

              // Auth failed before transaction was sent
              if (
                (error.message as unknown) === 'Auth failed' ||
                (error.code as unknown) === 4001
              ) {
                setShowApolloNetworkError(true);
              }

              // Mutation failed in saga
              if (error instanceof ApolloError) {
                const { networkError } = error;

                const statusCode = (networkError as { statusCode?: number })
                  ?.statusCode;

                if (statusCode === 403) {
                  setShowApolloNetworkError(true);
                }
              }
            }}
          >
            <CreateActionForm
              actionFormProps={actionFormProps}
              getFormOptions={getFormOptions}
              showApolloNetworkError={showApolloNetworkError}
            />
          </ActionForm>
        </div>
      </div>
    </ActionSidebarLayout>
  );
};

CreateActionSidebar.displayName = displayName;

export default CreateActionSidebar;
