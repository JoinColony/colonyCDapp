import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';

import { useGetMotionTransactionHashQuery } from '~gql';
import { useTokenActivationContext } from '~hooks';
import Link from '~shared/Link';
import Numeral from '~shared/Numeral';

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
  const location = useLocation();
  const isMotionPage = location.pathname.indexOf('/tx') !== -1;

  return (
    <li className={styles.stakesListItem}>
      <Link
        replace={isMotionPage}
        to={txHash ? `/${colonyName}/tx/${txHash}` : ''}
      >
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
