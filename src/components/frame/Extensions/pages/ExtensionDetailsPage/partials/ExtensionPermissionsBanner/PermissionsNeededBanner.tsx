import { ColonyRole, Id } from '@colony/colony-js';
import { WarningCircle } from '@phosphor-icons/react';
import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { waitForDbAfterExtensionAction } from '~frame/Extensions/pages/ExtensionDetailsPage/utils.tsx';
import useAsyncFunction from '~hooks/useAsyncFunction.ts';
import useExtensionData, { ExtensionMethods } from '~hooks/useExtensionData.ts';
import { ActionTypes } from '~redux/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
import NotificationBanner from '~v5/shared/NotificationBanner/index.ts';

const displayName =
  'frame.Extensions.ExtensionDetailsPage.PermissionsNeededBanner';

const MSG = defineMessages({
  missingPermission: {
    id: `${displayName}.missingPermission`,
    defaultMessage:
      'This extension is missing some or all of the permissions it needs to work.',
  },
  enablePermission: {
    id: `${displayName}.enablePermission`,
    defaultMessage: 'Enable permissions',
  },
});

interface Props {
  extensionData: AnyExtensionData;
  setHasSuccessfullyEnabled: (value: boolean) => void;
}

const PermissionsNeededBanner = ({
  extensionData,
  setHasSuccessfullyEnabled,
}: Props) => {
  const { colony, refetchColony } = useColonyContext();
  const { user } = useAppContext();

  const userHasRoles = addressHasRoles({
    requiredRolesDomain: Id.RootDomain,
    colony,
    requiredRoles: [ColonyRole.Root],
    address: user?.walletAddress || '',
  });

  const asyncFunction = useAsyncFunction({
    submit: ActionTypes.EXTENSION_ENABLE,
    error: ActionTypes.EXTENSION_ENABLE_ERROR,
    success: ActionTypes.EXTENSION_ENABLE_SUCCESS,
  });

  const { refetchExtensionData } = useExtensionData(extensionData.extensionId);
  const { setIsPendingManagement } = useExtensionDetailsPageContext();

  const enableAndCheckStatus = async () => {
    setIsPendingManagement(true);
    await asyncFunction({
      colonyAddress: colony.colonyAddress,
      extensionData,
    });
    refetchColony();
    await waitForDbAfterExtensionAction({
      method: ExtensionMethods.ENABLE,
      refetchExtensionData,
    });
    setIsPendingManagement(false);
  };

  const handleEnableClick = async () => {
    try {
      await enableAndCheckStatus();
      setHasSuccessfullyEnabled(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <NotificationBanner
      icon={WarningCircle}
      status="warning"
      className="mb-6"
      callToAction={
        userHasRoles && (
          <button type="button" onClick={handleEnableClick}>
            <FormattedMessage {...MSG.enablePermission} />
          </button>
        )
      }
    >
      <FormattedMessage {...MSG.missingPermission} />
    </NotificationBanner>
  );
};

PermissionsNeededBanner.displayName = displayName;

export default PermissionsNeededBanner;
