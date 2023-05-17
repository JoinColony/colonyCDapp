import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useGetUserTokenBalanceQuery } from '~gql';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import Numeral from '~shared/Numeral';
import styles from '../ReputationTab.module.css';
import { BalanceProps } from '../types';
import PopoverButton from '~shared/Extensions/PopoverButton';
import { useMobile } from '~hooks';

const displayName = 'common.Extensions.UserHub.partials.ReputationTab.partials.Balance';

const Balance: FC<BalanceProps> = ({ nativeToken, wallet }) => {
  const { formatMessage } = useIntl();
  const isMobile = useMobile();

  const { data: tokenBalanceQueryData } = useGetUserTokenBalanceQuery({
    variables: {
      input: {
        walletAddress: wallet?.address ?? '',
        tokenAddress: nativeToken?.tokenAddress ?? '',
      },
    },
    skip: !wallet?.address || !nativeToken?.tokenAddress,
  });
  const tokenBalanceData = tokenBalanceQueryData?.getUserTokenBalance;

  const tokenDecimals = useMemo(() => getTokenDecimalsWithFallback(nativeToken?.decimals), [nativeToken]);

  return (
    <div>
      <div className="text-gray-400 text-xs font-medium uppercase">{formatMessage({ id: 'balance.in.colony' })}</div>
      <div className="flex flex-col gap-[1.3125rem] pt-2 pb-[1.625rem] border-b border-gray-100">
        <div className={styles.row}>
          <span className={styles.rowName}>{formatMessage({ id: 'total.balance' })}</span>
          <div className={styles.value}>
            <Numeral
              className={styles.numeral}
              value={tokenBalanceData?.balance ?? 0}
              decimals={tokenDecimals}
              suffix={nativeToken?.symbol || 'CLNY'}
            />
          </div>
        </div>
        {/* @TODO: actived icons? */}
        <div>
          <div className={styles.row}>
            <div className="flex flex-row gap-4 items-center">
              <span className={styles.rowName}>{formatMessage({ id: 'active' })}</span>
              {!isMobile && (
                <div className="flex flex-row gap-2">
                  <PopoverButton type="deposit" />
                  <PopoverButton type="withdraw" />
                </div>
              )}
            </div>
            <div className={styles.value}>
              <Numeral
                className={styles.numeral}
                value={tokenBalanceData?.activeBalance ?? 0}
                decimals={tokenDecimals}
                suffix={nativeToken?.symbol || 'CLNY'}
              />
            </div>
          </div>
          {isMobile && (
            <div className="flex flex-row gap-2 w-full mt-3">
              <PopoverButton type="deposit" isFullWidth />
              <PopoverButton type="withdraw" isFullWidth />
            </div>
          )}
        </div>

        {/* @TODO: stacked icon vievd? */}
        <div>
          <div className={styles.row}>
            <div className="flex flex-row gap-4 items-center">
              <span className={styles.rowName}>{formatMessage({ id: 'staked' })}</span>
              {!isMobile && <PopoverButton type="view" />}
            </div>
            <div className={styles.value}>
              <Numeral
                className={styles.numeral}
                value={tokenBalanceData?.lockedBalance ?? 0}
                decimals={tokenDecimals}
                suffix={nativeToken?.symbol || 'CLNY'}
              />
            </div>
          </div>
          {isMobile && (
            <div className="mt-3">
              <PopoverButton type="view" isFullWidth />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Balance.displayName = displayName;

export default Balance;
