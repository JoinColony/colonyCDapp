import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import QuestionMarkTooltip from '~shared/QuestionMarkTooltip';

import styles from './SmallTokenAmountMessage.css';

const displayName = 'frame.TokenActivation.TokensTab.SmallTokenAmountMessage';

const MSG = defineMessages({
  smallAmountHidden: {
    id: `${displayName}.smallAmountHidden`,
    defaultMessage: 'Residual balance hidden',
  },
  tooltipText: {
    id: `${displayName}.tooltipText`,
    defaultMessage: `There is a small token balance remaining that we couldn’t display. Please click the max button to select the entire balance.`,
  },
});

const SmallTokenAmountMessage = () => (
  <div className={styles.container}>
    <FormattedMessage {...MSG.smallAmountHidden} />
    <QuestionMarkTooltip
      className={styles.tooltipIcon}
      tooltipText={MSG.tooltipText}
      tooltipClassName={styles.tooltip}
      tooltipPopperOptions={{
        placement: 'right',
      }}
    />
  </div>
);

SmallTokenAmountMessage.displayName = displayName;

export default SmallTokenAmountMessage;
