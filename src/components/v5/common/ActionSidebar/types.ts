import { type UseFormReturn } from 'react-hook-form';

import { type ActionFormProps } from '~shared/Fields/Form/ActionForm.tsx';
import { type Address } from '~types';
import { type ColonyAction } from '~types/graphql.ts';

export interface ActionButtonsProps {
  isActionDisabled?: boolean;
  onSubmitClick?: () => void;
  primaryButton?: ActionFormProps['primaryButton'];
}

export interface ActionFormOptions
  extends Omit<ActionFormProps<any>, 'children' | 'onSuccess'> {
  onSuccess?: () => void;
  primaryButton?: ActionFormProps['primaryButton'];
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
    | 'actionType'
    | 'transform'
    | 'defaultValues'
    | 'validationSchema'
    | 'mode'
    | 'reValidateMode'
    | 'onSuccess'
    | 'id'
    | 'primaryButton'
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
