import { ColonyRole, Id } from '@colony/colony-js';
import React, {
  useState,
  type FC,
  type PropsWithChildren,
  useMemo,
} from 'react';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { addressHasRoles } from '~utils/checks/userHasRoles.ts';

import { ExtensionDetailsPageTabId } from '../types.ts';

import { ExtensionDetailsPageContext } from './ExtensionDetailsPageContext.ts';

interface ExtensionsDetailsPageContextProviderProps extends PropsWithChildren {
  extensionData: AnyExtensionData;
}

export const ExtensionDetailsPageContextProvider: FC<
  ExtensionsDetailsPageContextProviderProps
> = ({ children, extensionData }) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();

  const [activeTab, setActiveTab] = useState(
    ExtensionDetailsPageTabId.Overview,
  );
  const [waitingForActionConfirmation, setWaitingForActionConfirmation] =
    useState(false);
  const [isPendingManagement, setIsPendingManagement] = useState(false);
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  const userHasRoot =
    !!user &&
    addressHasRoles({
      address: user.walletAddress,
      colony,
      requiredRoles: [ColonyRole.Root],
      requiredRolesDomain: Id.RootDomain,
    });

  const contextValue = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      waitingForActionConfirmation,
      setWaitingForActionConfirmation,
      extensionData,
      userHasRoot,
      isPendingManagement,
      setIsPendingManagement,
      isSavingChanges,
      setIsSavingChanges,
    }),
    [
      activeTab,
      extensionData,
      isPendingManagement,
      isSavingChanges,
      userHasRoot,
      waitingForActionConfirmation,
    ],
  );

  return (
    <ExtensionDetailsPageContext.Provider value={contextValue}>
      {children}
    </ExtensionDetailsPageContext.Provider>
  );
};
