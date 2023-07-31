import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useGetUserTokenBalanceQuery } from '~gql';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~shared/Numeral';
import styles from '../ReputationTab.module.css';
import { BalanceProps } from '../types';
import PopoverButton from '~shared/Extensions/PopoverButton';
import { useColonyContext, useMobile } from '~hooks';
import TitleLabel from '~v5/shared/TitleLabel';

const displayName =
  'common.Extensions.UserHub.partials.ReputationTab.partials.Balance';

const Balance: FC<BalanceProps> = ({ nativeToken, wallet }) => {
  const { colony } = useColonyContext();
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const { data: tokenBalanceQueryData } = useGetUserTokenBalanceQuery({
    variables: {
      input: {
        walletAddress: wallet?.address ?? '',
        tokenAddress: nativeToken?.tokenAddress ?? '',
        colonyAddress: colony?.colonyAddress ?? '',
      },
    },
    skip: !wallet?.address || !nativeToken?.tokenAddress,
  });
  const tokenBalanceData = tokenBalanceQueryData?.getUserTokenBalance;

  const tokenDecimals = useMemo(
    () => getTokenDecimalsWithFallback(nativeToken?.decimals),
    [nativeToken],
  );

  return (
    <div>
      <TitleLabel text={formatMessage({ id: 'balance.in.colony' })} />
      <div className="flex flex-col gap-4 pt-2 pb-6 border-b border-gray-100">
        <div className={styles.row}>
          <span className={styles.rowName}>
            {formatMessage({ id: 'total.balance' })}
          </span>
          <Numeral
            className={styles.numeral}
            value={tokenBalanceData?.balance ?? 0}
            decimals={tokenDecimals}
            suffix={nativeToken?.symbol || 'CLNY'}
            appearance={{ size: 'small' }}
          />
        </div>
        {/* @TODO: actived icons? */}
        <div>
          <div className={styles.row}>
            <div className="flex gap-4 items-center">
              <span className={styles.rowName}>
                {formatMessage({ id: 'active' })}
              </span>
              {!isMobile && (
                <div className="flex gap-2">
                  <PopoverButton type="deposit" />
                  <PopoverButton type="withdraw" />
                </div>
              )}
            </div>
            <Numeral
              className={styles.numeral}
              value={tokenBalanceData?.activeBalance ?? 0}
              decimals={tokenDecimals}
              suffix={nativeToken?.symbol || 'CLNY'}
              appearance={{ size: 'small' }}
            />
          </div>
          {isMobile && (
            <div className="flex gap-2 w-full mt-3">
              <PopoverButton type="deposit" isFullSize />
              <PopoverButton type="withdraw" isFullSize />
            </div>
          )}
        </div>

        {/* @TODO: stacked icon viewed? */}
        <div>
          <div className={styles.row}>
            <div className="flex gap-4 items-center">
              <span className={styles.rowName}>
                {formatMessage({ id: 'staked' })}
              </span>
              {!isMobile && <PopoverButton type="view" />}
            </div>
            <Numeral
              className={styles.numeral}
              value={tokenBalanceData?.lockedBalance ?? 0}
              decimals={tokenDecimals}
              suffix={nativeToken?.symbol || 'CLNY'}
              appearance={{ size: 'small' }}
            />
          </div>
          {isMobile && (
            <div className="mt-3">
              <PopoverButton type="view" isFullSize />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Balance.displayName = displayName;

export default Balance;
