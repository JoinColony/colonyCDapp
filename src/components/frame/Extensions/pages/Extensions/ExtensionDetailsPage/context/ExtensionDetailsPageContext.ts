import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
} from 'react';

import noop from '~utils/noop.ts';

import { ExtensionDetailsPageTabId } from '../types.ts';

interface ExtensionDetailsPageContextValues {
  activeTab: ExtensionDetailsPageTabId;
  setActiveTab: Dispatch<SetStateAction<ExtensionDetailsPageTabId>>;
  waitingForActionConfirmation: boolean;
  setWaitingForActionConfirmation: Dispatch<SetStateAction<boolean>>;
}

export const ExtensionDetailsPageContext =
  createContext<ExtensionDetailsPageContextValues>({
    activeTab: ExtensionDetailsPageTabId.Overview,
    setActiveTab: noop,
    waitingForActionConfirmation: false,
    setWaitingForActionConfirmation: noop,
  });

export const useExtensionDetailsPageContext = () => {
  const context = useContext(ExtensionDetailsPageContext);

  return context;
};
