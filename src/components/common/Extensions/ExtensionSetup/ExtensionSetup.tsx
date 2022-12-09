import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Navigate } from 'react-router-dom';

import { useColonyContext } from '~hooks';
import { AnyExtensionData } from '~types';
import { isInstalledExtensionData } from '~utils/extensions';

interface Props {
  extensionData: AnyExtensionData;
}

const ExtensionSetup = ({ extensionData }: Props) => {
  const { colony } = useColonyContext();

  if (!colony) {
    return null;
  }

  if (
    !isInstalledExtensionData(extensionData) ||
    extensionData.isInitialized ||
    extensionData.isDeprecated
  ) {
    return (
      <Navigate
        to={`/colony/${colony.name}/extensions/${extensionData.extensionId}`}
      />
    );
  }

  return (
    <div>
      Extension Setup <FormattedMessage {...extensionData.name} />
    </div>
  );
};

export default ExtensionSetup;
