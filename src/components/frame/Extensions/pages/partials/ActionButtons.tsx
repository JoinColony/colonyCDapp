import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import {
  ColonyRole,
  ColonyVersion,
  Extension,
  ExtensionVersion,
  Id,
  isExtensionCompatible,
} from '@colony/colony-js';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import {
  useActiveInstalls,
  useAppContext,
  useColonyContext,
  useMobile,
} from '~hooks';
import Button from '~v5/shared/Button';
import {
  canExtensionBeInitialized,
  isInstalledExtensionData,
} from '~utils/extensions';
import { ActionButtonProps } from './types';
import HeadingIcon from './HeadingIcon';
import ExtensionStatusBadge from '~v5/common/Pills/ExtensionStatusBadge';
import ActiveInstalls from './ActiveInstalls';
import { mapPayload } from '~utils/actions';
import { ActionButton } from '~shared/Button';
import { ActionTypes } from '~redux';
import Toast from '~shared/Extensions/Toast/Toast';
import { ButtonProps } from '~v5/shared/Button/types';
import InstallButton from './InstallButton';
import { COLONY_EXTENSION_SETUP_ROUTE } from '~routes';
import { addressHasRoles } from '~utils/checks';

const displayName = 'frame.Extensions.pages.partials.ActionButtons';

const ActionButtons: FC<ActionButtonProps> = ({
  extensionData,
  isSetupRoute,
  waitingForEnableConfirmation,
  extensionStatusMode,
  extensionStatusText,
}) => {
  const { user } = useAppContext();
  const { colony, isSupportedColonyVersion } = useColonyContext();

  const { colonyAddress = '' } = colony || {};

  const transformUpgrade = mapPayload(() => ({
    colonyAddress: colony?.colonyAddress,
    extensionId: extensionData.extensionId,
    version: extensionData.availableVersion,
  }));

  const extensionCompatible = isExtensionCompatible(
    Extension[extensionData.extensionId],
    extensionData.availableVersion as ExtensionVersion,
    colony?.version as ColonyVersion,
  );

  const isUpgradeButtonDisabled =
    !isSupportedColonyVersion || !extensionCompatible;

  const {
    formState: { isValid, isSubmitting },
  } = useFormContext();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeInstalls = useActiveInstalls(extensionData.extensionId);

  if (!colony) {
    return null;
  }

  const userHasRoot =
    !!user &&
    addressHasRoles({
      address: user.walletAddress,
      colony,
      requiredRoles: [ColonyRole.Root],
      requiredRolesDomains: [Id.RootDomain],
    });

  const userHasArchitecture =
    !!user &&
    addressHasRoles({
      address: user.walletAddress,
      colony,
      requiredRoles: [ColonyRole.Architecture],
      requiredRolesDomains: [Id.RootDomain],
    });

  /* To install, a user must have the root permission. */
  const isInstallButtonVisible =
    userHasRoot &&
    !isInstalledExtensionData(extensionData) &&
    extensionData.uninstallable &&
    !extensionData.isDeprecated;

  /* To enable, a user must have the root permission. They also need architecture for the permissions tx to be successful. */
  const isEnableButtonVisible =
    userHasRoot &&
    (extensionData.neededColonyPermissions.length
      ? userHasArchitecture
      : true) &&
    isInstalledExtensionData(extensionData) &&
    canExtensionBeInitialized(extensionData.extensionId) &&
    !extensionData.isDeprecated &&
    !extensionData.isInitialized;

  const enableButton = isSetupRoute ? (
    <Button
      type="submit"
      disabled={!isValid}
      isFullSize={isMobile}
      loading={isSubmitting || waitingForEnableConfirmation}
    >
      {formatMessage({ id: 'button.enable' })}
    </Button>
  ) : (
    <Button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        navigate(`${pathname}${COLONY_EXTENSION_SETUP_ROUTE}`);
      }}
      isFullSize={isMobile}
    >
      {formatMessage({ id: 'button.enable' })}
    </Button>
  );

  const isUpgradeButtonVisible =
    !!user &&
    extensionData &&
    isInstalledExtensionData(extensionData) &&
    extensionData.currentVersion < extensionData.availableVersion;

  return (
    <>
      <div className="flex flex-col sm:items-center sm:flex-row sm:gap-2 sm:grow">
        <HeadingIcon name={extensionData.name} icon={extensionData.icon} />
        <div className="flex justify-between items-center mt-4 sm:mt-0 gap-4 sm:grow sm:shrink-0">
          <ExtensionStatusBadge
            mode={extensionStatusMode}
            text={extensionStatusText}
          />
          <ActiveInstalls activeInstalls={activeInstalls} />
        </div>
      </div>
      {isInstallButtonVisible && (
        <InstallButton extensionData={extensionData} />
      )}
      {isEnableButtonVisible && enableButton}
      {isUpgradeButtonVisible && (
        <ActionButton<ButtonProps>
          actionType={ActionTypes.EXTENSION_UPGRADE}
          values={{ colonyAddress, extensionData }}
          transform={transformUpgrade}
          onSuccess={() => {
            toast.success(
              <Toast
                type="success"
                title={{ id: 'extensionUpgrade.toast.title.success' }}
                description={{
                  id: 'extensionUpgrade.toast.description.success',
                }}
              />,
            );
          }}
          onError={() => {
            toast.error(
              <Toast
                type="error"
                title={{ id: 'extensionUpgrade.toast.title.error' }}
                description={{ id: 'extensionUpgrade.toast.description.error' }}
              />,
            );
          }}
          button={Button}
          buttonProps={{
            mode: 'primarySolid',
            isFullSize: isMobile,
            disabled: isUpgradeButtonDisabled,
            children: formatMessage({ id: 'button.updateVersion' }),
          }}
        />
      )}
    </>
  );
};

ActionButtons.displayName = displayName;

export default ActionButtons;
