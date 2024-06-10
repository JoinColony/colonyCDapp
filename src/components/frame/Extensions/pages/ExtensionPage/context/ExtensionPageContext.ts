import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
} from 'react';

import { ExtensionPageTabId } from '~shared/Extensions/Tabs/types.ts';

type ExtensionPageContextValues = {
  activeTab: ExtensionPageTabId;
  setActiveTab: Dispatch<SetStateAction<ExtensionPageTabId>>;
};

export const ExtensionPageContext = createContext<ExtensionPageContextValues>({
  activeTab: ExtensionPageTabId.Overview,
  setActiveTab: () => {},
});

export const useExtensionPageContext = () => {
  const context = useContext(ExtensionPageContext);

  if (!context) {
    throw new Error('This hook must only be used within an Extention Page');
  }

  return context;
};
