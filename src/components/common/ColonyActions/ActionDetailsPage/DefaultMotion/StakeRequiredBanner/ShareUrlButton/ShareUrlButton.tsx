import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import ClipboardCopy from '~shared/ClipboardCopy';
import { Tooltip } from '~shared/Popover';

import styles from './ShareUrlButton.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakeRequiredBanner.ShareUrlButton';

const MSG = defineMessages({
  shareUrl: {
    id: `${displayName}.shareUrl`,
    defaultMessage: `Share URL`,
  },
  copyURLTooltip: {
    id: `${displayName}.copyURLTooltip`,
    defaultMessage: `URL copied to clipboard`,
  },
});

const ShareUrlButton = () => (
  <span className={styles.share}>
    <Tooltip
      placement="left"
      trigger="click"
      content={<FormattedMessage {...MSG.copyURLTooltip} />}
    >
      <ClipboardCopy
        value={window.location.href}
        appearance={{ theme: 'white' }}
        text={MSG.shareUrl}
      />
    </Tooltip>
  </span>
);

ShareUrlButton.displayName = displayName;

export default ShareUrlButton;
