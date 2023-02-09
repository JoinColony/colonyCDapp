import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Alert from '~shared/Alert';
import ClipboardCopy from '~shared/ClipboardCopy';
import { Tooltip } from '~shared/Popover';

import styles from './StakeRequiredBanner.css';

const displayName = `common.ColonyActions.ActionDetailsPage.DefaultMotion.StakeRequiredBanner`;

const MSG = defineMessages({
  stakeRequired: {
    id: `${displayName}.stakeRequired`,
    defaultMessage: `{isDecision, select,
      true {Decision}
      other {Motion}
      } requires at least 10% stake to appear in the
      {isDecision, select,
        true {Decisions}
        other {actions}
        } list.`,
  },
  shareUrl: {
    id: `${displayName}.shareUrl`,
    defaultMessage: `Share URL`,
  },
  copyURLTooltip: {
    id: `${displayName}.copyURLTooltip`,
    defaultMessage: `URL copied to clipboard`,
  },
});

type Props = {
  isDecision?: boolean;
};

const StakeRequiredBanner = ({ isDecision = false }: Props) => (
  <div
    className={styles.stakeRequiredBannerContainer}
    data-test="stakeRequiredBanner"
  >
    <Alert
      appearance={{
        theme: 'pinky',
        margin: 'none',
        borderRadius: 'none',
      }}
    >
      <div className={styles.stakeRequiredBanner}>
        <FormattedMessage {...MSG.stakeRequired} values={{ isDecision }} />
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
      </div>
    </Alert>
  </div>
);

StakeRequiredBanner.displayName = displayName;

export default StakeRequiredBanner;
