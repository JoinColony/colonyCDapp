import { type UseFormReturn } from 'react-hook-form';

import { type ActionFormProps } from '~shared/Fields/Form/ActionForm.tsx';
import { type Address } from '~types';
import { type ColonyAction } from '~types/graphql.ts';

export interface ActionButtonsProps {
  isActionDisabled?: boolean;
}

export interface CreateActionFormProps {
  getFormOptions: (
    formOptions: Omit<ActionFormProps<any>, 'children'> | undefined,
    form: UseFormReturn,
  ) => void;
}

export type UseActionFormBaseHook = (
  options: {
    getFormOptions: CreateActionFormProps['getFormOptions'];
  } & Pick<
    ActionFormProps<any>,
    | 'transform'
    | 'actionType'
    | 'defaultValues'
    | 'validationSchema'
    | 'mode'
    | 'reValidateMode'
  >,
) => void;

export enum ActionSidebarWidth {
  Default,
  Wide,
}

export type ClaimMintTokensActionParams = {
  colonyAddress: Address;
  tokenAddresses: Address[];
};

export type FinalizeSuccessCallback = {
  onFinalizeSuccessCallback: (action: ColonyAction) => void;
};
