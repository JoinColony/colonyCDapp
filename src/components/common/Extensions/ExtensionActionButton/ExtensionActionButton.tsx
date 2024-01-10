import { ColonyRole, Id } from '@colony/colony-js';
import React from 'react';

import { useAppContext, useColonyContext } from '~hooks';
import { getUserRolesForDomain } from '~transformers';
import { isInstalledExtensionData } from '~utils/extensions';

import { ExtensionDetailsAsideProps } from '../ExtensionDetails';

import EnableButton from './ExtensionEnableButton';
import InstallButton from './ExtensionInstallButton';

const displayName = 'common.Extensions.ExtensionActionButton';

type Props = Pick<
  ExtensionDetailsAsideProps,
  'extensionData' | 'pollingControls'
>;

const ExtensionActionButton = ({
  extensionData,
  pollingControls: { startPolling, stopPolling },
}: Props) => {
  const { colony, isSupportedColonyVersion } = useColonyContext();
  const { user, wallet } = useAppContext();

  if (!user) {
    return null;
  }

  const userDomainRoles = getUserRolesForDomain(
    colony,
    wallet?.address || '',
    Id.RootDomain,
  );

  const inputDisabled =
    !isSupportedColonyVersion || !userDomainRoles.includes(ColonyRole.Root);

  if (!isInstalledExtensionData(extensionData)) {
    return (
      <InstallButton
        extensionData={extensionData}
        inputDisabled={inputDisabled}
        startPolling={startPolling}
      />
    );
  }

  if (extensionData.isDeprecated) {
    return null;
  }

  if (
    !extensionData.isInitialized ||
    extensionData.missingColonyPermissions.length
  ) {
    return (
      <EnableButton
        extensionData={extensionData}
        inputDisabled={inputDisabled}
        stopPolling={stopPolling}
      />
    );
  }

  return null;
};

ExtensionActionButton.displayName = displayName;

export default ExtensionActionButton;
