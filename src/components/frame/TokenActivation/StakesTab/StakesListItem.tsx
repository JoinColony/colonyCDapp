import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Link from '~shared/Link';
import Numeral from '~shared/Numeral';
import { useTokenActivationContext } from '~hooks';

import styles from './StakesTab.css';
import { useGetMotionTransactionHashQuery } from '~gql';

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
  motionId: string;
}

const StakesListItem = ({
  stakedAmount,
  tokenSymbol,
  colonyName,
  motionId,
}: Props) => {
  const { setIsOpen } = useTokenActivationContext();
  const { data } = useGetMotionTransactionHashQuery({
    variables: {
      motionId,
    },
  });

  const txHash = data?.getColonyActionByMotionId?.items[0]?.id ?? '';
  return (
    <li className={styles.stakesListItem}>
      <Link to={txHash ? `/colony/${colonyName}/tx/${txHash}` : ''}>
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
