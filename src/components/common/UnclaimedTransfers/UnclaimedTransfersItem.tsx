import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { ActionButton } from '~shared/Button';
import Numeral from '~shared/Numeral';
import CopyableAddress from '~shared/CopyableAddress';
import TokenIcon from '~shared/TokenIcon';

import { ActionTypes } from '~redux';
import { mergePayload } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { ColonyFundsClaim } from '~gql';
import { useColonyContext } from '~hooks';

import styles from './UnclaimedTransfersItem.css';

const displayName = 'common.UnclaimedTransfers.UnclaimedTransfersItem';

const MSG = defineMessages({
  buttonClaim: {
    id: `${displayName}.buttonClaim`,
    defaultMessage: 'Claim for colony',
  },
  from: {
    id: `${displayName}.from`,
    defaultMessage: 'From {sender}',
  },
  unknownToken: {
    id: `${displayName}unknownToken`,
    defaultMessage: 'Unknown Token',
  },
});

interface Props {
  claim: ColonyFundsClaim;
}

const UnclaimedTransfersItem = ({ claim }: Props) => {
  const { colony, canInteractWithColony } = useColonyContext();

  const token = claim?.token;

  const transform = mergePayload({
    colonyAddress: colony?.colonyAddress,
    tokenAddress: token?.tokenAddress,
  });

  return (
    <li>
      <div className={styles.content}>
        <div className={styles.tokenWrapper}>
          <TokenIcon token={token} size="s" />
          <div className={styles.tokenName}>
            {token.symbol ? (
              <span>{token.symbol}</span>
            ) : (
              <>
                <FormattedMessage {...MSG.unknownToken} />
                <CopyableAddress>{token.tokenAddress}</CopyableAddress>
              </>
            )}
          </div>
        </div>
        <div className={styles.claimWrapper}>
          <div className={styles.amountWrapper}>
            <Numeral
              value={claim?.amount}
              decimals={getTokenDecimalsWithFallback(token.decimals)}
              className={styles.amount}
            />
            <span className={styles.tokenSymbol}>{token.symbol}</span>
          </div>
          <ActionButton
            text={MSG.buttonClaim}
            className={styles.button}
            submit={ActionTypes.CLAIM_TOKEN}
            error={ActionTypes.CLAIM_TOKEN_ERROR}
            success={ActionTypes.CLAIM_TOKEN_SUCCESS}
            transform={transform}
            disabled={!canInteractWithColony}
            dataTest="claimForColonyButton"
          />
        </div>
      </div>
    </li>
  );
};

UnclaimedTransfersItem.displayName = displayName;

export default UnclaimedTransfersItem;
