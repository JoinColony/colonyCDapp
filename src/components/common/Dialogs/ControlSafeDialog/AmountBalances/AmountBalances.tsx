import React, { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import classnames from 'classnames';
import { useFormContext } from 'react-hook-form';

import { HookFormInput as Input, TokenSymbolSelector } from '~shared/Fields';
import {
  ADDRESS_ZERO,
  /* BINANCE_NETWORK, */
  DEFAULT_TOKEN_DECIMALS,
  ETHEREUM_NETWORK,
  SAFE_NETWORKS,
} from '~constants';
import { MaxButtonParams } from '~shared/Fields/Input/HookForm';
import { Safe, SafeBalance, Token } from '~types';
import { TokenType } from '~gql';

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

  const selectedTokenData: Token = watch(
    `transactions.${transactionFormIndex}.tokenData`,
  );
  const setSelectedTokenData = (value: Token) =>
    setValue(`transactions.${transactionFormIndex}.tokenData`, value);

  const tokens: Token[] = (safeBalances || []).map((balance) => {
    // If selected safe balance uses an ERC20 token
    if (balance?.token?.type === TokenType.Erc20) {
      return balance.token;
    }
    // Otherwise retrieve the safe chain's native token
    const safeNetworkData = SAFE_NETWORKS.find(
      (network) => Number(selectedSafe?.chainId) === network.chainId,
    );
    /* const getNetworkName = () => {
     *   if (safeNetworkData?.chainId === BINANCE_NETWORK.chainId) {
     *     return 'binance';
     *   }
     *   return (
     *     safeNetworkData?.name.toLowerCase() ||
     *     ETHEREUM_NETWORK.name.toLowerCase()
     *   );
     * }; */

    return {
      ...(safeNetworkData?.nativeToken || ETHEREUM_NETWORK.nativeToken)!,
      tokenAddress: ADDRESS_ZERO,
      /* networkName: getNetworkName(), */
    };
  });

  // Set token data in form state on initialisation. Ensures native token is always preselected
  useEffect(() => {
    setSelectedTokenData(tokens[0]);

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
            name={`transactions.${transactionFormIndex}.tokenData.tokenAddress`}
            elementOnly
            appearance={{ alignOptions: 'right', theme: 'grey' }}
            disabled={disabledInput}
            onChange={(value) => {
              const selectedToken = tokens.find(
                (token) => token.tokenAddress === value,
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
