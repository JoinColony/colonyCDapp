import React, { useState } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import { useColonyContext } from '~hooks';
import { ActionTypes } from '~redux';
import { ActionButton } from '~shared/Button';
import CopyableAddress from '~shared/CopyableAddress';
import Numeral from '~shared/Numeral';
import TokenIcon from '~shared/TokenIcon';
import { ColonyClaims } from '~types';
import { mergePayload } from '~utils/actions';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import styles from './UnclaimedTransfersItem.css';

const displayName = 'common.UnclaimedTransfers.UnclaimedTransfersItem';

const MSG = defineMessages({
  buttonClaim: {
    id: `${displayName}.buttonClaim`,
    defaultMessage: `{isClaimed, select, 
      false {Claim for colony}
      other {Claimed}
    }`,
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
  claim: ColonyClaims;
}

const UnclaimedTransfersItem = ({ claim }: Props) => {
  const {
    colony,
    canInteractWithColony,
    startPollingColonyData,
    stopPollingColonyData,
  } = useColonyContext();
  const [isClaimed, setIsClaimed] = useState(false);

  const token = claim?.token;

  const transform = mergePayload({
    colonyAddress: colony?.colonyAddress,
    tokenAddresses: [token?.tokenAddress],
  });

  const handleClaimSuccess = () => {
    setIsClaimed(true);
    startPollingColonyData(1_000);
    setTimeout(stopPollingColonyData, 10_000);
  };

  return (
    <li>
      <div className={styles.content}>
        <div className={styles.tokenWrapper}>
          {token && <TokenIcon token={token} size="s" />}
          <div className={styles.tokenName}>
            {token?.symbol ? (
              <span>{token.symbol}</span>
            ) : (
              <>
                <FormattedMessage {...MSG.unknownToken} />
                <CopyableAddress>{token?.tokenAddress || ''}</CopyableAddress>
              </>
            )}
          </div>
        </div>
        <div className={styles.claimWrapper}>
          <div className={styles.amountWrapper}>
            <Numeral
              value={claim?.amount}
              decimals={getTokenDecimalsWithFallback(token?.decimals)}
              className={styles.amount}
            />
            <span className={styles.tokenSymbol}>{token?.symbol}</span>
          </div>
          <ActionButton
            text={MSG.buttonClaim}
            textValues={{ isClaimed }}
            className={styles.button}
            actionType={ActionTypes.CLAIM_TOKEN}
            transform={transform}
            onSuccess={handleClaimSuccess}
            disabled={!canInteractWithColony || isClaimed}
            dataTest="claimForColonyButton"
          />
        </div>
      </div>
    </li>
  );
};

UnclaimedTransfersItem.displayName = displayName;

export default UnclaimedTransfersItem;
