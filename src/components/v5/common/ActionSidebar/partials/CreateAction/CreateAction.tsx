import { useApolloClient } from '@apollo/client';
import React, { type FC } from 'react';

import { SearchActionsDocument } from '~gql';
import { ActionForm } from '~shared/Fields/index.ts';

import useActionFormProps from '../../hooks/useActionFormProps.ts';

import CreateActionForm from './partials/CreateActionForm.tsx';
import { type CreateActionProps } from './types.ts';

const displayName = 'v5.common.ActionsContent.partials.ActionSidebarContent';

const CreateAction: FC<CreateActionProps> = ({ defaultValues }) => {
  const { getFormOptions, actionFormProps } = useActionFormProps(defaultValues);
  const client = useApolloClient();

  return (
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
  );
};

CreateAction.displayName = displayName;

export default CreateAction;
