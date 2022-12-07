import React from 'react';
import { defineMessages } from 'react-intl';

import Tag from '~shared/Tag';
import { ExtensionStatus } from '~gql';
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
  extension: AnyExtensionData;
}

const ExtensionStatusBadge = ({ deprecatedOnly = false, extension }: Props) => {
  let status;
  let theme;

  if (!isInstalledExtensionData(extension)) {
    status = MSG.notInstalled;
  } else if (extension?.status === ExtensionStatus.Installed) {
    status = MSG.notEnabled;
    theme = 'golden';
  }
  // else if (installedExtension.details?.missingPermissions.length) {
  //   status = MSG.missingPermissions;
  //   theme = 'danger';
  // }
  // else if (installedExtension.details?.initialized) {
  //   status = MSG.enabled;
  //   theme = 'primary';
  // }
  // else {
  //   status = MSG.installed;
  // }

  return (
    <div className={styles.tagContainer}>
      {!deprecatedOnly ? <Tag appearance={{ theme }} text={status} /> : null}
      {isInstalledExtensionData(extension) && extension.isDeprecated ? (
        <Tag appearance={{ theme: 'danger' }} text={MSG.deprecated} />
      ) : null}
    </div>
  );
};

ExtensionStatusBadge.displayName = displayName;

export default ExtensionStatusBadge;
