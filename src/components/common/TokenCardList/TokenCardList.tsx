import React from 'react';

import CardList from '~shared/CardList';
import { ColonyTokens } from '~gql';

import TokenCard from '../TokenCard';

import styles from './TokenCardList.css';

type ValidCols = 'auto' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

interface Appearance {
  /** Number of columns the grid should contain at its widest (read: max number of columns). Should be auto, or between 1 and 9 (inclusive). Default is `auto`. */
  numCols: ValidCols;
}

interface Props {
  appearance?: Appearance;
  domainId?: number;
  tokens: ColonyTokens[];
}

const displayName = 'dashboard.TokenCardList';

const TokenCardList = ({ appearance, domainId = 1, tokens }: Props) => (
  <div className={styles.tokenCardContainer} data-test="userTokenCards">
    <CardList appearance={appearance}>
      {tokens.map(({ token }) => (
        <div key={token.tokenAddress} data-test="tokenCardItem">
          <TokenCard domainId={domainId} token={token} />
        </div>
      ))}
    </CardList>
  </div>
);

TokenCardList.displayName = displayName;

export default TokenCardList;
