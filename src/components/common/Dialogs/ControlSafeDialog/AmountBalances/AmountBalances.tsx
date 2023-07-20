import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import classnames from 'classnames';
import { useFormContext } from 'react-hook-form';

import { HookFormInput as Input, TokenSymbolSelector } from '~shared/Fields';
import {
  ADDRESS_ZERO,
  BINANCE_NETWORK,
  DEFAULT_TOKEN_DECIMALS,
  ETHEREUM_NETWORK,
  SAFE_NETWORKS,
} from '~constants';
/* import { AnyToken } from '~data/index'; */
import { MaxButtonParams } from '~shared/Fields/Input/HookForm';
import { Safe, SafeBalance } from '~types';

import styles from './AmountTokens.css';
/* import { TransferFundsProps } from '../TransactionTypesSection/TransferFundsSection'; */

/* interface Props extends Pick<TransferFundsProps, 'handleValidation'> { */
interface Props {
  safeBalances: SafeBalance[];
  disabledInput: boolean;
  selectedSafe: Safe | undefined;
  transactionFormIndex: number;
  maxButtonParams: MaxButtonParams;
  /* handleChange: () => void; */
}

const MSG = defineMessages({
  amount: {
    id: 'dashboard.ControlSafeDialog.AmountBalances.amount',
    defaultMessage: 'Amount',
  },
  token: {
    id: 'dashboard.ControlSafeDialog.AmountBalances.address',
    defaultMessage: 'Token',
  },
});

const displayName = 'dashboard.ControlSafeDialog.AmountBalances';

const AmountBalances = ({
  selectedSafe,
  safeBalances,
  disabledInput,
  transactionFormIndex,
  /* handleValidation, */
  /* handleChange, */
  maxButtonParams,
}: Props) => {
  const { watch, setValue } = useFormContext();

  const selectedTokenData = watch(
    `transactions.${transactionFormIndex}.tokenData`,
  );
  const setSelectedTokenData = (value) =>
    setValue(`transactions.${transactionFormIndex}.tokenData`, value);

  const tokens: any[] = (safeBalances || []).map((balance) => {
    // If selected safe balance uses an ERC20 token
    if (balance.token && balance.tokenAddress) {
      return {
        ...balance.token,
        address: balance.tokenAddress,
      };
    }
    // Otherwise retrieve the safe chain's native token
    const safeNetworkData = SAFE_NETWORKS.find(
      (network) => Number(selectedSafe?.chainId) === network.chainId,
    );
    const getNetworkName = () => {
      if (safeNetworkData?.chainId === BINANCE_NETWORK.chainId) {
        return 'binance';
      }
      return (
        safeNetworkData?.name.toLowerCase() ||
        ETHEREUM_NETWORK.name.toLowerCase()
      );
    };

    return {
      ...(safeNetworkData?.nativeToken || ETHEREUM_NETWORK.nativeToken),
      address: ADDRESS_ZERO,
      networkName: getNetworkName(),
    };
  });

  // Set token data in form state on initialisation. Ensures native token is always preselected
  useEffect(() => {
    const isTokenInBalances = safeBalances?.some(
      (b) => b.tokenAddress === selectedTokenData?.address,
    );
    if (!isTokenInBalances) {
      setSelectedTokenData(tokens[0]);
    }

    // selectedTokenData and setSelectedTokenData cause infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeBalances]);

  /* useEffect(() => {
   *   if (selectedSafe) {
   *     handleValidation();
   *   }
   * }, [selectedSafe, handleValidation]); */

  return (
    <div className={styles.tokenAmount}>
      <div
        className={classnames(styles.tokenAmountInputContainer, {
          [styles.inputContainerMaxButton]: !!maxButtonParams,
        })}
      >
        <Input
          label={MSG.amount}
          name={`transactions.${transactionFormIndex}.amount`}
          appearance={{
            theme: 'minimal',
            align: 'right',
          }}
          /* onChange={handleChange} */
          formattingOptions={{
            delimiter: ',',
            numeral: true,
            numeralPositiveOnly: true,
            numeralDecimalScale:
              selectedTokenData?.decimals || DEFAULT_TOKEN_DECIMALS,
          }}
          disabled={disabledInput}
          maxButtonParams={maxButtonParams}
        />
      </div>
      <div className={styles.tokenAmountContainer}>
        <div className={styles.tokenAmountSelect}>
          <TokenSymbolSelector
            label={MSG.token}
            tokens={tokens}
            name={`transactions.${transactionFormIndex}.tokenData.address`}
            elementOnly
            appearance={{ alignOptions: 'right', theme: 'grey' }}
            disabled={disabledInput}
            onChange={(value) => {
              const selectedToken = tokens.find(
                (token) => token.address === value,
              );
              // can only select a token from "tokens"
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              setSelectedTokenData(selectedToken!);
              /* handleValidation(); */
            }}
          />
        </div>
      </div>
    </div>
  );
};

AmountBalances.displayName = displayName;

export default AmountBalances;
