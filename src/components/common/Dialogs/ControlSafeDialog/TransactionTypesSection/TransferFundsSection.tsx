import React, {
  useCallback,
  useEffect,
  /* useMemo, */
  useState,
} from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';
/* import moveDecimal from 'move-decimal-point'; */

/* import { DEFAULT_TOKEN_DECIMALS } from '~constants'; */
import { DialogSection } from '~shared/Dialog';
/* import { getSafe, getSelectedSafeBalance } from '~utils/safes'; */
/* import { log } from '~utils/debug'; */
import { Message } from '~types/index';
import Icon from '~shared/Icon';
import {
  getTxServiceBaseUrl,
  getChainNameFromSafe,
} from '~redux/sagas/utils/safeHelpers';

/* import AmountBalances from '../AmountBalances'; */
import { ErrorMessage as Error, Loading, RecipientPicker } from './shared';
import styles from './TransactionTypesSection.css';
import { TransactionSectionProps } from '../types';

const displayName = `common.ControlSafeDialog.TransferFundsSection`;

export const MSG = defineMessages({
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

export interface TransferFundsProps extends TransactionSectionProps {
  /* can we do better with the types here? */
  savedTokenState: [
    Record<string, unknown>,
    React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
  ];
}

const TransferFundsSection = ({
  colony,
  /* colony: { metadata }, */
  disabledInput,
  transactionFormIndex,
  /* handleInputChange,
   * handleValidation, */
  savedTokenState,
}: TransferFundsProps) => {
  const [isLoadingBalances, setIsLoadingBalances] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<Message>('');
  const [savedTokens, setSavedTokens] = savedTokenState;

  const { watch, setValue } = useFormContext();
  const safe = watch('safe');
  /* const transactions = watch('transactions');
   * const safeBalances = watch('safeBalances'); */
  const setSafeBalances = (value) => setValue('safeBalances', value);

  /* const safes = metadata?.safes || []; */

  const safeAddress = safe?.profile.walletAddress;

  const getSafeBalance = useCallback(async () => {
    setBalanceError('');
    if (safe) {
      setIsLoadingBalances(true);
      try {
        const chainName = getChainNameFromSafe(safe.profile.displayName);
        const baseUrl = getTxServiceBaseUrl(chainName);
        const response = await fetch(
          `${baseUrl}/v1/safes/${safeAddress}/balances/`,
        );
        if (response.status === 200) {
          const data = await response.json();
          setSavedTokens((tokens) => ({
            ...tokens,
            [safeAddress as string]: data,
          }));
          setSafeBalances(data);
        }
      } catch (e) {
        setBalanceError(MSG.balancesError);
        /* log.error(e); */
      } finally {
        setIsLoadingBalances(false);
      }
    }
    // setSafeBalances causes infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safe, safeAddress, setSavedTokens]);

  /* const selectedTokenAddress =
   *   transactions[transactionFormIndex].tokenData?.address; */

  /* const selectedBalance = useMemo(
   *   () => getSelectedSafeBalance(safeBalances, selectedTokenAddress),
   *   [safeBalances, selectedTokenAddress],
   * ); */

  /* const selectedSafe = getSafe(safes, safe); */

  useEffect(() => {
    if (safeAddress) {
      const savedTokenData = savedTokens[safeAddress];
      if (savedTokenData) {
        setSafeBalances(savedTokenData);
        setBalanceError('');
      } else {
        getSafeBalance();
      }
    }
    // setSafeBalances causes infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeAddress, getSafeBalance, savedTokens]);

  /* const formattedSafeBalance = moveDecimal(
   *   selectedBalance?.balance || 0,
   *   -(selectedBalance?.token?.decimals || DEFAULT_TOKEN_DECIMALS),
   * ); */

  if (isLoadingBalances) {
    return <Loading message={MSG.balancesLoading} />;
  }

  if (balanceError) {
    return <Error error={balanceError} />;
  }

  return (
    <>
      <DialogSection>
        {/* <AmountBalances
          selectedSafe={selectedSafe}
          safeBalances={safeBalances}
          disabledInput={disabledInput}
          handleChange={handleInputChange}
          maxButtonParams={{
            fieldName: `transactions.${transactionFormIndex}.amount`,
            maxAmount: `${formattedSafeBalance}`,
            setFieldValue,
            customOnClickFn() {
              handleValidation();
              setTimeout(
                () =>
                  setFieldTouched(
                    `transactions.${transactionFormIndex}.amount`,
                    true,
                    false,
                  ),
                0,
              );
            },
          }}
          transactionFormIndex={transactionFormIndex}
          handleValidation={handleValidation}
        /> */}
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
          transactionFormIndex={transactionFormIndex}
          disabledInput={disabledInput}
        />
      </DialogSection>
    </>
  );
};

TransferFundsSection.displayName = displayName;

export default TransferFundsSection;
