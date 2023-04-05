import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import { useParams } from 'react-router-dom';

import { useExtensionData } from '~hooks';

export const ExtensionsContext = createContext<{
  extensionId: string;
  isExtensionInstalling?: boolean;
}>({ extensionId: '', isExtensionInstalling: false });

export const ExtensionsContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { extensionId } = useParams();
  const { extensionData } = useExtensionData(extensionId ?? '');

  const isExtensionInstalling: boolean | undefined = useMemo(
    () => extensionData?.isDeprecated && !extensionData?.isEnabled,
    [extensionData?.isDeprecated, extensionData?.isEnabled],
  );

  const value = useMemo(
    () => ({ extensionId: extensionId || '', isExtensionInstalling }),
    [extensionId, isExtensionInstalling],
  );

  return (
    <ExtensionsContext.Provider {...{ value }}>
      {children}
    </ExtensionsContext.Provider>
  );
};

export const useExtensionsContext = () => useContext(ExtensionsContext);
