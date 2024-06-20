import { Extension, Id } from '@colony/colony-js';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useMobile } from '~hooks/index.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux/index.ts';
import {
  COLONY_EXTENSIONS_ROUTE,
  COLONY_EXTENSION_SETUP_ROUTE,
} from '~routes/index.ts';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { getUserRolesForDomain } from '~transformers';
import { type AnyExtensionData } from '~types/extensions.ts';
import { userHasRole } from '~utils/checks/userHasRoles.ts';
import {
  getDefaultStakeFraction,
  isInstalledExtensionData,
} from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';

import { useExtensionDetailsPageContext } from '../context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '../types.ts';
import { waitForDbAfterExtensionAction } from '../utils.tsx';
import { extractColonyRoles } from '~utils/colonyRoles.ts';

interface InstallButtonProps {
  extensionData: AnyExtensionData;
  isVisible?: boolean;
}

const displayName = 'pages.ExtensionDetailsPage.InstallButton';

const InstallButton = ({
  extensionData,

  isVisible,
}: InstallButtonProps) => {
  const {
    colony,
    colony: {
      colonyAddress,
      name: colonyName,
      nativeToken: { decimals },
    },
    isSupportedColonyVersion,
  } = useColonyContext();
  const { setActiveTab, setWaitingForActionConfirmation } =
    useExtensionDetailsPageContext();

  const { refetchExtensionData } = useExtensionData(extensionData.extensionId);
  const [isInstallDisabled, setIsInstallDisabled] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const navigate = useNavigate();

  const isMobile = useMobile();
  const isStakedExpenditureExtension =
    extensionData.extensionId === Extension.StakedExpenditure;

  const handleEnableExtensionAsyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_ENABLE,
    error: ActionTypes.EXTENSION_ENABLE_ERROR,
    success: ActionTypes.EXTENSION_ENABLE_SUCCESS,
  });

  const isExtensionInstalled =
    extensionData && isInstalledExtensionData(extensionData);

  useEffect(() => {
    const handleEnableExtension = async () => {
      if (!isExtensionInstalled) {
        return;
      }

      setWaitingForActionConfirmation(true);
      try {
        setIsPolling(true);
        const extensionRoles = getUserRolesForDomain({
          colonyRoles: extractColonyRoles(colony.roles),
          userAddress: extensionData.address,
          domainId: Id.RootDomain,
        });

        const missingPermissions = extensionData.neededColonyPermissions.filter(
          (neededRole) => {
            return !userHasRole(extensionRoles, neededRole);
          },
        );

        const updatedExtensionData = {
          ...extensionData,
          missingColonyPermissions: missingPermissions,
        };

        await handleEnableExtensionAsyncFunction({
          colonyAddress,
          extensionData: updatedExtensionData,
          stakeFraction: getDefaultStakeFraction(decimals),
        });

        await waitForDbAfterExtensionAction({
          method: ExtensionMethods.ENABLE,
          refetchExtensionData,
        });

        setIsPolling(false);

        toast.success(
          <Toast
            type="success"
            title={{ id: 'extensionEnable.toast.title.success' }}
            description={{
              id: 'extensionEnable.toast.description.success',
            }}
          />,
        );

        setActiveTab(ExtensionDetailsPageTabId.Settings);
      } catch {
        toast.error(
          <Toast
            type="error"
            title={{ id: 'extensionEnable.toast.title.error' }}
            description={{ id: 'extensionEnable.toast.description.error' }}
          />,
        );
      } finally {
        setWaitingForActionConfirmation(false);
        setIsPolling(false);
      }
    };

    if (
      isExtensionInstalled &&
      !extensionData.isEnabled &&
      isStakedExpenditureExtension &&
      !extensionData.isDeprecated
    ) {
      handleEnableExtension();
    }
  }, [
    colony,
    colonyAddress,
    decimals,
    extensionData,
    handleEnableExtensionAsyncFunction,
    isExtensionInstalled,
    isStakedExpenditureExtension,
    refetchExtensionData,
    setActiveTab,
    setWaitingForActionConfirmation,
  ]);

  const handleInstallSuccess = async () => {
    setIsInstallDisabled(true);
    setIsPolling(true);

    try {
      await waitForDbAfterExtensionAction({
        method: ExtensionMethods.INSTALL,
        refetchExtensionData,
      });

      setIsPolling(false);

      toast.success(
        <Toast
          type="success"
          title={{ id: 'extensionInstall.toast.title.success' }}
          description={{
            id: 'extensionInstall.toast.description.success',
          }}
        />,
      );

      if (extensionData.extensionId === Extension.VotingReputation) {
        navigate(
          `/${colonyName}/${COLONY_EXTENSIONS_ROUTE}/${extensionData?.extensionId}/${COLONY_EXTENSION_SETUP_ROUTE}`,
        );
      }
    } catch {
      setIsInstallDisabled(false);
      setIsPolling(false);
      toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionInstall.toast.title.error' }}
          description={{ id: 'extensionInstall.toast.description.error' }}
        />,
      );
    } finally {
      setIsInstallDisabled(false);
    }
  };

  const handleInstallError = () => {
    setIsInstallDisabled(false);
    toast.error(
      <Toast
        type="error"
        title={{ id: 'extensionInstall.toast.title.error' }}
        description={{ id: 'extensionInstall.toast.description.error' }}
      />,
    );
  };

  return (
    <ActionButton
      actionType={ActionTypes.EXTENSION_INSTALL}
      isLoading={isPolling}
      values={{ colonyAddress, extensionData }}
      onSuccess={handleInstallSuccess}
      onError={handleInstallError}
      isFullSize={isMobile}
      disabled={isInstallDisabled || !isSupportedColonyVersion}
      className={clsx({ hidden: !isVisible })}
    >
      {formatText({ id: 'button.install' })}
    </ActionButton>
  );
};

InstallButton.displayName = displayName;

export default InstallButton;
