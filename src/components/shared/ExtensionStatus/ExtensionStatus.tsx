import React from 'react';
import { defineMessages } from 'react-intl';
import camelCase from 'lodash/camelCase';

import Tag from '~shared/Tag';

import styles from './ExtensionStatus.css';

const displayName = 'ExtensionStatus';

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
  installedExtension?: any | null; // @TODO: Add proper typing
}

const ExtensionStatus = ({
  deprecatedOnly = false,
  installedExtension,
}: Props) => {
  let status;
  let theme;

  if (!installedExtension) {
    status = MSG.notInstalled;
  } else if (!installedExtension.details?.initialized) {
    status = MSG.notEnabled;
    theme = 'golden';
  } else if (installedExtension.details?.missingPermissions.length) {
    status = MSG.missingPermissions;
    theme = 'danger';
  } else if (installedExtension.details?.initialized) {
    status = MSG.enabled;
    theme = 'primary';
  } else {
    status = MSG.installed;
  }

  return (
    <div className={styles.tagContainer}>
      {!deprecatedOnly ? (
        <Tag
          appearance={{ theme }}
          text={status}
          data-test={`${camelCase(status.defaultMessage)}StatusTag`}
        />
      ) : null}
      {installedExtension && installedExtension.details?.deprecated ? (
        <Tag
          appearance={{ theme: 'danger' }}
          text={MSG.deprecated}
          data-test="deprecatedStatusTag"
        />
      ) : null}
    </div>
  );
};

ExtensionStatus.displayName = displayName;

export default ExtensionStatus;
