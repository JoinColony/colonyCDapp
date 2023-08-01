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

interface Props {
  safeBalances: SafeBalance[];
  disabledInput: boolean;
  selectedSafe: Safe | undefined;
  transactionIndex: number;
  maxButtonParams: MaxButtonParams;
}

const displayName = 'common.ControlSafeDialog.ControlSafeForm.AmountBalances';

const MSG = defineMessages({
  amount: {
    id: `${displayName}.amount`,
    defaultMessage: `Amount`,
  },
  token: {
    id: `${displayName}.address`,
    defaultMessage: `Token`,
  },
});

const AmountBalances = ({
  selectedSafe,
  safeBalances,
  disabledInput,
  transactionIndex,
  maxButtonParams,
}: Props) => {
  const { watch, setValue } = useFormContext();

  const selectedTokenData: Token = watch(
    `transactions.${transactionIndex}.tokenData`,
  );
  const setSelectedTokenData = (value: Token) =>
    setValue(`transactions.${transactionIndex}.tokenData`, value);

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

  return (
    <div className={styles.tokenAmount}>
      <div
        className={classnames(styles.tokenAmountInputContainer, {
          [styles.inputContainerMaxButton]: !!maxButtonParams,
        })}
      >
        <Input
          label={MSG.amount}
          name={`transactions.${transactionIndex}.amount`}
          appearance={{
            theme: 'minimal',
            align: 'right',
          }}
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
            name={`transactions.${transactionIndex}.tokenData.tokenAddress`}
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
            }}
          />
        </div>
      </div>
    </div>
  );
};

AmountBalances.displayName = displayName;

export default AmountBalances;
