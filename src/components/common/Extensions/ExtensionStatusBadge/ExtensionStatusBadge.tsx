import React from 'react';
import { defineMessages } from 'react-intl';

import Tag from '~shared/Tag';
import { isInstalledExtensionData } from '~utils/extensions';
import { AnyExtensionData } from '~types';

import styles from './ExtensionStatusBadge.css';

const displayName = 'common.Extensions.ExtensionStatusBadge';

const MSG = defineMessages({
  installed: {
    id: `${displayName}.installed`,
    defaultMessage: 'Installed',
  },
  notInstalled: {
    id: `${displayName}.notInstalled`,
    defaultMessage: 'Not installed',
  },
  missingPermissions: {
    id: `${displayName}.missingPermissions`,
    defaultMessage: 'Missing permissions',
  },
  deprecated: {
    id: `${displayName}.deprecated`,
    defaultMessage: 'Deprecated',
  },
  enabled: {
    id: `${displayName}.enabled`,
    defaultMessage: 'Enabled',
  },
  notEnabled: {
    id: `${displayName}.notEnabled`,
    defaultMessage: 'Disabled',
  },
});

interface Props {
  deprecatedOnly?: boolean;
  extensionData: AnyExtensionData;
}

const ExtensionStatusBadge = ({
  deprecatedOnly = false,
  extensionData,
}: Props) => {
  let status;
  let theme;

  if (!isInstalledExtensionData(extensionData)) {
    status = MSG.notInstalled;
  } else if (!extensionData.isInitialized) {
    status = MSG.notEnabled;
    theme = 'golden';
  }
  // else if (installedExtension.details?.missingPermissions.length) {
  //   status = MSG.missingPermissions;
  //   theme = 'danger';
  // }
  else if (extensionData.isInitialized) {
    status = MSG.enabled;
    theme = 'primary';
  } else {
    status = MSG.installed;
  }

  return (
    <div className={styles.tagContainer}>
      {!deprecatedOnly && <Tag appearance={{ theme }} text={status} />}
      {isInstalledExtensionData(extensionData) &&
        extensionData.isDeprecated && (
          <Tag appearance={{ theme: 'danger' }} text={MSG.deprecated} />
        )}
    </div>
  );
};

ExtensionStatusBadge.displayName = displayName;

export default ExtensionStatusBadge;
