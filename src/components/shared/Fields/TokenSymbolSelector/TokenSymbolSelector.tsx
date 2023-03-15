import React, { useMemo } from 'react';

import { HookFormSelect as Select } from '~shared/Fields';
import TokenIcon from '~shared/TokenIcon';
import { Token } from '~types';

import { SelectProps } from '../Select/types';

import styles from './TokenSymbolSelector.css';

interface Props extends Omit<SelectProps, 'options'> {
  tokens: Token[];
}

const displayName = 'TokenSymbolSelector';

const TokenSymbolSelector = ({ tokens, ...props }: Props) => {
  const tokenOptions = useMemo(
    () =>
      tokens.map((token) => {
        const labelElement = (
          elementType: 'labelElement' | 'optionElement',
        ) => (
          <div className={styles[elementType]}>
            <TokenIcon token={token} size="xxs" />
            <span
              className={elementType === 'labelElement' ? styles.symbol : ''}
            >
              {token.symbol || '???'}
            </span>
          </div>
        );

        return {
          value: token.tokenAddress,
          label: token.symbol,
          labelElement: labelElement('labelElement'),
          children: labelElement('optionElement'),
        };
      }),
    [tokens],
  );

  return <Select options={tokenOptions} {...props} />;
};

TokenSymbolSelector.displayName = displayName;

export default TokenSymbolSelector;
