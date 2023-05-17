import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Decimal from 'decimal.js';
import { useUserReputation } from '~hooks';
import { ReputationProps } from '../types';
import styles from '../ReputationTab.module.css';
import { calculatePercentageReputation, ZeroValue } from '~utils/reputation';
import Icon from '~shared/Icon';
import Numeral from '~shared/Numeral';
import { getFormattedTokenValue } from '~utils/tokens';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

const displayName = 'common.Extensions.UserHub.partials.ReputationTab.partials.TotalReputation';

const TotalReputation: FC<ReputationProps> = ({ colonyAddress, wallet }) => {
  const { formatMessage } = useIntl();
  const { userReputation, totalReputation } = useUserReputation(colonyAddress, wallet?.address);

  const percentageReputation = calculatePercentageReputation(userReputation || '0', totalReputation || '0');

  const formattedReputationPoints = getFormattedTokenValue(
    new Decimal(userReputation || 0).toString(),
    DEFAULT_TOKEN_DECIMALS,
  );

  return (
    <div className="border-b border-gray-100 pt-6">
      <div className="flex items-center justify-between">
        <div className="text-gray-400 text-xs font-medium uppercase">
          {formatMessage({ id: 'reputation.in.colony' })}
        </div>
        {/* @TODO: add action */}
        <button type="button" aria-label="view all" className="text-blue-400 font-medium text-xs">
          {formatMessage({ id: 'view.all' })}
        </button>
      </div>

      <div className="flex flex-col gap-[1.3125rem] pt-2 pb-[1.625rem]">
        <div className={styles.row}>
          <span className={styles.rowName}>{formatMessage({ id: 'total.balance' })}</span>
          <div className="flex items-center">
            <Icon
              className={styles.icon}
              name="star"
              appearance={{ size: 'extraTiny' }}
              titleValues={{ reputation: percentageReputation }}
            />
            {percentageReputation === ZeroValue.NearZero && (
              <div className={styles.reputationValue}>{percentageReputation}</div>
            )}
            {percentageReputation && percentageReputation !== ZeroValue.NearZero && (
              <Numeral className={styles.reputationValue} value={percentageReputation || 0} suffix="%" />
            )}
          </div>
        </div>
        <div className={`${styles.row} [&>span]:text-sm`}>
          <div className={styles.rowName}>{formatMessage({ id: 'reputation.points' })}</div>
          <Numeral className="text-gray-900 font-medium" value={formattedReputationPoints} suffix="pts" />
        </div>
      </div>
    </div>
  );
};

TotalReputation.displayName = displayName;

export default TotalReputation;
