import React from 'react';
import { defineMessages } from 'react-intl';
import { useColonyContext } from '~hooks';

import { ActionTypes } from '~redux';
import { ActionButton, IconButton } from '~shared/Button';
import { AnyExtensionData } from '~types';
import { isInstalledExtensionData } from '~utils/extensions';

const displayName = 'common.Extensions.ExtensionActionButton';

const MSG = defineMessages({
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

  return <div>WIP...</div>;
};

ExtensionActionButton.displayName = displayName;

export default ExtensionActionButton;
