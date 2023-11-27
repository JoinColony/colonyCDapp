import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Heading3 } from '~shared/Heading';

import styles from './StakingSliderDescription.css';

const displayName =
  'common.ColonyActions.ActionDetailsPage.DefaultMotion.StakingWidget.StakingSliderDescription';

const MSG = defineMessages({
  descriptionStake: {
    id: `${displayName}.description`,
    defaultMessage: `Stake is returned if the motion passes. If there is a dispute, and the motion loses, part or all of your stake will be lost.`,
  },
  descriptionObject: {
    id: `${displayName}.description`,
    defaultMessage: `Stake will be returned if the objection succeeds. If the objection fails, part or all of your stake will be lost.`,
  },
  titleStake: {
    id: `${displayName}.title`,
    defaultMessage: `Select the amount to back the motion`,
  },
  titleObject: {
    id: `${displayName}.title`,
    defaultMessage: `Select the amount to stake the objection`,
  },
});

interface StakingSliderDescriptionProps {
  isObjection: boolean;
}

const StakingSliderDescription = ({
  isObjection,
}: StakingSliderDescriptionProps) => (
  <>
    <div className={styles.title}>
      <Heading3
        text={isObjection ? MSG.titleObject : MSG.titleStake}
        className={styles.title}
        appearance={{ size: 'normal', theme: 'dark', margin: 'none' }}
      />
    </div>
    <p className={styles.description}>
      <FormattedMessage
        {...(isObjection ? MSG.descriptionObject : MSG.descriptionStake)}
      />
    </p>
  </>
);

StakingSliderDescription.displayName = displayName;

export default StakingSliderDescription;
