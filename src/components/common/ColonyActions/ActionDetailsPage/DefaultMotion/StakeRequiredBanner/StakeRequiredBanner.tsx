import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Alert, { AlertAppearance } from '~shared/Alert';

import ShareUrlButton from './ShareUrlButton';

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
});

const alertAppearance = {
  theme: 'pinky',
  margin: 'none',
  borderRadius: 'none',
} as AlertAppearance;

interface BannerTextProps {
  isDecision: boolean;
}

const BannerText = ({ isDecision }: BannerTextProps) => (
  <span className={styles.bannerText}>
    <FormattedMessage {...MSG.stakeRequired} values={{ isDecision }} />
  </span>
);

type StakeRequiredBannerProps = {
  isDecision?: boolean;
};

const StakeRequiredBanner = ({
  isDecision = false,
}: StakeRequiredBannerProps) => (
  <div className={styles.stakeRequiredBanner} data-test="stakeRequiredBanner">
    <Alert appearance={alertAppearance}>
      <BannerText isDecision={isDecision} />
      <ShareUrlButton />
    </Alert>
  </div>
);

StakeRequiredBanner.displayName = displayName;

export default StakeRequiredBanner;
