import { type ButtonHTMLAttributes, type MouseEventHandler } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { type ActionFormProps } from '~shared/Fields/Form/ActionForm.tsx';
import { type Address } from '~types';
import { type ColonyAction } from '~types/graphql.ts';

export interface ActionButtonsProps {
  isActionDisabled?: boolean;
  onSubmitClick?: () => void;
  // FIXME: Urgh remove this primary button shit
  // primaryButton?: ActionFormProps['primaryButton'];
  /** A form id you can directly associate a submit button with */
  id?: string;

  /** Primary button prop overrides */
  primaryButton?: {
    /** The form's primary button type */
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];

    /** Function called when the form's primary button type is set to "button" */
    onClick?: MouseEventHandler<HTMLButtonElement>;
  };
}

export interface ActionFormOptions
  extends Omit<ActionFormProps<any>, 'children'> {
  // FIXME: Urgh remove this primary button shit
  // primaryButton?: ActionFormProps['primaryButton'];
  /** A form id you can directly associate a submit button with */
  id?: string;

  /** Primary button prop overrides */
  primaryButton?: {
    /** The form's primary button type */
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];

    /** Function called when the form's primary button type is set to "button" */
    onClick?: MouseEventHandler<HTMLButtonElement>;
  };
}

// FIXME: Remove
export interface CreateActionFormProps {
  getFormOptions: (
    formOptions: ActionFormOptions | undefined,
    form: UseFormReturn,
  ) => void;
}

// FIXME: Remove
export type UseActionFormBaseHook = (
  options: {
    getFormOptions: CreateActionFormProps['getFormOptions'];
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
