import { getExtensionHash } from '@colony/colony-js';

import { ADDRESS_ZERO } from '~constants';
import { ContextModule, getContext } from '~context';
import { GetColonyExtensionDocument, GetColonyExtensionQuery, GetColonyExtensionQueryVariables } from '~gql';
import { ColonyExtension, InstallableExtensionData } from '~types';

const getExistingExtension = (colonyAddress: string, extensionId: string) => {
  const apolloClient = getContext(ContextModule.ApolloClient);
  const data = apolloClient.readQuery<GetColonyExtensionQuery, GetColonyExtensionQueryVariables>({
    query: GetColonyExtensionDocument,
    variables: {
      colonyAddress,
      extensionHash: getExtensionHash(extensionId),
    },
  });

  return data?.getExtensionByColonyAndHash?.items?.[0];
};

const saveExtensionInCache = (extension: ColonyExtension) => {
  const apolloClient = getContext(ContextModule.ApolloClient);
  apolloClient.writeQuery<GetColonyExtensionQuery, GetColonyExtensionQueryVariables>({
    query: GetColonyExtensionDocument,
    variables: {
      colonyAddress: extension.colonyAddress,
      extensionHash: extension.hash,
    },
    data: {
      getExtensionByColonyAndHash: {
        __typename: 'ModelColonyExtensionConnection',
        items: [extension],
      },
    },
  });
};

const removeExtensionFromCache = (colonyAddress: string, extensionId: string) => {
  const apolloClient = getContext(ContextModule.ApolloClient);
  apolloClient.writeQuery<GetColonyExtensionQuery, GetColonyExtensionQueryVariables>({
    query: GetColonyExtensionDocument,
    variables: {
      colonyAddress,
      extensionHash: getExtensionHash(extensionId),
    },
    data: {
      getExtensionByColonyAndHash: {
        __typename: 'ModelColonyExtensionConnection',
        items: [],
      },
    },
  });
};

export const refreshInstalledExtension = (
  colonyAddress: string,
  { extensionId, availableVersion }: InstallableExtensionData,
) => {
  const wallet = getContext(ContextModule.Wallet);

  const modifiedExtension: ColonyExtension = {
    __typename: 'ColonyExtension',
    address: ADDRESS_ZERO,
    colonyAddress,
    hash: getExtensionHash(extensionId),
    installedAt: Math.floor(Date.now() / 1000),
    installedBy: wallet.address,
    currentVersion: availableVersion,
    isDeleted: false,
    isDeprecated: false,
    isInitialized: false,
  };

  saveExtensionInCache(modifiedExtension);
};

export const refreshDeprecatedExtension = (colonyAddress: string, extensionId: string, isToDeprecate: boolean) => {
  const existingExtension = getExistingExtension(colonyAddress, extensionId);

  if (!existingExtension) {
    return;
  }

  const modifiedExtension: ColonyExtension = {
    ...existingExtension,
    isDeprecated: isToDeprecate,
  };

  saveExtensionInCache(modifiedExtension);
};

export const refreshUninstalledExtension = (colonyAddress: string, extensionId: string) => {
  removeExtensionFromCache(colonyAddress, extensionId);
};

export const refreshEnabledExtension = (colonyAddress: string, extensionId: string) => {
  const existingExtension = getExistingExtension(colonyAddress, extensionId);

  if (!existingExtension) {
    return;
  }

  const modifiedExtension: ColonyExtension = {
    ...existingExtension,
    isInitialized: true,
  };

  saveExtensionInCache(modifiedExtension);
};

export const refreshUpgradedExtension = (colonyAddress: string, extensionId: string, version: number) => {
  const existingExtension = getExistingExtension(colonyAddress, extensionId);

  if (!existingExtension) {
    return;
  }

  const modifiedExtension: ColonyExtension = {
    ...existingExtension,
    currentVersion: version,
  };

  saveExtensionInCache(modifiedExtension);
};
