import { createContext } from 'react';

import { type ActionTypes } from '~redux/actionTypes.ts';
import noop from '~utils/noop.ts';

interface ExtensionSaveSettingsContextValues {
  isVisible: boolean;
  isDisabled: boolean;
  values: any;
  actionType: ActionTypes | null;
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
    values: {},
    actionType: null,
    handleIsVisible: noop,
    handleIsDisabled: noop,
    handleSetValues: noop,
    handleSetActionType: noop,
    resetAll: noop,
  });
