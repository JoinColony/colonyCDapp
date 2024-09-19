import { Extension } from '@colony/colony-js';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/NewExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/NewExtensionDetailsPage/types.ts';
import { waitForDbAfterExtensionAction } from '~frame/Extensions/pages/NewExtensionDetailsPage/utils.tsx';
import { useMobile } from '~hooks/index.ts';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux/index.ts';
import Toast from '~shared/Extensions/Toast/Toast.tsx';
import { type AnyExtensionData } from '~types/extensions.ts';
import {
  getDefaultStakeFraction,
  isInstalledExtensionData,
} from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import ActionButton from '~v5/shared/Button/ActionButton.tsx';

interface InstallButtonProps {
  extensionData: AnyExtensionData;
}

const displayName = 'pages.ExtensionDetailsPage.InstallButton';

const InstallButton = ({ extensionData }: InstallButtonProps) => {
  const {
    colony,
    colony: {
      colonyAddress,
      nativeToken: { decimals },
    },
    isSupportedColonyVersion,
    refetchColony,
  } = useColonyContext();
  const { setActiveTab, setWaitingForActionConfirmation } =
    useExtensionDetailsPageContext();

  const { refetchExtensionData } = useExtensionData(extensionData.extensionId);
  const [isPolling, setIsPolling] = useState(false);

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
    // @TODO: Refactor auto-enable to use extension config
    const handleEnableExtension = async () => {
      if (!isExtensionInstalled) {
        return;
      }

      setWaitingForActionConfirmation(true);
      try {
        setIsPolling(true);
        // const extensionRoles = getUserRolesForDomain({
        //   colonyRoles: extractColonyRoles(colony.roles),
        //   userAddress: extensionData.address,
        //   domainId: Id.RootDomain,
        // });

        // const missingPermissions = extensionData.neededColonyPermissions.filter(
        //   (neededRole) => {
        //     return !userHasRole(extensionRoles, neededRole);
        //   },
        // );

        // const updatedExtensionData = {
        //   ...extensionData,
        //   missingColonyPermissions: missingPermissions,
        // };

        await handleEnableExtensionAsyncFunction({
          colonyAddress,
          // extensionData: updatedExtensionData,
          extensionData,
          stakeFraction: getDefaultStakeFraction(decimals),
        });

        await waitForDbAfterExtensionAction({
          method: ExtensionMethods.ENABLE,
          refetchExtensionData,
        });

        await refetchColony();

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
    refetchColony,
  ]);

  const handleInstallSuccess = async () => {
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

      setActiveTab(ExtensionDetailsPageTabId.Settings);
    } catch {
      setIsPolling(false);
      toast.error(
        <Toast
          type="error"
          title={{ id: 'extensionInstall.toast.title.error' }}
          description={{ id: 'extensionInstall.toast.description.error' }}
        />,
      );
    }
  };

  const handleInstallError = () => {
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
      disabled={!isSupportedColonyVersion}
    >
      {formatText({ id: 'button.install' })}
    </ActionButton>
  );
};

InstallButton.displayName = displayName;

export default InstallButton;
