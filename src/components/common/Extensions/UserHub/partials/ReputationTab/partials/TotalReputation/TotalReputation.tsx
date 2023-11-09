import React, { FC } from 'react';
import Decimal from 'decimal.js';

import { useUserReputation } from '~hooks';
import { calculatePercentageReputation, ZeroValue } from '~utils/reputation';
import Icon from '~shared/Icon';
import Numeral from '~shared/Numeral';
import { getFormattedTokenValue } from '~utils/tokens';
import { formatText } from '~utils/intl';
import { DEFAULT_TOKEN_DECIMALS } from '~constants';

import ReputationTabSection from '../ReputationTabSection';
import { TotalReputationProps } from './types';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.TotalReputation';

const TotalReputation: FC<TotalReputationProps> = ({
  colonyAddress,
  wallet,
  className,
}) => {
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
    <ReputationTabSection
      className={className}
      title={formatText({ id: 'reputation.in.colony' }) || ''}
      // @todo: add action
      additionalHeadingContent={
        <button
          type="button"
          aria-label={formatText({ id: 'ariaLabel.viewAll' })}
          className="text-blue-400 text-4 hover:text-gray-900 transition-all duration-normal"
        >
          {formatText({ id: 'view.all' })}
        </button>
      }
      items={[
        {
          key: '1',
          title: formatText({ id: 'total.balance' }) || '',
          value: (
            <div className="flex items-center">
              <Icon
                className="text-blue-400 w-[0.875rem] mr-1"
                name="star"
                appearance={{ size: 'extraTiny' }}
                titleValues={{ reputation: percentageReputation }}
              />
              {percentageReputation === ZeroValue.NearZero && (
                <span className="text-blue-400 mt-px">
                  {percentageReputation}
                </span>
              )}
              {percentageReputation &&
                percentageReputation !== ZeroValue.NearZero && (
                  <Numeral
                    className="text-blue-400 mt-px"
                    value={percentageReputation || 0}
                    suffix="%"
                    appearance={{ size: 'small' }}
                  />
                )}
            </div>
          ),
        },
        {
          key: '2',
          title: formatText({ id: 'reputation.points' }) || '',
          value: (
            <Numeral
              value={formattedReputationPoints}
              suffix="pts"
              appearance={{ size: 'small' }}
            />
          ),
        },
      ]}
    />
  );
};

TotalReputation.displayName = displayName;

export default TotalReputation;
