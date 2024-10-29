import { createContext, useContext } from 'react';
import { type FieldValues } from 'react-hook-form';

import { DEFAULT_USE_TOGGLE_RETURN_VALUE } from '~hooks/useToggle/consts.ts';
import {
  type OnBeforeCloseCallback,
  type UseToggleReturnType,
} from '~hooks/useToggle/types.ts';

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
  actionSidebarInitialValues?: FieldValues;
}

export const ActionSidebarContext = createContext<ActionSidebarContextValue>({
  actionSidebarToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
  cancelModalToggle: DEFAULT_USE_TOGGLE_RETURN_VALUE,
});

export const useActionSidebarContext = () => useContext(ActionSidebarContext);
