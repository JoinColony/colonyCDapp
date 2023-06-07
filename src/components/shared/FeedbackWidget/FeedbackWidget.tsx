import React from 'react';
import { FormattedMessage } from 'react-intl';

import ExternalLink from '~shared/Extensions/ExternalLink';
import { FEEDBACK } from '~constants/externalUrls';

import styles from './FeedbackWidget.css';

const MSG = {
  loveFeedback: {
    id: 'FeedbackWidget.loveFeedback',
    defaultMessage: 'We {heart} feedback!',
  },
};

const FeedbackWidget = () => (
  <div className={styles.main}>
    <ExternalLink className={styles.link} href={FEEDBACK}>
      <FormattedMessage
        {...MSG.loveFeedback}
        values={{
          heart: (
            <span role="img" className={styles.heart} aria-label="">
              ♥️
            </span>
          ),
        }}
      />
    </ExternalLink>
  </div>
);

export default FeedbackWidget;
