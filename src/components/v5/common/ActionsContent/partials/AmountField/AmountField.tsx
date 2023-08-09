import React, { FC, useState } from 'react';
import Cleave from 'cleave.js/react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';

import { useAmountField } from './hooks';
import TokenIcon from '~shared/TokenIcon';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import Card from '~v5/shared/Card';
import styles from './AmountField.module.css';
import Numeral from '~shared/Numeral';
import { useColonyContext, useDetectClickOutside } from '~hooks';
import useToggle from '~hooks/useToggle';
import { SelectProps } from '../../types';
import { CleaveChangeEvent } from './types';

const displayName = 'v5.common.ActionsContent.partials.AmountField';

const AmountField: FC<SelectProps> = ({ name }) => {
  const { formatMessage } = useIntl();
  const { watch, register, setValue } = useFormContext();
  const { colony } = useColonyContext();
  const { nativeToken } = colony || {};

  const nativeTokenAddress = nativeToken?.tokenAddress || '';
  const [token, setToken] = useState<string>(nativeTokenAddress);
  const [
    isTokenSelectVisible,
    { toggle: toggleTokenSelect, toggleOff: toggleOffTokenSelect },
  ] = useToggle();

  const selectedTeam = watch('team');

  const {
    colonyTokens,
    dynamicCleaveOptionKey,
    inputWidth,
    onInput,
    formattingOptions,
    selectedToken,
  } = useAmountField(token);

  const handleCleaveChange = (e: CleaveChangeEvent) => {
    setValue(name, e.target.rawValue);
  };

  const ref = useDetectClickOutside({
    onTriggered: () => toggleOffTokenSelect(),
  });

  return (
    <div className="flex items-center gap-3 w-full" ref={ref}>
      <Cleave
        {...register(name)}
        name={name}
        key={dynamicCleaveOptionKey}
        options={formattingOptions}
        className="placeholder:text-gray-500 text-gray-900"
        placeholder="0"
        onInput={onInput}
        onChange={handleCleaveChange}
        style={{ width: `${inputWidth || 0.65}rem` }}
      />
      <div className="sm:relative w-full">
        <button
          type="button"
          className={styles.button}
          onClick={toggleTokenSelect}
          aria-label={formatMessage({ id: 'ariaLabel.selectToken' })}
        >
          <TokenIcon token={selectedToken || colonyTokens[0]} size="xs" />
          <span className="text-md">
            {selectedToken?.symbol || colonyTokens[0].symbol}
          </span>
        </button>
        <input
          type="text"
          {...register('tokenAddress')}
          name="tokenAddress"
          id="tokenAddress"
          className="hidden"
          value={selectedToken?.tokenAddress || ''}
        />
        {isTokenSelectVisible && (
          <Card
            className="py-4 px-2.5 w-full sm:max-w-[20.375rem] absolute top-[calc(100%+0.5rem)] left-0 z-50"
            hasShadow
            rounded="s"
          >
            <h5 className="text-4 text-gray-400 mb-4 uppercase">
              {formatMessage({ id: 'actionSidebar.availableTokens' })}
            </h5>
            <ul>
              {colonyTokens.map((colonyToken) => {
                const tokenBalance = getBalanceForTokenAndDomain(
                  colony?.balances,
                  colonyToken.tokenAddress,
                  selectedTeam,
                );

                return (
                  <li key={colonyToken.tokenAddress} className="mb-4 last:mb-0">
                    <button
                      type="button"
                      className={clsx(styles.button, 'justify-between w-full')}
                      onClick={() => {
                        setToken(colonyToken.tokenAddress);
                        setValue('tokenAddress', colonyToken.tokenAddress);
                        toggleTokenSelect();
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <TokenIcon token={colonyToken} size="xs" />
                        <span className="text-md">{colonyToken.symbol}</span>
                      </div>
                      {tokenBalance && (
                        <span className="text-sm text-gray-400">
                          {formatMessage({
                            id: 'actionSidebar.availableFunds',
                          })}
                          {': '}
                          <Numeral
                            value={tokenBalance}
                            decimals={getTokenDecimalsWithFallback(
                              colonyToken?.decimals,
                            )}
                          />{' '}
                          {colonyToken.symbol}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};

AmountField.displayName = displayName;

export default AmountField;
