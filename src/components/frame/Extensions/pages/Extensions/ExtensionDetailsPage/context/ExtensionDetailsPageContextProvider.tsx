import React, {
  useState,
  type FC,
  type PropsWithChildren,
  useMemo,
} from 'react';

import { ExtensionDetailsPageTabId } from '../types.ts';

import { ExtensionDetailsPageContext } from './ExtensionDetailsPageContext.ts';

export const ExtensionDetailsPageContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState(
    ExtensionDetailsPageTabId.Overview,
  );
  const [waitingForActionConfirmation, setWaitingForActionConfirmation] =
    useState(false);

  const extensionDetailsContextValue = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      waitingForActionConfirmation,
      setWaitingForActionConfirmation,
    }),
    [activeTab, waitingForActionConfirmation],
  );

  return (
    <ExtensionDetailsPageContext.Provider value={extensionDetailsContextValue}>
      {children}
    </ExtensionDetailsPageContext.Provider>
  );
};
