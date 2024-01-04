import { ApolloClient } from '@apollo/client';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { DeepPartial } from 'utility-types';

import { ActionTitleMessageKeys } from '~common/ColonyActions/helpers/getActionTitleValues';
import { Action } from '~constants/actions';
import { ActionFormProps } from '~shared/Fields/Form/ActionForm';
import { AnyMessageValues, Colony, ColonyAction } from '~types';

export interface ActionButtonsProps {
  isActionDisabled?: boolean;
}

export interface PopularActionsProps {
  setSelectedAction: (action: Action | null) => void;
}

export interface ActionFormBaseProps {
  getFormOptions: (
    formOptions: Omit<ActionFormProps<any>, 'children'> | undefined,
    form: UseFormReturn,
  ) => void;
}

export type UseActionFormBaseHook = (
  options: {
    getFormOptions: ActionFormBaseProps['getFormOptions'];
  } & Pick<
    ActionFormProps<any>,
    'transform' | 'actionType' | 'defaultValues' | 'validationSchema'
  >,
) => void;

export interface ActionSidebarProps {
  initialValues?: FieldValues;
  transactionId?: string;
}

export type DescriptionMetadataGetter<TValues = FieldValues> = (
  formData: TValues,
  meta: {
    client: ApolloClient<object>;
    colony: Colony;
    getActionTitleValues: (
      actionData: DeepPartial<Omit<ColonyAction, 'type'>> &
        Pick<ColonyAction, 'type'>,
      keyFallbackValues?: Partial<
        Record<ActionTitleMessageKeys, React.ReactNode>
      >,
    ) => AnyMessageValues;
  },
) => Promise<AnyMessageValues>;

export interface ActionTypeSelectProps {
  className?: string;
}
