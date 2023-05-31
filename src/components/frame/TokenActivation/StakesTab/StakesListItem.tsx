import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Link from '~shared/Link';
import Numeral from '~shared/Numeral';
import { useTokenActivationContext } from '~hooks';

import styles from './StakesTab.css';

const displayName = 'frame.TokenActivation.StakesTab.StakesListItem';

const MSG = defineMessages({
  motionUrl: {
    id: `${displayName}.motionUrl`,
    defaultMessage: 'Go to motion',
  },
});

interface Props {
  stakedAmount: string;
  tokenSymbol: string;
  colonyName: string;
  txHash: string;
}

const StakesListItem = ({
  stakedAmount,
  tokenSymbol,
  colonyName,
  txHash,
}: Props) => {
  const { setIsOpen } = useTokenActivationContext();

  return (
    <li className={styles.stakesListItem}>
      <Link to={`/colony/${colonyName}/tx/${txHash}`}>
        <div
          role="button"
          onClick={() => setIsOpen(false)}
          onKeyDown={() => setIsOpen(false)}
          tabIndex={0}
          data-test="goToMotion"
        >
          <div>
            <Numeral value={stakedAmount} suffix={tokenSymbol} />
          </div>
          <div className={styles.falseLink}>
            <FormattedMessage {...MSG.motionUrl} />
          </div>
        </div>
      </Link>
    </li>
  );
};

export default StakesListItem;
