import classnames from 'classnames';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import {
  ADDRESS_ZERO,
  DEFAULT_TOKEN_DECIMALS,
  ETHEREUM_NETWORK,
  SUPPORTED_SAFE_NETWORKS,
} from '~constants';
import { TokenType } from '~gql';
import { Input, TokenSymbolSelector } from '~shared/Fields';
import { MaxButtonParams } from '~shared/Fields/Input';
import { Safe, SafeBalance, Token } from '~types';

import styles from './AmountBalances.css';

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
  const { watch, setValue, trigger } = useFormContext();

  const selectedTokenData: Token = watch(
    `transactions.${transactionIndex}.token`,
  );
  const setSelectedTokenData = (value: Token) =>
    setValue(`transactions.${transactionIndex}.token`, value);

  const tokens: Token[] = (safeBalances || []).map((balance) => {
    // If selected safe balance uses an ERC20 token
    if (balance?.token?.type === TokenType.Erc20) {
      return balance.token;
    }
    // Otherwise retrieve the safe chain's native token
    const safeNetworkData = SUPPORTED_SAFE_NETWORKS.find(
      (network) => Number(selectedSafe?.chainId) === network.chainId,
    );
    // @NOTE: We know nativeToken is defined for Ethereum network.
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
    const token = safeNetworkData?.nativeToken || ETHEREUM_NETWORK.nativeToken!;

    return {
      tokenAddress: ADDRESS_ZERO,
      ...token,
    };
  });

  // Set token data in form state on initialisation. Ensures native token is always preselected
  useEffect(() => {
    // Check if the selected token is present in the balances
    const isTokenInBalances = safeBalances?.some(
      (b) =>
        b.token?.tokenAddress && // Check if the token address is defined
        selectedTokenData?.tokenAddress && // Check if the selected token address is defined
        b.token.tokenAddress === selectedTokenData.tokenAddress, // Compare the token addresses
    );

    // If the token is not in balances or is undefined, select the first token from the list
    if (!isTokenInBalances) {
      setSelectedTokenData(tokens[0]); // Set the selected token data to the native token
    }

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
            name={`transactions.${transactionIndex}.token.tokenAddress`}
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
              trigger(`transactions.${transactionIndex}.amount`);
            }}
          />
        </div>
      </div>
    </div>
  );
};

AmountBalances.displayName = displayName;

export default AmountBalances;
