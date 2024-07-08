import { createContext, useContext } from 'react';
import { type FieldValues } from 'react-hook-form';

import { type Action } from '~constants/actions.ts';
import { asyncNoop, noop } from '~utils/noop.ts';

export enum ActionSidebarMode {
  Disabled,
  CreateAction,
  ActionOverview,
  ViewAction,
}

export interface ActionSidebarData {
  action?: Action;
  initialValues?: FieldValues;
  // FIXME: This is probably an enum somewhere
  overviewGroup?: any;
}

export interface ActionSidebarContextValue {
  data: ActionSidebarData;
  hideActionSidebar: () => Promise<void>;
  isActionSidebarOpen: boolean;
  mode: ActionSidebarMode;
  registerOnBeforeCloseCallback: (cb: () => Promise<boolean>) => void;
  unregisterOnBeforeCloseCallback: (cb: () => Promise<boolean>) => void;
  showActionSidebar: (
    mode: ActionSidebarMode,
    data?: ActionSidebarData,
  ) => Promise<void>;
}

export const ActionSidebarContext = createContext<ActionSidebarContextValue>({
  data: {},
  hideActionSidebar: asyncNoop,
  isActionSidebarOpen: false,
  mode: ActionSidebarMode.Disabled,
  registerOnBeforeCloseCallback: noop,
  unregisterOnBeforeCloseCallback: noop,
  showActionSidebar: asyncNoop,
});

export const useActionSidebarContext = () => useContext(ActionSidebarContext);
