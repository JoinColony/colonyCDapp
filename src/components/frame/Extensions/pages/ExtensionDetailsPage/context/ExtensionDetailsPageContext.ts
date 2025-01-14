import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
} from 'react';

import { type AnyExtensionData } from '~types/extensions.ts';
import noop from '~utils/noop.ts';

import { ExtensionDetailsPageTabId } from '../types.ts';

interface ExtensionDetailsPageContextValues {
  activeTab: ExtensionDetailsPageTabId;
  setActiveTab: Dispatch<SetStateAction<ExtensionDetailsPageTabId>>;
  waitingForActionConfirmation: boolean;
  setWaitingForActionConfirmation: Dispatch<SetStateAction<boolean>>;
  extensionData: AnyExtensionData;
  userHasRoot: boolean;
  isPendingManagement: boolean;
  setIsPendingManagement: Dispatch<SetStateAction<boolean>>;
  isSavingChanges: boolean;
  setIsSavingChanges: Dispatch<SetStateAction<boolean>>;
}

export const ExtensionDetailsPageContext =
  createContext<ExtensionDetailsPageContextValues>({
    activeTab: ExtensionDetailsPageTabId.Overview,
    setActiveTab: noop,
    waitingForActionConfirmation: false,
    setWaitingForActionConfirmation: noop,
    extensionData: {} as AnyExtensionData,
    userHasRoot: false,
    isPendingManagement: false,
    setIsPendingManagement: noop,
    isSavingChanges: false,
    setIsSavingChanges: noop,
  });

export const useExtensionDetailsPageContext = () => {
  const context = useContext(ExtensionDetailsPageContext);

  return context;
};
