import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import ExternalLink from '~shared/Extensions/ExternalLink';

import { BETA_DISCLAIMER } from '~constants/externalUrls';

import styles from './BetaCautionAlert.css';

const MSG = {
  beta: {
    id: 'BetaCautionAlert.beta',
    defaultMessage: 'BETA 🤓',
  },
  cautionText: {
    id: 'BetaCautionAlert.cautionText',
    defaultMessage: 'Use with caution!',
  },
};

const BetaCautionAlert = () => {
  const [isHovered, setIsHovered] = useState(false);

  const toggleHover = (hasHover) => setIsHovered(hasHover);

  return (
    <div
      className={styles.container}
      onMouseEnter={() => toggleHover(true)}
      onMouseLeave={() => toggleHover(false)}
    >
      {isHovered ? (
        <ExternalLink
          text={{ id: 'text.learnMore' }}
          className={styles.link}
          href={BETA_DISCLAIMER}
        />
      ) : (
        <>
          <div className={styles.pinkStripe} />
          <div>
            <div className={styles.betaText}>
              <FormattedMessage {...MSG.beta} />
            </div>
            <div className={styles.cautionText}>
              <FormattedMessage {...MSG.cautionText} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BetaCautionAlert;
