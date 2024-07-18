import { createContext } from 'react';

import { type ActionTypes } from '~redux/actionTypes.ts';
import noop from '~utils/noop.ts';

interface ExtensionSaveSettingsContextValues {
  isVisible: boolean;
  isDisabled: boolean;
  actionType: ActionTypes | null;
  handleGetValues: () => any;
  handleIsVisible: (value: boolean) => void;
  handleIsDisabled: (value: boolean) => void;
  handleSetValues: (values: any) => void;
  handleSetActionType: (value: ActionTypes) => void;
  resetAll: () => void;
}

export const ExtensionSaveSettingsContext =
  createContext<ExtensionSaveSettingsContextValues>({
    isVisible: false,
    isDisabled: false,
    actionType: null,
    handleGetValues: noop,
    handleIsVisible: noop,
    handleIsDisabled: noop,
    handleSetValues: noop,
    handleSetActionType: noop,
    resetAll: noop,
  });
