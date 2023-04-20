import React from 'react';
import { defineMessages } from 'react-intl';
import { BigNumberish } from 'ethers';

import Heading from '~shared/Heading';
import Numeral from '~shared/Numeral';
import TokenIcon from '~shared/TokenIcon';
import { getFormattedTokenValue } from '~utils/tokens';
import { Token } from '~types';

import styles from './UserInfoPopover.css';

const displayName = `UserInfoPopover.UserTokens`;

interface Props {
  totalBalance: BigNumberish;
  nativeToken: Token;
}

const MSG = defineMessages({
  labelText: {
    id: `${displayName}.labelText`,
    defaultMessage: 'Tokens',
  },
});

const UserTokens = ({ totalBalance, nativeToken }: Props) => {
  const formattedTotalBalance = getFormattedTokenValue(totalBalance, nativeToken.decimals);

  return (
    <div className={styles.sectionContainer}>
      <Heading
        appearance={{
          size: 'normal',
          theme: 'grey',
          weight: 'bold',
        }}
        text={MSG.labelText}
      />
      <div className={styles.tokenAmount}>
        <TokenIcon token={nativeToken} size="xxs" />
        <Numeral value={formattedTotalBalance} suffix={nativeToken.symbol} />
      </div>
    </div>
  );
};

UserTokens.displayName = displayName;

export default UserTokens;
