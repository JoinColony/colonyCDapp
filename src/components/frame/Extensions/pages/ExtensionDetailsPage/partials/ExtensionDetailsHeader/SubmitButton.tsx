import { ColonyRole, Id } from '@colony/colony-js';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useColonyContext } from '~context/ColonyContext/ColonyContext.ts';
import { useExtensionDetailsPageContext } from '~frame/Extensions/pages/ExtensionDetailsPage/context/ExtensionDetailsPageContext.ts';
import { ExtensionDetailsPageTabId } from '~frame/Extensions/pages/ExtensionDetailsPage/types.ts';
import { useMobile } from '~hooks/index.ts';
import { type AnyExtensionData } from '~types/extensions.ts';
import { addressHasRoles } from '~utils/checks/index.ts';
import {
  canExtensionBeInitialized,
  isInstalledExtensionData,
} from '~utils/extensions.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { ButtonWithLoader } from './ButtonWithLoader.tsx';

interface SubmitButtonProps {
  userHasRoot: boolean;
  extensionData: AnyExtensionData;
}

const displayName = 'frame.Extensions.pages.partials.SubmitButton';

const SubmitButton = ({ userHasRoot, extensionData }: SubmitButtonProps) => {
  const { user } = useAppContext();
  const { colony } = useColonyContext();
  const isMobile = useMobile();

  const { waitingForActionConfirmation, activeTab, setActiveTab } =
    useExtensionDetailsPageContext();

  const {
    formState: { isValid, isSubmitting, isDirty },
  } = useFormContext();

  const userHasArchitecture =
    !!user &&
    addressHasRoles({
      address: user.walletAddress,
      colony,
      requiredRoles: [ColonyRole.Architecture],
      requiredRolesDomain: Id.RootDomain,
    });

  const isSettingsTab = activeTab === ExtensionDetailsPageTabId.Settings;

  /* To enable, a user must have the root permission. They also need architecture for the permissions tx to be successful. */
  const isEnableButtonVisible =
    userHasRoot &&
    (extensionData.neededColonyPermissions.length
      ? userHasArchitecture
      : true) &&
    isInstalledExtensionData(extensionData) &&
    canExtensionBeInitialized(extensionData.extensionId) &&
    !extensionData.isDeprecated &&
    !extensionData.isInitialized &&
    !extensionData.autoEnableAfterInstall;

  const isSaveChangesButtonVisible =
    userHasRoot &&
    isInstalledExtensionData(extensionData) &&
    !!extensionData.configurable &&
    isSettingsTab;

  if (isEnableButtonVisible) {
    if (!isSettingsTab) {
      return (
        <Button
          type="button"
          onClick={() => {
            setActiveTab(ExtensionDetailsPageTabId.Settings);
          }}
          isFullSize={isMobile}
        >
          {formatText({ id: 'button.enable' })}
        </Button>
      );
    }

    return (
      <ButtonWithLoader
        type="submit"
        disabled={!isValid}
        isFullSize={isMobile}
        loading={isSubmitting || waitingForActionConfirmation}
      >
        {formatText({ id: 'button.enable' })}
      </ButtonWithLoader>
    );
  }

  if (isSaveChangesButtonVisible && isDirty) {
    return (
      <ButtonWithLoader
        type="submit"
        isFullSize={isMobile}
        loading={isSubmitting || waitingForActionConfirmation}
      >
        {formatText({ id: 'button.saveChanges' })}
      </ButtonWithLoader>
    );
  }

  return null;
};

SubmitButton.displayName = displayName;

export default SubmitButton;
