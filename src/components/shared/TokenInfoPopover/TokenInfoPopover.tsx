import React from 'react';
import { isEmpty } from 'lodash';

import { Token } from '~types';

import TokenInfo from './TokenInfo';
import NotAvailableMessage from '../NotAvailableMessage/NotAvailableMessage';

import styles from './InfoPopover.css';

interface Props {
  token?: Token;
  isTokenNative: boolean;
}

const displayName = 'TokenInfoPopover';

const TokenInfoPopover = ({ token, isTokenNative }: Props) => {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!isEmpty(token) && token ? (
        <TokenInfo token={token} isTokenNative={isTokenNative} />
      ) : (
        <div className={styles.section}>
          <NotAvailableMessage notAvailableDataName="Token" />
        </div>
      )}
    </>
  );
};

TokenInfoPopover.displayName = displayName;

export default TokenInfoPopover;
