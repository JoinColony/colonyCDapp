import { Star } from '@phosphor-icons/react';
import Decimal from 'decimal.js';
import React, { type FC } from 'react';
import { useIntl } from 'react-intl';

import useUserReputation from '~hooks/useUserReputation.ts';
import Numeral from '~shared/Numeral/index.ts';
import { calculatePercentageReputation, ZeroValue } from '~utils/reputation.ts';
import {
  getFormattedTokenValue,
  getTokenDecimalsWithFallback,
} from '~utils/tokens.ts';
import TitleLabel from '~v5/shared/TitleLabel/index.ts';

import reputationTabClasses from '../ReputationTab.styles.ts';
import { type TotalReputationProps } from '../types.ts';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.TotalReputation';

const TotalReputation: FC<TotalReputationProps> = ({
  colonyAddress,
  wallet,
  nativeToken,
}) => {
  const { formatMessage } = useIntl();
  const { userReputation, totalReputation } = useUserReputation({
    colonyAddress,
    walletAddress: wallet?.address,
  });

  const percentageReputation = calculatePercentageReputation(
    userReputation || '0',
    totalReputation || '0',
  );

  const formattedReputationPoints = getFormattedTokenValue(
    new Decimal(userReputation || 0).toString(),
    getTokenDecimalsWithFallback(nativeToken.decimals),
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
      <div className="flex flex-col gap-4 pb-6 pt-2">
        <div className={reputationTabClasses.row}>
          <span className={reputationTabClasses.rowName}>
            {formatMessage({ id: 'total.balance' })}
          </span>
          <div className="flex items-center">
            <Star className={reputationTabClasses.icon} size={12} />
            {percentageReputation === ZeroValue.NearZero && (
              <span className={reputationTabClasses.reputationValue}>
                {percentageReputation}
              </span>
            )}
            {percentageReputation &&
              percentageReputation !== ZeroValue.NearZero && (
                <Numeral
                  className={reputationTabClasses.reputationValue}
                  value={percentageReputation || 0}
                  suffix=" %"
                  appearance={{ size: 'small' }}
                />
              )}
          </div>
        </div>
        <div className={reputationTabClasses.row}>
          <span className={reputationTabClasses.rowName}>
            {formatMessage({ id: 'reputation.points' })}
          </span>
          <Numeral
            value={formattedReputationPoints}
            suffix=" pts"
            appearance={{ size: 'small' }}
          />
        </div>
      </div>
    </div>
  );
};

TotalReputation.displayName = displayName;

export default TotalReputation;
