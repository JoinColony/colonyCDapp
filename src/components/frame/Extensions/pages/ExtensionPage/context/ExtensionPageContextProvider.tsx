import React, {
  useState,
  type FC,
  type PropsWithChildren,
  useMemo,
} from 'react';

import { ExtensionPageTabId } from '~shared/Extensions/Tabs/types.ts';

import { ExtensionPageContext } from './ExtensionPageContext.ts';

export const ExtensionPageContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = useState(ExtensionPageTabId.Overview);

  const extensionDetailsContextValue = useMemo(
    () => ({ activeTab, setActiveTab }),
    [activeTab],
  );

  return (
    <ExtensionPageContext.Provider value={extensionDetailsContextValue}>
      {children}
    </ExtensionPageContext.Provider>
  );
};
