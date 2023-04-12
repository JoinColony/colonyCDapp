import React from 'react';
import { defineMessages } from 'react-intl';

import Tag from '~shared/Tag';
import { isInstalledExtensionData } from '~utils/extensions';
import { AnyExtensionData } from '~types';

import styles from './ExtensionStatusBadge.css';

const displayName = 'common.Extensions.ExtensionStatusBadge';

const MSG = defineMessages({
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
  disabled: {
    id: `${displayName}.disabled`,
    defaultMessage: 'Disabled',
  },
});

interface Props {
  deprecatedOnly?: boolean;
  extensionData: AnyExtensionData;
}

const ExtensionStatusBadge = ({ deprecatedOnly = false, extensionData }: Props) => {
  let status;
  let theme;

  if (!isInstalledExtensionData(extensionData)) {
    status = MSG.notInstalled;
  } else if (extensionData.isDeprecated) {
    status = MSG.deprecated;
    theme = 'danger';
  }
  // else if (installedExtension.details?.missingPermissions.length) {
  //   status = MSG.missingPermissions;
  //   theme = 'danger';
  // }
  else if (extensionData.isEnabled) {
    status = MSG.enabled;
    theme = 'primary';
  } else {
    status = MSG.disabled;
    theme = 'golden';
  }

  const isDeprecated = isInstalledExtensionData(extensionData) && extensionData.isDeprecated;

  return (
    <div className={styles.tagContainer}>
      {(isDeprecated || !deprecatedOnly) && <Tag appearance={{ theme }} text={status} />}
    </div>
  );
};

ExtensionStatusBadge.displayName = displayName;

export default ExtensionStatusBadge;
