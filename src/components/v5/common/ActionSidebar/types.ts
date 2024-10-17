import { type UseFormReturn } from 'react-hook-form';

import { type ActionFormProps } from '~shared/Fields/Form/ActionForm.tsx';
import { type Address } from '~types';
import { type ColonyAction } from '~types/graphql.ts';

export interface ActionButtonsProps {
  isActionDisabled?: boolean;
  onSubmitClick?: () => void;
}

export interface ActionFormOptions
  extends Omit<ActionFormProps<any>, 'children' | 'onSuccess'> {
  onSuccess?: () => void;
}

export interface ActionFormBaseProps {
  getFormOptions: (
    formOptions: ActionFormOptions | undefined,
    form: UseFormReturn,
  ) => void;
}

export type UseActionFormBaseHook = (
  options: {
    getFormOptions: ActionFormBaseProps['getFormOptions'];
  } & Pick<
    ActionFormOptions,
    | 'transform'
    | 'actionType'
    | 'defaultValues'
    | 'validationSchema'
    | 'mode'
    | 'reValidateMode'
    | 'onSuccess'
  >,
) => void;

export interface ActionSidebarProps {
  transactionId?: string;
  className?: string;
}

export type ClaimMintTokensActionParams = {
  colonyAddress: Address;
  tokenAddresses: Address[];
};

export type FinalizeSuccessCallback = {
  onFinalizeSuccessCallback: (action: ColonyAction) => void;
};
