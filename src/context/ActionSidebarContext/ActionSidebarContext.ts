import { createContext, useContext } from 'react';
import { type FieldValues } from 'react-hook-form';

import { DEFAULT_USE_TOGGLE_RETURN_VALUE } from '~hooks/useToggle/consts.ts';
import {
  type OnBeforeCloseCallback,
  type UseToggleReturnType,
} from '~hooks/useToggle/types.ts';
import { type ExpenditurePayoutFieldValue } from '~types/expenditures.ts';
import noop from '~utils/noop.ts';

type ActionSidebarToggle = [
  boolean,
  {
    toggle: (actionSidebarInitialValues?: FieldValues) => void;
    toggleOn: (actionSidebarInitialValues?: FieldValues) => void;
    toggleOff: () => void;
    registerContainerRef: (ref: HTMLElement | null) => void;
    useRegisterOnBeforeCloseCallback: (callback: OnBeforeCloseCallback) => void;
  },
];

export interface ActionSidebarContextValue {
  actionSidebarToggle: ActionSidebarToggle;
  cancelModalToggle: UseToggleReturnType;
  cancelEditModalToggle: UseToggleReturnType;
  actionSidebarInitialValues?: FieldValues;
  editValues: ExpenditurePayoutFieldValue[] | undefined;
  setEditValues: (
    editValues: ExpenditurePayoutFieldValue[] | undefined,
  ) => void;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
}

export const ActionSidebarContext = createContext<ActionSidebarContextValue>({
  actionSidebarToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  cancelModalToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  cancelEditModalToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  setIsEditMode: noop,
  isEditMode: false,
  editValues: undefined,
  setEditValues: noop,
});

export const useActionSidebarContext = () => useContext(ActionSidebarContext);
