import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { ActionTypes } from '~redux';
import Button, { ActionButton, IconButton } from '~shared/Button';
import { AnyExtensionData } from '~types';
import { isInstalledExtensionData } from '~utils/extensions';
import { waitForElement } from '~utils/dom';
import { useColonyContext, useMobile } from '~hooks';

const displayName = 'common.Extensions.ExtensionActionButton';

const MSG = defineMessages({
  enable: {
    id: `${displayName}.enable`,
    defaultMessage: 'Enable',
  },
  install: {
    id: `${displayName}.install`,
    defaultMessage: 'Install',
  },
});

interface Props {
  extensionData: AnyExtensionData;
}

const ExtensionActionButton = ({ extensionData }: Props) => {
  const { colony } = useColonyContext();
  const isMobile = useMobile();
  const navigate = useNavigate();

  const handleEnableButtonClick = useCallback(async () => {
    navigate(
      `/colony/${colony?.name}/extensions/${extensionData.extensionId}/setup`,
    );
    // Generate a smooth scroll to `Form` on mobile when clicking `Enable`
    if (isMobile) {
      const offset = (await waitForElement('#enableExtnTitle')).offsetTop;
      const scrollContainer = await waitForElement('#simpleNav');
      scrollContainer.scrollTo({ top: offset - 20, behavior: 'smooth' });
    }
  }, [colony?.name, navigate, isMobile, extensionData.extensionId]);

  if (!colony) {
    return null;
  }

  if (!isInstalledExtensionData(extensionData)) {
    return (
      <ActionButton
        button={IconButton}
        submit={ActionTypes.EXTENSION_INSTALL}
        error={ActionTypes.EXTENSION_INSTALL_ERROR}
        success={ActionTypes.EXTENSION_INSTALL_SUCCESS}
        values={{
          colonyAddress: colony.colonyAddress,
          extensionData,
        }}
        text={MSG.install}
      />
    );
  }

  if (!extensionData.isInitialized) {
    return (
      <Button
        appearance={{ theme: 'primary', size: 'medium' }}
        onClick={handleEnableButtonClick}
        text={MSG.enable}
      />
    );
  }

  return <div>WIP...</div>;
};

ExtensionActionButton.displayName = displayName;

export default ExtensionActionButton;
