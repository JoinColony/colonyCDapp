import { type RefObject, createContext } from 'react';

import { type ActionTypes } from '~redux/actionTypes.ts';
import { noop } from '~utils/noop.ts';

export interface RefWithGetValues {
  getValues: () => Record<string, any>;
}

interface ExtensionSaveSettingsContextValues {
  isVisible: boolean;
  actionType: ActionTypes | null;
  handleGetValues: () => any;
  handleSetVisible: (value: boolean) => void;
  handleSetActionType: (value: ActionTypes) => void;
  handleOnSuccess: () => void;
  resetAll: () => void;
  callbackRef: RefObject<RefWithGetValues | null>;
}

export const ExtensionSaveSettingsContext =
  createContext<ExtensionSaveSettingsContextValues>({
    isVisible: false,
    actionType: null,
    handleGetValues: noop,
    handleSetVisible: noop,
    handleSetActionType: noop,
    handleOnSuccess: noop,
    resetAll: noop,
    callbackRef: { current: null },
  });
