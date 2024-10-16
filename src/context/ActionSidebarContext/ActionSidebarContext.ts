import {
  // type Dispatch,
  // type SetStateAction,
  createContext,
  useContext,
} from 'react';
import { type FieldValues } from 'react-hook-form';

// import { DEFAULT_USE_TOGGLE_RETURN_VALUE } from '~hooks/useToggle/consts.ts';
// import { type OnBeforeCloseCallback } from '~hooks/useToggle/types.ts';
import noop, { asyncNoop } from '~utils/noop.ts';

// type ActionSidebarToggle = [
//   boolean,
//   {
//     toggle: (actionSidebarInitialValues?: FieldValues) => void;
//     toggleOn: (actionSidebarInitialValues?: FieldValues) => void;
//     toggleOff: () => void;
//     registerContainerRef: (ref: HTMLElement | null) => void;
//     useRegisterOnBeforeCloseCallback: (callback: OnBeforeCloseCallback) => void;
//   },
// ];

export interface ActionSidebarContextValue {
  hide: () => Promise<void>;
  initialValues?: FieldValues;
  isShown: boolean;
  registerOnBeforeCloseCallback: (cb: () => Promise<boolean>) => void;
  unregisterOnBeforeCloseCallback: (cb: () => Promise<boolean>) => void;
  show: (values?: FieldValues) => Promise<void>;
  toggle: (values?: FieldValues) => Promise<void>;
  // setFormDirty: Dispatch<SetStateAction<boolean>>;
}

export const ActionSidebarContext = createContext<ActionSidebarContextValue>({
  hide: asyncNoop,
  isShown: false,
  registerOnBeforeCloseCallback: noop,
  unregisterOnBeforeCloseCallback: noop,
  show: asyncNoop,
  toggle: asyncNoop,
  // setFormDirty: noop,
});

export const useActionSidebarContext = () => useContext(ActionSidebarContext);
