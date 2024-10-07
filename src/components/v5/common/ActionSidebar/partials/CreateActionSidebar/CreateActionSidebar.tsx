import { useApolloClient } from '@apollo/client';
import React, { type ReactNode, type FC } from 'react';
import { type UseFormReturn, useFormContext } from 'react-hook-form';

import { type CoreActionOrGroup } from '~actions/index.ts';
import { getFormComponent } from '~actions/utils.ts';
import { SearchActionsDocument } from '~gql';
import { type ActionFormProps } from '~shared/Fields/Form/index.ts';
import { ActionForm } from '~shared/Fields/index.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import useActionFormProps from '~v5/common/ActionSidebar/hooks/useActionFormProps.ts';

import ActionSidebarLayout from '../ActionSidebarLayout/ActionSidebarLayout.tsx';

const displayName = 'v5.common.ActionSidebar.CreateActionSidebar';

export interface Props {
  defaultValues: ActionFormProps<any>['defaultValues'];
  isMotion?: boolean;
  userNavigation?: ReactNode;
}

// FIXME: Move ActionFormInner to a separate component
interface ActionFormInnerProps {
  getFormOptions: (
    formOptions: Omit<ActionFormProps<any>, 'children'> | undefined,
    form: UseFormReturn,
  ) => void;
}

// FIXME: Move ActionFormInner to a separate component
const ActionFormInner: FC<ActionFormInnerProps> = ({ getFormOptions }) => {
  const form = useFormContext();
  const selectedAction: CoreActionOrGroup | undefined = form.watch(
    ACTION_TYPE_FIELD_NAME,
  );
  const FormComponent = getFormComponent(selectedAction);
  return <FormComponent getFormOptions={getFormOptions} />;
};

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
            <ActionFormInner getFormOptions={getFormOptions} />
          </ActionForm>
        </div>
      </div>
    </ActionSidebarLayout>
  );
};

CreateActionSidebar.displayName = displayName;

export default CreateActionSidebar;
