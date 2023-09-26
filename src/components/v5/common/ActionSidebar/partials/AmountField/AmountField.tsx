import React, { FC } from 'react';
import Cleave from 'cleave.js/react';
import { useIntl } from 'react-intl';
import clsx from 'clsx';
import { useController, useFormContext } from 'react-hook-form';

import { useAmountField } from './hooks';
import TokenIcon from '~shared/TokenIcon';
import {
  getBalanceForTokenAndDomain,
  getTokenDecimalsWithFallback,
} from '~utils/tokens';
import Card from '~v5/shared/Card';
import styles from './AmountField.module.css';
import Numeral from '~shared/Numeral';
import { useColonyContext } from '~hooks';
import useToggle from '~hooks/useToggle';
import { AmountFieldProps, CleaveChangeEvent } from './types';
import { useRelativePortalElement } from '~hooks/useRelativePortalElement';
import Portal from '~v5/shared/Portal';

const displayName = 'v5.common.ActionsContent.partials.AmountField';

const AmountField: FC<AmountFieldProps> = ({ name }) => {
  const { formatMessage } = useIntl();
  const { watch } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name: `${name}.amount`,
  });
  const {
    field: tokenAddressController,
    fieldState: { error: tokenAddressError },
  } = useController({
    name: `${name}.tokenAddress`,
  });
  const isError = !!error || !!tokenAddressError;
  const { colony } = useColonyContext();
  const [
    isTokenSelectVisible,
    { toggle: toggleTokenSelect, registerContainerRef },
  ] = useToggle();

  const selectedTeam = watch('team');

  const {
    colonyTokens,
    dynamicCleaveOptionKey,
    inputWidth,
    onInput,
    formattingOptions,
    selectedToken,
  } = useAmountField(tokenAddressController.value);

  const handleCleaveChange = (e: CleaveChangeEvent) => {
    field.onChange(e.target.rawValue);
  };

  const { portalElementRef, relativeElementRef } = useRelativePortalElement<
    HTMLButtonElement,
    HTMLDivElement
  >([isTokenSelectVisible], {
    top: 8,
  });

  return (
    <div className="flex items-center gap-3 w-full" ref={registerContainerRef}>
      <Cleave
        name={name}
        key={dynamicCleaveOptionKey}
        options={formattingOptions}
        className={clsx('text-gray-900', {
          'placeholder:text-gray-500': !isError,
          'placeholder:text-negative-400': isError,
        })}
        placeholder="0"
        onInput={onInput}
        value={field.value}
        onChange={handleCleaveChange}
        style={{ width: `${inputWidth || 0.65}rem` }}
      />
      <div className="sm:relative w-full">
        <button
          type="button"
          ref={relativeElementRef}
          className={clsx(styles.button, 'text-gray-500')}
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
          id="tokenAddress"
          className="hidden"
          {...tokenAddressController}
        />
        {isTokenSelectVisible && (
          <Portal>
            <Card
              className="absolute z-[60]"
              hasShadow
              rounded="s"
              ref={(ref) => {
                registerContainerRef(ref);
                portalElementRef.current = ref;
              }}
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
                    <li
                      key={colonyToken.tokenAddress}
                      className="mb-4 last:mb-0"
                    >
                      <button
                        type="button"
                        className={clsx(
                          styles.button,
                          'justify-between w-full',
                        )}
                        onClick={() => {
                          tokenAddressController.onChange(
                            colonyToken.tokenAddress,
                          );
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
          </Portal>
        )}
      </div>
    </div>
  );
};

AmountField.displayName = displayName;

export default AmountField;
