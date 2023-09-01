import React, { useCallback, useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import moveDecimal from 'move-decimal-point';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { DialogSection } from '~shared/Dialog';
import {
  getSafe,
  getSelectedSafeBalance,
  getTxServiceBaseUrl,
  getChainNameFromSafe,
} from '~utils/safes';
import {
  Message,
  SafeBalance,
  SafeBalanceApiData,
  SelectedPickerItem,
} from '~types';
import Icon from '~shared/Icon';
import { TokenType } from '~gql';

import AmountBalances from '../AmountBalances';
import { TransactionSectionProps } from '../types';

import { ErrorMessage as Error, Loading, RecipientPicker } from './shared';
import styles from './TransactionTypesSection.css';

const displayName = `common.ControlSafeDialog.TransferFundsSection`;

const MSG = defineMessages({
  amount: {
    id: `${displayName}.amount`,
    defaultMessage: 'Amount',
  },
  recipient: {
    id: `${displayName}.recipient`,
    defaultMessage: 'Select Recipient',
  },
  userPickerPlaceholder: {
    id: `${displayName}.userPickerPlaceholder`,
    defaultMessage: 'Select or paste a wallet address',
  },
  balancesLoading: {
    id: `${displayName}.balancesLoading`,
    defaultMessage: 'Loading Safe balances',
  },
  balancesError: {
    id: `${displayName}.balancesError`,
    defaultMessage:
      'Unable to fetch Safe balances. Please check your connection',
  },
  warning: {
    id: `${displayName}.warning`,
    defaultMessage: `Please confirm that the recipient’s address exists on the same chain as the selected Safe: <span>{safeChainName}</span>`,
  },
  warningIconTitle: {
    id: `${displayName}.warningIconTitle`,
    defaultMessage: 'Warning!',
  },
});

const ChainWarning = (chunks: React.ReactNode[]) => (
  <span className={styles.warningSafeChainName}>{chunks}</span>
);

interface TransferFundsProps extends TransactionSectionProps {
  savedTokenState: [
    Record<string, SafeBalance[]>,
    React.Dispatch<React.SetStateAction<Record<string, SafeBalance[]>>>,
  ];
}

const TransferFundsSection = ({
  colony,
  colony: { metadata },
  disabledInput,
  transactionIndex,
  savedTokenState,
}: TransferFundsProps) => {
  const [isLoadingBalances, setIsLoadingBalances] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<Message>('');
  const [savedTokens, setSavedTokens] = savedTokenState;

  const { watch, setValue } = useFormContext();
  const safe: SelectedPickerItem = watch('safe');
  const selectedTokenAddress: string = watch(
    `transactions.${transactionIndex}.token.tokenAddress`,
  );
  const safeBalances: SafeBalance[] = watch('safeBalances');
  const setSafeBalances = (value: SafeBalance[]) =>
    setValue('safeBalances', value);

  const safeAddress = safe?.walletAddress;

  const safes = metadata?.safes || [];

  const selectedSafe = getSafe(safes, safe);

  const getSafeBalance = useCallback(async () => {
    setBalanceError('');

    setIsLoadingBalances(true);
    try {
      const chainName = getChainNameFromSafe(safe.profile.displayName);
      const baseUrl = getTxServiceBaseUrl(chainName);
      const response = await fetch(
        `${baseUrl}/v1/safes/${safeAddress}/balances/`,
      );
      if (response.status === 200) {
        const data = (await response.json()) as SafeBalanceApiData[];
        const formattedSafeBalances: SafeBalance[] = data.map(
          (balanceData) => ({
            balance: balanceData.balance,
            token:
              balanceData.tokenAddress && balanceData.token
                ? {
                    tokenAddress: balanceData.tokenAddress,
                    name: balanceData.token.name,
                    symbol: balanceData.token.symbol,
                    decimals: balanceData.token.decimals,
                    thumbnail: balanceData.token.logoUri,
                    type: TokenType.Erc20,
                  }
                : null,
          }),
        );
        setSavedTokens((tokens) => ({
          ...tokens,
          [safeAddress as string]: formattedSafeBalances,
        }));
        setSafeBalances(formattedSafeBalances);
      }
    } catch (e) {
      setBalanceError(MSG.balancesError);
    } finally {
      setIsLoadingBalances(false);
    }
    // setSafeBalances causes infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safe, safeAddress, setSavedTokens]);

  useEffect(() => {
    const savedTokenData = savedTokens[safeAddress];
    if (savedTokenData) {
      setSafeBalances(savedTokenData);
      setBalanceError('');
    } else {
      getSafeBalance();
    }
    // setSafeBalances causes infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeAddress, getSafeBalance, savedTokens]);

  const selectedBalance = getSelectedSafeBalance(
    safeBalances,
    selectedTokenAddress,
  );

  const formattedSafeBalance = moveDecimal(
    selectedBalance?.balance || 0,
    -(selectedBalance?.token?.decimals || DEFAULT_TOKEN_DECIMALS),
  );

  if (isLoadingBalances) {
    return <Loading message={MSG.balancesLoading} />;
  }

  if (balanceError) {
    return <Error error={balanceError} />;
  }

  return (
    <>
      <DialogSection>
        <AmountBalances
          selectedSafe={selectedSafe}
          safeBalances={safeBalances}
          disabledInput={disabledInput}
          transactionIndex={transactionIndex}
          maxButtonParams={{
            maxAmount: `${formattedSafeBalance}`,
            options: { shouldValidate: true },
          }}
        />
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.warningContainer}>
          <Icon
            name="triangle-warning"
            className={styles.warningIcon}
            title={MSG.warningIconTitle}
          />
          <p>
            <FormattedMessage
              {...MSG.warning}
              values={{
                span: ChainWarning,
                safeChainName:
                  safe && getChainNameFromSafe(safe.profile.displayName),
              }}
            />
          </p>
        </div>
      </DialogSection>
      <DialogSection>
        <RecipientPicker
          colony={colony}
          transactionIndex={transactionIndex}
          disabledInput={disabledInput}
        />
      </DialogSection>
    </>
  );
};

TransferFundsSection.displayName = displayName;

export default TransferFundsSection;
