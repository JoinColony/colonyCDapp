import React, {
  useState,
  type FC,
  type PropsWithChildren,
  useMemo,
} from 'react';

import { type AnyExtensionData } from '~types/extensions.ts';

import { ExtensionDetailsPageTabId } from '../types.ts';

import { ExtensionDetailsPageContext } from './ExtensionDetailsPageContext.ts';

interface ExtensionsDetailsPageContextProviderProps extends PropsWithChildren {
  extensionData: AnyExtensionData;
}

export const ExtensionDetailsPageContextProvider: FC<
  ExtensionsDetailsPageContextProviderProps
> = ({ children, extensionData }) => {
  const [activeTab, setActiveTab] = useState(
    ExtensionDetailsPageTabId.Overview,
  );
  const [waitingForActionConfirmation, setWaitingForActionConfirmation] =
    useState(false);

  const contextValue = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      waitingForActionConfirmation,
      setWaitingForActionConfirmation,
      extensionData,
    }),
    [activeTab, extensionData, waitingForActionConfirmation],
  );

  return (
    <ExtensionDetailsPageContext.Provider value={contextValue}>
      {children}
    </ExtensionDetailsPageContext.Provider>
  );
};
