import Decimal from 'decimal.js';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import { DEFAULT_TOKEN_DECIMALS } from '~constants/index.ts';
import useUserReputation from '~hooks/useUserReputation.ts';
import Icon from '~shared/Icon/index.ts';
import Numeral from '~shared/Numeral/index.ts';
import { calculatePercentageReputation, ZeroValue } from '~utils/reputation.ts';
import { getFormattedTokenValue } from '~utils/tokens.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import { type TotalReputationProps } from '../types.ts';

import styles from '../ReputationTab.module.css';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.TotalReputation';

const TotalReputation: FC<TotalReputationProps> = ({
  colonyAddress,
  wallet,
}) => {
  const { formatMessage } = useIntl();
  const { userReputation, totalReputation } = useUserReputation(
    colonyAddress,
    wallet?.address,
  );

  const percentageReputation = calculatePercentageReputation(
    userReputation || '0',
    totalReputation || '0',
  );

  const formattedReputationPoints = getFormattedTokenValue(
    new Decimal(userReputation || 0).toString(),
    DEFAULT_TOKEN_DECIMALS,
  );

  return (
    <div className="border-b border-gray-200 pt-6">
      <div className="flex items-center justify-between">
        <TitleLabel text={formatMessage({ id: 'reputation.in.colony' })} />
        {/* @BETA: add action */}
        {/* <button */}
        {/*   type="button" */}
        {/*   aria-label={formatMessage({ id: 'ariaLabel.viewAll' })} */}
        {/*   className="text-blue-400 text-4 hover:text-gray-900 transition-all duration-normal" */}
        {/* > */}
        {/*   {formatMessage({ id: 'view.all' })} */}
        {/* </button> */}
      </div>
      <div className="flex flex-col gap-4 pt-2 pb-6">
        <div className={styles.row}>
          <span className={styles.rowName}>
            {formatMessage({ id: 'total.balance' })}
          </span>
          <div className="flex items-center">
            <Icon
              className={styles.icon}
              name="star"
              appearance={{ size: 'extraTiny' }}
              titleValues={{ reputation: percentageReputation }}
            />
            {percentageReputation === ZeroValue.NearZero && (
              <span className={styles.reputationValue}>
                {percentageReputation}
              </span>
            )}
            {percentageReputation &&
              percentageReputation !== ZeroValue.NearZero && (
                <Numeral
                  className={styles.reputationValue}
                  value={percentageReputation || 0}
                  suffix="%"
                  appearance={{ size: 'small' }}
                />
              )}
          </div>
        </div>
        <div className={styles.row}>
          <span className={styles.rowName}>
            {formatMessage({ id: 'reputation.points' })}
          </span>
          <Numeral
            value={formattedReputationPoints}
            suffix="pts"
            appearance={{ size: 'small' }}
          />
        </div>
      </div>
    </div>
  );
};

TotalReputation.displayName = displayName;

export default TotalReputation;
