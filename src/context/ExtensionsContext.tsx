import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useExtensionData } from '~hooks';
import { NOT_FOUND_ROUTE } from '~routes';

export const ExtensionsContext = createContext<{
  extensionId: string;
  isExtensionInstalling?: boolean;
}>({ extensionId: '', isExtensionInstalling: false });

export const ExtensionsContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { extensionId } = useParams();
  const { extensionData, loading } = useExtensionData(extensionId ?? '');
  const navigate = useNavigate();

  const isExtensionInstalling: boolean | undefined = useMemo(
    () => extensionData?.isDeprecated && !extensionData?.isEnabled,
    [extensionData?.isDeprecated, extensionData?.isEnabled],
  );

  const value = useMemo(
    () => ({ extensionId: extensionId || '', isExtensionInstalling }),
    [extensionId, isExtensionInstalling],
  );

  // navigate to 404 if extension is not found
  useEffect(() => {
    if (!extensionData && !loading) {
      navigate(`${NOT_FOUND_ROUTE}`);
    }
  }, [extensionData, loading, navigate]);

  return (
    <ExtensionsContext.Provider {...{ value }}>
      {children}
    </ExtensionsContext.Provider>
  );
};

export const useExtensionsContext = () => useContext(ExtensionsContext);
