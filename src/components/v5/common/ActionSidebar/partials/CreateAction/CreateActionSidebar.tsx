import { useApolloClient } from '@apollo/client';
import React, { type ReactNode, type FC } from 'react';

import { SearchActionsDocument } from '~gql';
import { type ActionFormProps } from '~shared/Fields/Form/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
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
            }}
          >
            <CreateActionForm getFormOptions={getFormOptions} />
          </ActionForm>
        </div>
      </div>
    </ActionSidebarLayout>
  );
};

CreateActionSidebar.displayName = displayName;

export default CreateActionSidebar;
