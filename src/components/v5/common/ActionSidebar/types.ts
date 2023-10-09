import { ApolloClient } from '@apollo/client';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { Action } from '~constants/actions';
import { ColonyFragment } from '~gql';
import { ActionFormProps } from '~shared/Fields/Form/ActionForm';
import { User } from '~types';

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
  transactionId?: string;
}

export interface ActionSidebarFormContentProps extends ActionFormBaseProps {
  isMotion?: boolean;
}

export type DescriptionMetadataGetter<TValues = FieldValues> = (
  formData: TValues,
  meta: {
    client: ApolloClient<object>;
    currentUser: User | null | undefined;
    colony: ColonyFragment | undefined;
  },
) => Promise<React.ReactNode>;
