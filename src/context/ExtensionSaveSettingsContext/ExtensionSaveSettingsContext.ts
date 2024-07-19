import { createContext } from 'react';

import { type ActionTypes } from '~redux/actionTypes.ts';
import noop from '~utils/noop.ts';

interface ExtensionSaveSettingsContextValues {
  isVisible: boolean;
  actionType: ActionTypes | null;
  handleGetValues: () => any;
  handleIsVisible: (value: boolean) => void;
  handleSetActionType: (value: ActionTypes) => void;
  resetAll: () => void;
  callback: any;
}

export const ExtensionSaveSettingsContext =
  createContext<ExtensionSaveSettingsContextValues>({
    isVisible: false,
    actionType: null,
    handleGetValues: noop,
    handleIsVisible: noop,
    handleSetActionType: noop,
    resetAll: noop,
    callback: noop,
  });
